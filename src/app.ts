import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { issueRoutes } from './modules/issues/issue.routes';
import { metricsRoutes } from './modules/metrics/metrics.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'DevPulse API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/metrics', metricsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
