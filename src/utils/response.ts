import { Response } from 'express';

type ApiResponseOptions<T> = {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: unknown;
};

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'Request completed successfully',
  data,
  meta,
}: ApiResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
    meta: meta ?? null,
  });
};