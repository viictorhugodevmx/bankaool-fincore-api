import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../constants/roles';
import { AppError } from '../utils/app-error';
import { verifyToken } from '../utils/jwt';

export type AuthenticatedUser = {
  userId: string;
  role: UserRole;
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token is required', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication is required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission for this action', 403));
    }

    return next();
  };