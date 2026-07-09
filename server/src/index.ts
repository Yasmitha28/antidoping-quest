import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import moduleRoutes from './routes/modules.js';
import quizRoutes from './routes/quizzes.js';
import challengeRoutes from './routes/challenges.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes(prisma));
app.use('/api/modules', moduleRoutes(prisma));
app.use('/api/quizzes', quizRoutes(prisma));
app.use('/api/challenges', challengeRoutes(prisma));
app.use('/api/analytics', analyticsRoutes(prisma));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
