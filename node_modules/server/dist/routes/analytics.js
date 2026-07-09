import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';
export default function analyticsRoutes(prisma) {
    const router = Router();
    router.get('/dashboard', authMiddleware, async (req, res) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const [users, modules, quizzes, challengeProgress] = await Promise.all([
            withFallback(() => prisma.user.count(), () => fallbackStore.countUsers()),
            withFallback(() => prisma.module.count(), async () => fallbackStore.listModules().then((items) => items.length)),
            withFallback(() => prisma.quiz.count(), async () => fallbackStore.listQuizzes().then((items) => items.length)),
            withFallback(() => prisma.challengeProgress.count({ where: { completed: true } }), () => fallbackStore.countCompletedChallenges())
        ]);
        const topUsers = await withFallback(() => prisma.user.findMany({ take: 5, orderBy: { xp: 'desc' }, select: { id: true, name: true, xp: true, level: true } }), () => fallbackStore.listTopUsers());
        res.json({ stats: { users, modules, quizzes, completedChallenges: challengeProgress }, topUsers });
    });
    router.get('/admin', authMiddleware, adminMiddleware, async (_req, res) => {
        const [users, modules, quizzes, challenges] = await Promise.all([
            withFallback(() => prisma.user.findMany({ orderBy: { createdAt: 'desc' } }), () => fallbackStore.listUsers()),
            withFallback(() => prisma.module.findMany({ orderBy: { createdAt: 'desc' } }), () => fallbackStore.listModules()),
            withFallback(() => prisma.quiz.findMany({ orderBy: { createdAt: 'desc' } }), () => fallbackStore.listQuizzes()),
            withFallback(() => prisma.challenge.findMany({ orderBy: { createdAt: 'desc' } }), () => fallbackStore.listChallenges())
        ]);
        res.json({ users, modules, quizzes, challenges });
    });
    return router;
}
