import { Router } from 'express';
import { databaseStatus, isDatabaseReady } from './config/db';
import { issuesRoutes } from './modules/issues/issues.routes';

export const routes = Router();

routes.get('/health', (_req, res) => {
  const ready = isDatabaseReady();
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ok' : 'degraded',
    uptime: Math.round(process.uptime()),
    database: databaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

routes.use('/issues', issuesRoutes);
