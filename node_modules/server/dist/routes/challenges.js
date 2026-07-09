import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';
export default function challengeRoutes(prisma) {
    const router = Router();
    router.get('/', async (_req, res) => {
        const challenges = await withFallback(() => prisma.challenge.findMany({ orderBy: { createdAt: 'asc' } }), () => fallbackStore.listChallenges());
        res.json({ challenges });
    });
    router.post('/:id/complete', authMiddleware, async (req, res) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const challengeId = Number(req.params.id);
        const challenge = await withFallback(() => prisma.challenge.findUnique({ where: { id: challengeId } }), () => fallbackStore.listChallenges().then((items) => items.find((item) => item.id === challengeId) || null));
        if (!challenge)
            return res.status(404).json({ error: 'Challenge not found' });
        const progress = await withFallback(() => prisma.challengeProgress.upsert({
            where: { userId_challengeId: { userId: user.id, challengeId } },
            update: { completed: true },
            create: { userId: user.id, challengeId, completed: true }
        }), () => fallbackStore.upsertChallengeProgress({ userId: user.id, challengeId }));
        const userRecord = await withFallback(() => prisma.user.findUnique({ where: { id: user.id } }), () => fallbackStore.findUserById(user.id));
        if (userRecord) {
            await withFallback(() => prisma.user.update({
                where: { id: user.id },
                data: {
                    xp: userRecord.xp + challenge.xpReward,
                    level: Math.floor((userRecord.xp + challenge.xpReward) / 200) + 1
                }
            }), () => fallbackStore.updateUser(user.id, {
                xp: userRecord.xp + challenge.xpReward,
                level: Math.floor((userRecord.xp + challenge.xpReward) / 200) + 1
            }));
        }
        res.json({ progress });
    });
    return router;
}
