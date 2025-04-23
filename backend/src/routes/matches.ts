import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { competitionId, teamAId, teamBId, scheduledAt, location } = req.body;
  const user = (req as any).user;

  try {
    // Проверка на роль
    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not allowed to create matches' });
    }

    const match = await prisma.match.create({
      data: {
        competitionId,
        teamAId,
        teamBId,
        scheduledAt: new Date(scheduledAt),
        location
      }
    });

    res.status(201).json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

router.get('/', async (req: Request, res: Response) => {
    try {
      const matches = await prisma.match.findMany({
        include: {
          competition: {
            select: { title: true }
          },
          teamA: {
            select: { name: true }
          },
          teamB: {
            select: { name: true }
          }
        },
        orderBy: {
          scheduledAt: 'asc'
        }
      });
  
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch matches' });
    }
  });

  router.patch('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { result } = req.body;
    const user = (req as any).user;
  
    try {
      // Проверка прав
      if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not allowed to update match results' });
      }
  
      // Проверка допустимого значения
      const allowedResults = ['TEAM_A_WIN', 'TEAM_B_WIN', 'DRAW', 'CANCELLED'];
      if (!allowedResults.includes(result)) {
        return res.status(400).json({ error: 'Invalid match result' });
      }
  
      const updated = await prisma.match.update({
        where: { id },
        data: { result }
      });
  
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update match result' });
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const user = (req as any).user;
  
    try {
      if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not allowed to delete match' });
      }
  
      await prisma.match.delete({
        where: { id }
      });
  
      res.json({ message: 'Match deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete match' });
    }
  });

  router.post('/competition/:competitionId/playoff', authMiddleware, async (req: Request, res: Response) => {
    const { competitionId } = req.params;
    const user = (req as any).user;
  
    try {
      if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not allowed to generate playoff matches' });
      }
  
      // Получаем завершённые матчи (с результатом)
      const matches = await prisma.match.findMany({
        where: {
          competitionId,
          NOT: { result: null },
        },
        include: {
          teamA: true,
          teamB: true,
        }
      });
  
      const standings: Record<string, any> = {};
  
      for (const match of matches) {
        const { teamAId, teamBId, result } = match;
  
        if (!standings[teamAId]) standings[teamAId] = { teamId: teamAId, name: match.teamA.name, points: 0 };
        if (!standings[teamBId]) standings[teamBId] = { teamId: teamBId, name: match.teamB.name, points: 0 };
  
        if (result === 'TEAM_A_WIN') {
          standings[teamAId].points += 3;
        } else if (result === 'TEAM_B_WIN') {
          standings[teamBId].points += 3;
        } else if (result === 'DRAW') {
          standings[teamAId].points += 1;
          standings[teamBId].points += 1;
        }
      }
  
      const sorted = Object.values(standings).sort((a, b) => b.points - a.points);
      const top4 = sorted.slice(0, 4);
  
      if (top4.length < 4) {
        return res.status(400).json({ error: 'Not enough teams for playoff (minimum 4)' });
      }
  
      const now = new Date();
  
      const playoffMatches = await prisma.match.createMany({
        data: [
          {
            competitionId,
            teamAId: top4[0].teamId,
            teamBId: top4[3].teamId,
            scheduledAt: new Date(now.getTime() + 1 * 3600 * 1000), // +1 час
            location: 'Плей-офф Полуфинал 1'
          },
          {
            competitionId,
            teamAId: top4[1].teamId,
            teamBId: top4[2].teamId,
            scheduledAt: new Date(now.getTime() + 2 * 3600 * 1000), // +2 часа
            location: 'Плей-офф Полуфинал 2'
          }
        ]
      });
  
      res.status(201).json({ message: 'Playoff matches created', playoffMatches });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to generate playoff matches' });
    }
  });

  router.post('/competition/:competitionId/final', authMiddleware, async (req: Request, res: Response) => {
    const { competitionId } = req.params;
    const user = (req as any).user;
  
    try {
      if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not allowed to create final match' });
      }
  
      const playoffMatches = await prisma.match.findMany({
        where: {
          competitionId,
          location: { contains: 'Плей-офф Полуфинал' },
          NOT: { result: null }
        }
      });
  
      if (playoffMatches.length < 2) {
        return res.status(400).json({ error: 'Two completed semifinal matches required' });
      }
  
      const getWinner = (match: any) => {
        if (match.result === 'TEAM_A_WIN') return match.teamAId;
        if (match.result === 'TEAM_B_WIN') return match.teamBId;
        return null;
      };
  
      const winner1 = getWinner(playoffMatches[0]);
      const winner2 = getWinner(playoffMatches[1]);
  
      if (!winner1 || !winner2) {
        return res.status(400).json({ error: 'One of the semifinal matches has no winner' });
      }
  
      const finalMatch = await prisma.match.create({
        data: {
          competitionId,
          teamAId: winner1,
          teamBId: winner2,
          scheduledAt: new Date(Date.now() + 3 * 3600 * 1000),
          location: 'ФИНАЛ'
        }
      });
  
      res.status(201).json(finalMatch);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create final match' });
    }
  });
  
  router.post('/competition/:competitionId/third-place', authMiddleware, async (req: Request, res: Response) => {
    const { competitionId } = req.params;
    const user = (req as any).user;
  
    if (user.role !== 'ORGANIZER' && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not allowed' });
    }
  
    const semiFinals = await prisma.match.findMany({
      where: {
        competitionId,
        location: { contains: 'Плей-офф Полуфинал' },
        NOT: { result: null }
      }
    });
  
    if (semiFinals.length < 2) {
      return res.status(400).json({ error: 'Two completed semifinals required' });
    }
  
    const getLoser = (match: any) => {
      if (match.result === 'TEAM_A_WIN') return match.teamBId;
      if (match.result === 'TEAM_B_WIN') return match.teamAId;
      return null;
    };
  
    const loser1 = getLoser(semiFinals[0]);
    const loser2 = getLoser(semiFinals[1]);
  
    if (!loser1 || !loser2) {
      return res.status(400).json({ error: 'Invalid semifinal results' });
    }
  
    const thirdPlace = await prisma.match.create({
      data: {
        competitionId,
        teamAId: loser1,
        teamBId: loser2,
        scheduledAt: new Date(Date.now() + 4 * 3600 * 1000),
        location: 'Матч за 3 место'
      }
    });
  
    res.status(201).json(thirdPlace);
  });

export default router;
