import { Router, Request, Response } from 'express';
import prisma from '../prisma/client';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, requireRole('CAPTAIN'), async (req: Request, res: Response) => {
    try {
      const { competitionId, teamName } = req.body;
      const user = (req as any).user;
  
      const existingTeam = await prisma.teamMember.findFirst({
        where: {
          userId: user.userId,
          team: {
            competitionId: competitionId
          }
        }
      });
  
      if (existingTeam) {
        res.status(400).json({ error: 'You are already in a team for this competition' });
        return;
      }
  
      const newTeam = await prisma.team.create({
        data: {
          name: teamName,
          competitionId,
          captainId: user.userId,
          members: {
            create: {
              userId: user.userId,
              isCaptain: true
            }
          }
        },
        include: {
          members: true
        }
      });
  
      res.status(201).json(newTeam);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create team' });
      return;
    }
  });

  router.get('/my', authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user;
  
    try {
      const membership = await prisma.teamMember.findFirst({
        where: {
          userId: user.userId
        },
        include: {
          team: {
            include: {
              members: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true }
                  }
                }
              },
              competition: true
            }
          }
        }
      });
  
      if (!membership) {
        res.status(404).json({ error: 'You are not part of any team' });
        return;
      }
  
      res.json(membership.team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  });

  router.post('/invite', authMiddleware, requireRole('CAPTAIN'), async (req: Request, res: Response) => {
    const { userId } = req.body;
    const captain = (req as any).user;
  
    try {
      const team = await prisma.team.findFirst({
        where: { captainId: captain.userId }
      });
  
      if (!team) {
        res.status(403).json({ error: 'You are not a captain of any team' });
        return;
      }
  
      const alreadyInvited = await prisma.teamInvitation.findFirst({
        where: {
          teamId: team.id,
          userId: userId
        }
      });
  
      if (alreadyInvited) {
        res.status(400).json({ error: 'User already invited to this team' });
        return;
      }
  
      const invitation = await prisma.teamInvitation.create({
        data: {
          teamId: team.id,
          userId: userId
          // status по умолчанию будет "PENDING"
        }
      });
  
      res.status(201).json(invitation);
    } catch (error: any) {
      if (error.code === 'P2002') {
        res.status(409).json({ error: 'Duplicate invitation' });
      } else {
        console.error(error);
        res.status(500).json({ error: 'Failed to invite user' });
      }
    }
  });

  router.get('/invitations', authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user;
  
    try {
      const invites = await prisma.teamInvitation.findMany({
        where: {
          userId: user.userId
        },
        include: {
          team: {
            include: {
              competition: true,
              captain: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
  
      res.json(invites);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch invitations' });
    }
  });

  router.post('/invite/accept', authMiddleware, requireRole('ATHLETE'), async (req: Request, res: Response) => {
    const { invitationId } = req.body;
    const user = (req as any).user;
  
    try {
      const invitation = await prisma.teamInvitation.findUnique({
        where: { id: invitationId },
        include: { team: true }
      });
  
      if (!invitation || invitation.userId !== user.userId) {
        res.status(403).json({ error: 'Invalid or unauthorized invitation' });
        return;
      }
  
      // Обновить статус
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: 'ACCEPTED' }
      });
  
      // Добавить в команду
      await prisma.teamMember.create({
        data: {
          userId: user.userId,
          teamId: invitation.teamId,
          isCaptain: false
        }
      });
  
      res.json({ message: 'Invitation accepted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to accept invitation' });
    }
  });

  router.post('/invite/reject', authMiddleware, requireRole('ATHLETE'), async (req: Request, res: Response) => {
    const { invitationId } = req.body;
    const user = (req as any).user;
  
    try {
      const invitation = await prisma.teamInvitation.findUnique({
        where: { id: invitationId }
      });
  
      if (!invitation || invitation.userId !== user.userId) {
        res.status(403).json({ error: 'Invalid or unauthorized invitation' });
        return;
      }
  
      await prisma.teamInvitation.update({
        where: { id: invitationId },
        data: { status: 'REJECTED' }
      });
  
      res.json({ message: 'Invitation rejected' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to reject invitation' });
    }
  });
  
  router.post('/join-request', authMiddleware, requireRole('ATHLETE'), async (req: Request, res: Response) => {
    const { teamId } = req.body;
    const user = (req as any).user;
  
    try {
      // Проверка: уже есть заявка?
      const existing = await prisma.teamRequest.findFirst({
        where: {
          teamId,
          userId: user.userId
        }
      });
  
      if (existing) {
        res.status(400).json({ error: 'You already requested to join this team' });
        return;
      }
  
      // Создание заявки
      const request = await prisma.teamRequest.create({
        data: {
          teamId,
          userId: user.userId,
          status: 'PENDING'
        }
      });
  
      res.status(201).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to request to join team' });
    }
  });

  router.get('/requests', authMiddleware, requireRole('CAPTAIN'), async (req: Request, res: Response) => {
    const user = (req as any).user;
  
    try {
      const team = await prisma.team.findFirst({
        where: {
          captainId: user.userId
        }
      });
  
      if (!team) {
        res.status(403).json({ error: 'You are not a captain of any team' });
        return;
      }
  
      const requests = await prisma.teamRequest.findMany({
        where: {
          teamId: team.id
        },
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });
  
      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch join requests' });
    }
  });

  router.post('/request/accept', authMiddleware, requireRole('CAPTAIN'), async (req: Request, res: Response) => {
    const { requestId } = req.body;
    const user = (req as any).user;
  
    try {
      const request = await prisma.teamRequest.findUnique({
        where: { id: requestId },
        include: { team: true }
      });
  
      if (!request || request.team.captainId !== user.userId) {
        res.status(403).json({ error: 'Not authorized to accept this request' });
        return;
      }
  
      await prisma.teamRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });
  
      await prisma.teamMember.create({
        data: {
          teamId: request.teamId,
          userId: request.userId,
          isCaptain: false
        }
      });
  
      res.json({ message: 'Request accepted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to accept request' });
    }
  });

  router.post('/request/reject', authMiddleware, requireRole('CAPTAIN'), async (req: Request, res: Response) => {
    const { requestId } = req.body;
    const user = (req as any).user;
  
    try {
      const request = await prisma.teamRequest.findUnique({
        where: { id: requestId },
        include: { team: true }
      });
  
      if (!request || request.team.captainId !== user.userId) {
        res.status(403).json({ error: 'Not authorized to reject this request' });
        return;
      }
  
      await prisma.teamRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
  
      res.json({ message: 'Request rejected' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to reject request' });
    }
  });
  
  
export default router;


