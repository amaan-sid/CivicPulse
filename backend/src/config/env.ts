import path from 'path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load backend/.env first, then fall back to the repository root .env.
// Values already present in process.env always take precedence.
dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/civicpulse'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

// Accept legacy variable names (BACKEND_PORT, MONGO_URI) for backwards compatibility.
const parsed = schema.safeParse({
  ...process.env,
  PORT: process.env.PORT ?? process.env.BACKEND_PORT,
  MONGODB_URI: process.env.MONGODB_URI ?? process.env.MONGO_URI,
});

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGODB_URI,
  corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
  logLevel: parsed.data.LOG_LEVEL,
} as const;
