import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { sendSuccess } from '../../utils/response';
import { getDashboardSummary } from './dashboard.service';

export const getSummary = asyncHandler(async (_req, res: Response) => {
  const data = await getDashboardSummary();

  return sendSuccess({
    res,
    message: 'Dashboard summary retrieved successfully',
    data,
  });
});