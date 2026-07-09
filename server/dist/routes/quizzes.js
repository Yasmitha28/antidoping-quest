import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';
export default function quizRoutes(prisma) {
    const router = Router();
    router.get('/', async (_req, res) => {
        const quizzes = await withFallback(() => prisma.quiz.findMany({ orderBy: { createdAt: 'asc' } }), () => fallbackStore.listQuizzes());
        res.json({ quizzes });
    });
    router.post('/:id/submit', authMiddleware, async (req, res) => {
        const user = req.user;
        if (!user)
            return res.status(401).json({ error: 'Unauthorized' });
        const quizId = Number(req.params.id);
        const { answer } = req.body;
        const quiz = await withFallback(() => prisma.quiz.findUnique({ where: { id: quizId } }), () => fallbackStore.listQuizzes().then((items) => items.find((item) => item.id === quizId) || null));
        if (!quiz)
            return res.status(404).json({ error: 'Quiz not found' });
        const correct = answer === quiz.correctAnswer;
        const score = correct ? quiz.xpReward : 0;
        await withFallback(() => prisma.quizAttempt.create({ data: { userId: user.id, quizId, correct, score } }), () => fallbackStore.createQuizAttempt({ userId: user.id, quizId, correct, score }));
        const userRecord = await withFallback(() => prisma.user.findUnique({ where: { id: user.id } }), () => fallbackStore.findUserById(user.id));
        if (userRecord) {
            await withFallback(() => prisma.user.update({
                where: { id: user.id },
                data: {
                    xp: userRecord.xp + score,
                    level: Math.floor((userRecord.xp + score) / 200) + 1,
                    streak: correct ? userRecord.streak + 1 : userRecord.streak
                }
            }), () => fallbackStore.updateUser(user.id, {
                xp: userRecord.xp + score,
                level: Math.floor((userRecord.xp + score) / 200) + 1,
                streak: correct ? userRecord.streak + 1 : userRecord.streak
            }));
        }
        res.json({ correct, score, answer: quiz.correctAnswer });
    });
    return router;
}
