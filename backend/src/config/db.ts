import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

const states: Record<number, string> = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error', err.message));

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
  logger.info(`MongoDB connected (${mongoose.connection.name})`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
}

export function databaseStatus(): string {
  return states[mongoose.connection.readyState] ?? 'unknown';
}

export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}
