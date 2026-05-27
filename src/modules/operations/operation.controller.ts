import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AppError } from '../../utils/app-error';
import { sendSuccess } from '../../utils/response';
import {
  approvePendingTransfer,
  getPendingReviewTransfers,
  rejectPendingTransfer,
} from './operation.service';

const getParamAsString = (param: string | string[] | undefined): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError('Invalid route parameter', 400);
  }

  return param;
};

export const listPendingReviewTransfers = asyncHandler(
  async (_req, res: Response) => {
    const data = await getPendingReviewTransfers();

    return sendSuccess({
      res,
      message: 'Pending review transfers retrieved successfully',
      data,
      meta: {
        total: data.length,
      },
    });
  }
);

export const approveTransfer = asyncHandler(async (req, res: Response) => {
  const transferId = getParamAsString(req.params.id);

  const data = await approvePendingTransfer(transferId);

  return sendSuccess({
    res,
    message: 'Transfer approved successfully',
    data,
  });
});

export const rejectTransfer = asyncHandler(async (req, res: Response) => {
  const transferId = getParamAsString(req.params.id);

  const data = await rejectPendingTransfer(transferId);

  return sendSuccess({
    res,
    message: 'Transfer rejected successfully',
    data,
  });
});