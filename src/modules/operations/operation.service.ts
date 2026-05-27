import { Types } from 'mongoose';
import {
  MOVEMENT_TYPE,
  TRANSFER_STATUS,
} from '../../constants/status';
import { Account } from '../accounts/account.model';
import { Movement } from '../movements/movement.model';
import { Transfer, TransferDocument } from '../transfers/transfer.model';
import { TransferResponse } from '../transfers/transfer.types';
import { AppError } from '../../utils/app-error';

const sanitizeTransfer = (transfer: TransferDocument): TransferResponse => ({
  id: transfer._id.toString(),
  fromAccountId: transfer.fromAccountId.toString(),
  toAccountId: transfer.toAccountId.toString(),
  amount: transfer.amount,
  status: transfer.status,
  description: transfer.description,
  reference: transfer.reference,
  riskScore: transfer.riskScore,
  riskReasons: transfer.riskReasons,
  createdAt: transfer.createdAt,
  updatedAt: transfer.updatedAt,
});

export const getPendingReviewTransfers = async (): Promise<TransferResponse[]> => {
  const transfers = await Transfer.find({
    status: TRANSFER_STATUS.PENDING_REVIEW,
  }).sort({ createdAt: -1 });

  return transfers.map(sanitizeTransfer);
};

export const approvePendingTransfer = async (
  transferId: string
): Promise<TransferResponse> => {
  if (!Types.ObjectId.isValid(transferId)) {
    throw new AppError('Invalid transfer id', 400);
  }

  const transfer = await Transfer.findById(transferId);

  if (!transfer) {
    throw new AppError('Transfer not found', 404);
  }

  if (transfer.status !== TRANSFER_STATUS.PENDING_REVIEW) {
    throw new AppError('Only pending review transfers can be approved', 400);
  }

  const fromAccount = await Account.findById(transfer.fromAccountId);
  const toAccount = await Account.findById(transfer.toAccountId);

  if (!fromAccount) {
    throw new AppError('From account not found', 404);
  }

  if (!toAccount) {
    throw new AppError('To account not found', 404);
  }

  if (fromAccount.balance < transfer.amount) {
    throw new AppError('Insufficient balance to approve transfer', 400);
  }

  fromAccount.balance -= transfer.amount;
  toAccount.balance += transfer.amount;

  await fromAccount.save();
  await toAccount.save();

  transfer.status = TRANSFER_STATUS.COMPLETED;
  await transfer.save();

  await Movement.insertMany([
    {
      accountId: fromAccount._id,
      type: MOVEMENT_TYPE.TRANSFER_OUT,
      amount: transfer.amount,
      balanceAfter: fromAccount.balance,
      description: transfer.description,
      reference: transfer.reference,
    },
    {
      accountId: toAccount._id,
      type: MOVEMENT_TYPE.TRANSFER_IN,
      amount: transfer.amount,
      balanceAfter: toAccount.balance,
      description: transfer.description,
      reference: transfer.reference,
    },
  ]);

  return sanitizeTransfer(transfer);
};

export const rejectPendingTransfer = async (
  transferId: string
): Promise<TransferResponse> => {
  if (!Types.ObjectId.isValid(transferId)) {
    throw new AppError('Invalid transfer id', 400);
  }

  const transfer = await Transfer.findById(transferId);

  if (!transfer) {
    throw new AppError('Transfer not found', 404);
  }

  if (transfer.status !== TRANSFER_STATUS.PENDING_REVIEW) {
    throw new AppError('Only pending review transfers can be rejected', 400);
  }

  transfer.status = TRANSFER_STATUS.REJECTED;
  await transfer.save();

  return sanitizeTransfer(transfer);
};