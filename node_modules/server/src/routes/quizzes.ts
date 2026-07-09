import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { fallbackStore, withFallback } from '../utils/db.js';

export default function quizRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get('/', async (_req, res) => {
    const quizzes = await withFallback(
      () => prisma.quiz.findMany({ orderBy: { createdAt: 'asc' } }),
      () => fallbackStore.listQuizzes()
    );
    res.json({ quizzes });
  });

  router.post('/:id/submit', authMiddleware, async (req, res) => {
    const user = (req as typeof req & { user?: { id: number; role: string } }).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const quizId = Number(req.params.id);
    const { answer } = req.body as { answer: number };
    const quiz = await withFallback(
      () => prisma.quiz.findUnique({ where: { id: quizId } }),
      () => fallbackStore.listQuizzes().then((items) => items.find((item) => item.id === quizId) || null)
    );
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const correct = answer === quiz.correctAnswer;
    const score = correct ? quiz.xpReward : 0;
    await withFallback(
      () => prisma.quizAttempt.create({ data: { userId: user.id, quizId, correct, score } }),
      () => fallbackStore.createQuizAttempt({ userId: user.id, quizId, correct, score })
    );

    const attempts = await withFallback(
      () => prisma.quizAttempt.findMany({ where: { userId: user.id }, select: { score: true } }),
      () => fallbackStore.listQuizAttempts(user.id)
    );
    const scoredAttempts = attempts.filter((attempt: any) => typeof attempt.score === 'number');
    const totalScore = scoredAttempts.reduce((sum: number, attempt: any) => sum + (attempt.score || 0), 0);
    const totalPossible = Math.max(scoredAttempts.length, 1) * quiz.xpReward;
    const percentage = Math.round((totalScore / totalPossible) * 100);

    let certificate: any = null;
    if (correct) {
      const existingCertificates = await withFallback(
        () => prisma.certificate.findMany({ where: { userId: user.id } }),
        () => fallbackStore.listCertificates(user.id)
      );
      if (existingCertificates.length === 0) {
        certificate = await withFallback(
          () => prisma.certificate.create({
            data: {
              userId: user.id,
              title: 'Anti-Doping Awareness Certificate',
              description: 'Awarded for strong quiz performance in anti-doping education.',
              percentage: Math.max(percentage, 80),
              score: totalScore
            }
          }),
          () => fallbackStore.createCertificate({
            userId: user.id,
            title: 'Anti-Doping Awareness Certificate',
            description: 'Awarded for strong quiz performance in anti-doping education.',
            percentage: Math.max(percentage, 80),
            score: totalScore
          })
        );
      }
    }

    let updatedUser: any = null;
    const userRecord = await withFallback(
      () => prisma.user.findUnique({ where: { id: user.id } }),
      () => fallbackStore.findUserById(user.id)
    );
    if (userRecord) {
      updatedUser = await withFallback(
        () => prisma.user.update({
          where: { id: user.id },
          data: {
            xp: userRecord.xp + score,
            level: Math.floor((userRecord.xp + score) / 200) + 1,
            streak: correct ? userRecord.streak + 1 : userRecord.streak
          }
        }),
        () => fallbackStore.updateUser(user.id, {
          xp: userRecord.xp + score,
          level: Math.floor((userRecord.xp + score) / 200) + 1,
          streak: correct ? userRecord.streak + 1 : userRecord.streak
        })
      );
    }

    res.json({ correct, score, answer: quiz.correctAnswer, certificate, percentage, user: updatedUser });
  });

  return router;
}
