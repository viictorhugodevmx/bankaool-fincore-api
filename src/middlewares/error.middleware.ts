import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { env } from '../config/env';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    stack: env.nodeEnv === 'development' ? error.stack : undefined,
  });
};