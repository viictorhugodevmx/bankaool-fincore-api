import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { createAuditLog } from '../audit/audit.service';
import { asyncHandler } from '../../utils/async-handler';
import { AppError } from '../../utils/app-error';
import { sendSuccess } from '../../utils/response';
import {
  approvePendingTransfer,
  blockAccount,
  blockCustomer,
  getPendingReviewTransfers,
  rejectPendingTransfer,
  unblockAccount,
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

export const approveTransfer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const transferId = getParamAsString(req.params.id);
    const data = await approvePendingTransfer(transferId);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'transfer_approved',
      entityType: 'transfer',
      entityId: data.id,
      metadata: {
        amount: data.amount,
        reference: data.reference,
        status: data.status,
      },
    });

    return sendSuccess({
      res,
      message: 'Transfer approved successfully',
      data,
    });
  }
);

export const rejectTransfer = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const transferId = getParamAsString(req.params.id);
    const data = await rejectPendingTransfer(transferId);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'transfer_rejected',
      entityType: 'transfer',
      entityId: data.id,
      metadata: {
        amount: data.amount,
        reference: data.reference,
        status: data.status,
      },
    });

    return sendSuccess({
      res,
      message: 'Transfer rejected successfully',
      data,
    });
  }
);

export const blockCustomerOperation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const customerId = getParamAsString(req.params.id);
    const data = await blockCustomer(customerId);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'customer_blocked',
      entityType: 'customer',
      entityId: data.id,
      metadata: {
        email: data.email,
        kycStatus: data.kycStatus,
        riskLevel: data.riskLevel,
      },
    });

    return sendSuccess({
      res,
      message: 'Customer blocked successfully',
      data,
    });
  }
);

export const blockAccountOperation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const accountId = getParamAsString(req.params.id);
    const data = await blockAccount(accountId);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'account_blocked',
      entityType: 'account',
      entityId: data.id,
      metadata: {
        accountNumber: data.accountNumber,
        status: data.status,
      },
    });

    return sendSuccess({
      res,
      message: 'Account blocked successfully',
      data,
    });
  }
);

export const unblockAccountOperation = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const accountId = getParamAsString(req.params.id);
    const data = await unblockAccount(accountId);

    await createAuditLog({
      actorUserId: req.user?.userId,
      action: 'account_unblocked',
      entityType: 'account',
      entityId: data.id,
      metadata: {
        accountNumber: data.accountNumber,
        status: data.status,
      },
    });

    return sendSuccess({
      res,
      message: 'Account unblocked successfully',
      data,
    });
  }
);