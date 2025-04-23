import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';

const router = Router();

router.get('/competition/:competitionId/standings', async (req: Request, res: Response) => {
  const { competitionId } = req.params;

  try {
    const matches = await prisma.match.findMany({
      where: { competitionId },
      include: {
        teamA: true,
        teamB: true,
      }
    });

    const standings: Record<string, any> = {};

    for (const match of matches) {
      const { teamAId, teamBId, result } = match;

      if (!standings[teamAId]) {
        standings[teamAId] = { teamId: teamAId, name: match.teamA.name, played: 0, won: 0, draw: 0, lost: 0, points: 0 };
      }
      if (!standings[teamBId]) {
        standings[teamBId] = { teamId: teamBId, name: match.teamB.name, played: 0, won: 0, draw: 0, lost: 0, points: 0 };
      }

      standings[teamAId].played++;
      standings[teamBId].played++;

      if (result === 'TEAM_A_WIN') {
        standings[teamAId].won++;
        standings[teamBId].lost++;
        standings[teamAId].points += 3;
      } else if (result === 'TEAM_B_WIN') {
        standings[teamBId].won++;
        standings[teamAId].lost++;
        standings[teamBId].points += 3;
      } else if (result === 'DRAW') {
        standings[teamAId].draw++;
        standings[teamBId].draw++;
        standings[teamAId].points += 1;
        standings[teamBId].points += 1;
      }
    }

    const sorted = Object.values(standings).sort((a, b) => b.points - a.points);
    res.json(sorted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate standings' });
  }
});

export default router;
