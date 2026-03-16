import { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  message?: string;
};

const requestLog = new Map<string, number[]>();

const getClientKey = (req: Request) =>
  `${req.ip || req.socket.remoteAddress || "unknown"}:${req.originalUrl}`;

export const rateLimitMiddleware = ({
  limit,
  windowMs,
  message = "Too many requests. Please try again later."
}: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = getClientKey(req);
    const recentRequests = (requestLog.get(key) || []).filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recentRequests.length >= limit) {
      const retryAfterSeconds = Math.ceil(windowMs / 1000);
      res.setHeader("Retry-After", retryAfterSeconds.toString());

      return res.status(429).json({ message });
    }

    recentRequests.push(now);
    requestLog.set(key, recentRequests);

    return next();
  };
};
