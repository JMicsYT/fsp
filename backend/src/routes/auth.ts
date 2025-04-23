import { Router, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import prisma from '../prisma/client';
import * as jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = 'ATHLETE' } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
  
      res.status(201).json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user || !user.password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'supersecret',
        { expiresIn: '7d' }
      );
  
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const user = (req as any).user;
  
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { id: true, name: true, email: true, role: true }
      });
  
      res.json(dbUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });
  

export default router;
