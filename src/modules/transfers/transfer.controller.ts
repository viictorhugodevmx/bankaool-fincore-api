import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { createAuditLog } from '../audit/audit.service';
import { asyncHandler } from '../../utils/async-handler';
import { sendSuccess } from '../../utils/response';
import { createTransfer } from './transfer.service';

export const postTransfer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const data = await createTransfer(req.body);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'transfer_created',
      entityType: 'transfer',
      entityId: data.id,
      metadata: {
        amount: data.amount,
        status: data.status,
        reference: data.reference,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
      },
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: 'Transfer created successfully',
      data,
    });
  }
);