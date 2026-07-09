import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    (req as Request & { user?: { id: number; role: string } }).user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as Request & { user?: { id: number; role: string } }).user;
  if (user?.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
};
