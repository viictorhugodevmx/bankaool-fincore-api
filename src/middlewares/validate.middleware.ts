import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { AppError } from '../utils/app-error';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate =
(schema: ZodSchema, target: ValidationTarget = 'body') =>
(req: Request, _res: Response, next: NextFunction) => {
  try {
    req[target] = schema.parse(req[target]) as typeof req[typeof target];
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return next(
        new AppError('Validation error', 400, {
          errors: formattedErrors,
        })
      );
    }

    return next(error);
  }
};