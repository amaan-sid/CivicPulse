import type { RequestHandler } from 'express';
import { HttpError } from './error.middleware';

type Options = { windowMs: number; max: number };

/**
 * Minimal fixed-window, in-memory rate limiter keyed by client IP.
 * Suitable for a single instance; move to Redis when running multiple replicas.
 */
export const rateLimit = ({ windowMs, max }: Options): RequestHandler => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, windowMs).unref();

  return (req, res, next) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil((entry.resetAt - now) / 1000)));

    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return next(new HttpError(429, 'Too many requests, please try again later'));
    }
    next();
  };
};
