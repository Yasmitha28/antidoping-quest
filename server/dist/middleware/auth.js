import { verifyToken } from '../utils/auth.js';
export const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const token = header.split(' ')[1];
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};
export const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    next();
};
