import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { app } from './app';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    await connectDatabase();
  } catch (err) {
    logger.error(`Could not connect to MongoDB at ${env.mongoUri}`, (err as Error).message);
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    logger.error(err.code === 'EADDRINUSE' ? `Port ${env.port} is already in use` : err.message);
    process.exit(1);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => logger.error('Unhandled promise rejection', reason));
}

void bootstrap();
