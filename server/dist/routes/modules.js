import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';
export default function moduleRoutes(prisma) {
    const router = Router();
    router.get('/', async (_req, res) => {
        const modules = await withFallback(() => prisma.module.findMany({ orderBy: { createdAt: 'asc' } }), () => fallbackStore.listModules());
        res.json({ modules });
    });
    router.post('/:id/progress', authMiddleware, async (req, res) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const moduleId = Number(req.params.id);
        const existing = await withFallback(() => prisma.progress.findUnique({ where: { userId_moduleId: { userId: user.id, moduleId } } }), () => fallbackStore.findProgress(user.id, moduleId));
        if (existing) {
            const updated = await withFallback(() => prisma.progress.update({ where: { id: existing.id }, data: { completed: true, score: 100 } }), () => fallbackStore.updateProgress(existing.id, { completed: true, score: 100 }));
            return res.json({ progress: updated });
        }
        const progress = await withFallback(() => prisma.progress.create({
            data: {
                userId: user.id,
                moduleId,
                completed: true,
                score: 100
            }
        }), () => fallbackStore.createProgress({ userId: user.id, moduleId, completed: true, score: 100 }));
        const userRecord = await withFallback(() => prisma.user.findUnique({ where: { id: user.id } }), () => fallbackStore.findUserById(user.id));
        if (userRecord) {
            await withFallback(() => prisma.user.update({
                where: { id: user.id },
                data: {
                    xp: userRecord.xp + 50,
                    level: Math.floor((userRecord.xp + 50) / 200) + 1,
                    streak: userRecord.streak + 1
                }
            }), () => fallbackStore.updateUser(user.id, {
                xp: userRecord.xp + 50,
                level: Math.floor((userRecord.xp + 50) / 200) + 1,
                streak: userRecord.streak + 1
            }));
        }
        res.json({ progress });
    });
    return router;
}
