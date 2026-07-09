import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hashed: string) => bcrypt.compare(password, hashed);

export const signToken = (payload: { id: number; role: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { id: number; role: string };
};
