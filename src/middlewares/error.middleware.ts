import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '../utils/app-error';
import { env } from '../config/env';

type MongoServerError = Error & {
  code?: number;
  keyValue?: Record<string, string>;
};

const isMongoDuplicateKeyError = (error: Error): error is MongoServerError => {
  return 'code' in error && (error as MongoServerError).code === 11000;
};

const getStatusCode = (error: Error): number => {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  if (isMongoDuplicateKeyError(error)) {
    return 409;
  }

  if (error instanceof MongooseError.CastError) {
    return 400;
  }

  if (error instanceof MongooseError.ValidationError) {
    return 400;
  }

  return 500;
};

const getErrorMessage = (error: Error): string => {
  if (isMongoDuplicateKeyError(error)) {
    return 'Duplicate value already exists';
  }

  if (error instanceof MongooseError.CastError) {
    return `Invalid ${error.path}: ${error.value}`;
  }

  if (error instanceof MongooseError.ValidationError) {
    return 'Database validation error';
  }

  return error.message || 'Internal server error';
};

const getErrorDetails = (error: Error): unknown => {
  if (error instanceof AppError) {
    return error.details ?? null;
  }

  if (isMongoDuplicateKeyError(error)) {
    return {
      duplicatedFields: error.keyValue ?? null,
    };
  }

  if (error instanceof MongooseError.ValidationError) {
    return Object.values(error.errors).map((item) => ({
      path: item.path,
      message: item.message,
    }));
  }

  return null;
};

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = getStatusCode(error);

  return res.status(statusCode).json({
    success: false,
    message: getErrorMessage(error),
    details: getErrorDetails(error),
    stack: env.nodeEnv === 'development' ? error.stack : undefined,
  });
};