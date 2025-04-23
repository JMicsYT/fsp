import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const competitions = await prisma.competition.findMany();
    res.json(competitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post(
  '/',
  authMiddleware,
  requireRole('ORGANIZER'),
  async (req: Request, res: Response) => {
    try {
      const {
        title,
        type,
        discipline,
        region,
        registrationStart,
        registrationEnd,
        eventStart,
        eventEnd
      } = req.body;

      const user = (req as any).user;

      const competition = await prisma.competition.create({
        data: {
          title,
          type,
          discipline,
          region,
          registrationStart: new Date(registrationStart),
          registrationEnd: new Date(registrationEnd),
          eventStart: new Date(eventStart),
          eventEnd: new Date(eventEnd),
          organizerId: user.userId
        }
      });

      res.status(201).json(competition);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create competition' });
    }
  }
);

router.get('/my', authMiddleware, async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    let competitions;

    if (user.role === 'ATHLETE') {
      competitions = await prisma.competition.findMany({
        where: {
          registrations: {
            some: {
              userId: user.userId
            }
          }
        }
      });
    } else if (user.role === 'ORGANIZER') {
      competitions = await prisma.competition.findMany({
        where: {
          organizerId: user.userId
        }
      });
    } else {
      return res.status(403).json({ error: 'Not allowed' });
    }

    res.json(competitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load competitions' });
  }
});

router.post('/:competitionId/complete', authMiddleware, requireRole('ORGANIZER'), async (req: Request, res: Response) => {
  const { competitionId } = req.params;
  const user = (req as any).user;

  try {
    const finalMatch = await prisma.match.findFirst({
      where: {
        competitionId,
        location: 'ФИНАЛ',
        NOT: { result: null }
      }
    });

    if (!finalMatch) {
      return res.status(400).json({ error: 'Final match not completed yet' });
    }

    const winnerId = finalMatch.result === 'TEAM_A_WIN' ? finalMatch.teamAId : finalMatch.teamBId;
    const loserId = finalMatch.result === 'TEAM_A_WIN' ? finalMatch.teamBId : finalMatch.teamAId;

    // Сохраняем 1 и 2 место
    await prisma.result.createMany({
      data: [
        {
          competitionId,
          teamId: winnerId,
          place: 1,
        },
        {
          competitionId,
          teamId: loserId,
          place: 2,
        }
      ]
    });

    // Ищем матч за 3-е место
    const thirdMatch = await prisma.match.findFirst({
      where: {
        competitionId,
        location: 'Матч за 3 место',
        NOT: { result: null }
      }
    });

    // Сохраняем 3-е место
    if (thirdMatch) {
      const thirdPlaceTeamId =
        thirdMatch.result === 'TEAM_A_WIN'
          ? thirdMatch.teamAId
          : thirdMatch.teamBId;

      await prisma.result.create({
        data: {
          competitionId,
          teamId: thirdPlaceTeamId,
          place: 3
        }
      });
    }

    // Завершаем турнир
    await prisma.competition.update({
      where: { id: competitionId },
      data: {
        status: 'COMPLETED'
      }
    });

    res.json({ message: 'Competition completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete competition' });
  }
});

export default router;
