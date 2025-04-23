import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing' });
      return; // <=== важно
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as {
        userId: string;
        role: string;
      };
  
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return; // <=== тоже важно
    }
  };

  export const requireRole = (role: string): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  
      if (req.user.role !== role) {
        res.status(403).json({ error: `Requires ${role} role` });
        return;
      }
  
      next();
    };
  };
  
