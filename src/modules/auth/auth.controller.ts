import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';
import { sendSuccess } from '../../utils/response';
import { getCurrentUser, loginUser, registerUser } from './auth.service';

export const register = asyncHandler(async (req, res: Response) => {
  const data = await registerUser(req.body);

  return sendSuccess({
    res,
    statusCode: 201,
    message: 'User registered successfully',
    data,
  });
});

export const login = asyncHandler(async (req, res: Response) => {
  const data = await loginUser(req.body);

  return sendSuccess({
    res,
    message: 'Login successful',
    data,
  });
});

export const me = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;

    const data = await getCurrentUser(userId as string);

    return sendSuccess({
      res,
      message: 'Current user retrieved successfully',
      data,
    });
  }
);