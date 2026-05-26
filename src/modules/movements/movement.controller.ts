import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AppError } from '../../utils/app-error';
import { sendSuccess } from '../../utils/response';
import { getMovementsByAccountId } from './movement.service';

const getParamAsString = (param: string | string[] | undefined): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError('Invalid route parameter', 400);
  }

  return param;
};

export const getAccountMovements = asyncHandler(async (req, res: Response) => {
  const accountId = getParamAsString(req.params.accountId);

  const data = await getMovementsByAccountId(accountId);

  return sendSuccess({
    res,
    message: 'Account movements retrieved successfully',
    data,
    meta: {
      total: data.length,
    },
  });
});