import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, requireRole('ATHLETE'), async (req: Request, res: Response) => {
  try {
    const { competitionId } = req.body;
    const user = (req as any).user;

    // Проверка: уже зарегистрирован?
    const existing = await prisma.registration.findFirst({
      where: {
        userId: user.userId,
        competitionId: competitionId
      }
    });

    if (existing) {
      res.status(400).json({ error: 'You are already registered for this competition' });
      return;
    }

    // Проверка дат
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId }
    });

    const now = new Date();
    if (!competition || now < competition.registrationStart || now > competition.registrationEnd) {
      res.status(400).json({ error: 'Registration is closed or competition not found' });
      return;
    }

    // Регистрация
    const registration = await prisma.registration.create({
      data: {
        userId: user.userId,
        competitionId
      }
    });

    res.status(201).json(registration);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

export default router;

