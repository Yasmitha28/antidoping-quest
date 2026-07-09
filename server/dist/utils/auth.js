import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hashed) => bcrypt.compare(password, hashed);
export const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
};
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
};
