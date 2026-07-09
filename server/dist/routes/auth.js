import { Router } from 'express';
import { z } from 'zod';
import { comparePassword, hashPassword, signToken } from '../utils/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
export default function authRoutes(prisma) {
    const router = Router();
    router.post('/register', async (req, res) => {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const user = await withFallback(async () => {
            const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
            if (existing) {
                return { error: true, status: 409, message: 'Email already exists', user: null };
            }
            const password = await hashPassword(parsed.data.password);
            const created = await prisma.user.create({
                data: {
                    name: parsed.data.name,
                    email: parsed.data.email,
                    password
                }
            });
            return { error: false, status: 201, message: '', user: created };
        }, async () => {
            const existing = await fallbackStore.findUserByEmail(parsed.data.email);
            if (existing) {
                return { error: true, status: 409, message: 'Email already exists', user: null };
            }
            const password = await hashPassword(parsed.data.password);
            const created = await fallbackStore.createUser({ name: parsed.data.name, email: parsed.data.email, password });
            return { error: false, status: 201, message: '', user: created };
        });
        if (user.error) {
            return res.status(user.status).json({ error: user.message });
        }
        const token = signToken({ id: user.user.id, role: user.user.role });
        return res.status(201).json({ token, user: { id: user.user.id, name: user.user.name, email: user.user.email, role: user.user.role, xp: user.user.xp, level: user.user.level, streak: user.user.streak, badges: user.user.badges } });
    });
    router.post('/login', async (req, res) => {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const user = await withFallback(async () => {
            const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
            if (!existing) {
                return null;
            }
            const valid = await comparePassword(parsed.data.password, existing.password);
            if (!valid) {
                return null;
            }
            return existing;
        }, async () => {
            const existing = await fallbackStore.findUserByEmail(parsed.data.email);
            if (!existing) {
                return null;
            }
            const valid = await comparePassword(parsed.data.password, existing.password);
            if (!valid) {
                return null;
            }
            return existing;
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = signToken({ id: user.id, role: user.role });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, xp: user.xp, level: user.level, streak: user.streak, badges: user.badges } });
    });
    router.get('/me', authMiddleware, async (req, res) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const profile = await withFallback(async () => prisma.user.findUnique({ where: { id: user.id } }), async () => fallbackStore.findUserById(user.id));
        if (!profile) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ user: { id: profile.id, name: profile.name, email: profile.email, role: profile.role, xp: profile.xp, level: profile.level, streak: profile.streak, badges: profile.badges } });
    });
    return router;
}
