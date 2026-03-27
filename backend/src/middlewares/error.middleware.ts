import { NextFunction, Request, Response } from "express";

type AppError = Error & {
  statusCode?: number;
};

export const notFoundMiddleware = (req: Request, res: Response) => {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorMiddleware = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  console.error("UNHANDLED ERROR:", error);

  return res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error." : error.message
  });
};
