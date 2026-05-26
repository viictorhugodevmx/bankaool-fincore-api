import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { sendSuccess } from '../../utils/response';
import { createTransfer } from './transfer.service';

export const postTransfer = asyncHandler(async (req, res: Response) => {
  const data = await createTransfer(req.body);

  return sendSuccess({
    res,
    statusCode: 201,
    message: 'Transfer created successfully',
    data,
  });
});