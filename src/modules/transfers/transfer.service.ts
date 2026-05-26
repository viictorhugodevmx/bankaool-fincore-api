import { Types } from 'mongoose';
import {
  ACCOUNT_STATUS,
  MOVEMENT_TYPE,
  TRANSFER_STATUS,
} from '../../constants/status';
import { Account } from '../accounts/account.model';
import { Movement } from '../movements/movement.model';
import { AppError } from '../../utils/app-error';
import { Transfer, TransferDocument } from './transfer.model';
import { TransferResponse } from './transfer.types';

type CreateTransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
};

const sanitizeTransfer = (transfer: TransferDocument): TransferResponse => ({
  id: transfer._id.toString(),
  fromAccountId: transfer.fromAccountId.toString(),
  toAccountId: transfer.toAccountId.toString(),
  amount: transfer.amount,
  status: transfer.status,
  description: transfer.description,
  reference: transfer.reference,
  createdAt: transfer.createdAt,
  updatedAt: transfer.updatedAt,
});

const generateTransferReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `TRX-${timestamp}-${random}`;
};

export const createTransfer = async (
  payload: CreateTransferInput
): Promise<TransferResponse> => {
  if (!Types.ObjectId.isValid(payload.fromAccountId)) {
    throw new AppError('Invalid from account id', 400);
  }

  if (!Types.ObjectId.isValid(payload.toAccountId)) {
    throw new AppError('Invalid to account id', 400);
  }

  if (payload.fromAccountId === payload.toAccountId) {
    throw new AppError('Origin and destination accounts must be different', 400);
  }

  const fromAccount = await Account.findById(payload.fromAccountId);
  const toAccount = await Account.findById(payload.toAccountId);

  if (!fromAccount) {
    throw new AppError('From account not found', 404);
  }

  if (!toAccount) {
    throw new AppError('To account not found', 404);
  }

  if (fromAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError('From account is not active', 400);
  }

  if (toAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw new AppError('To account is not active', 400);
  }

  if (fromAccount.balance < payload.amount) {
    throw new AppError('Insufficient balance', 400);
  }

  fromAccount.balance -= payload.amount;
  toAccount.balance += payload.amount;

  await fromAccount.save();
  await toAccount.save();

  const reference = generateTransferReference();

  const transfer = await Transfer.create({
    fromAccountId: fromAccount._id,
    toAccountId: toAccount._id,
    amount: payload.amount,
    status: TRANSFER_STATUS.COMPLETED,
    description: payload.description,
    reference,
  });

  await Movement.insertMany([
    {
      accountId: fromAccount._id,
      type: MOVEMENT_TYPE.TRANSFER_OUT,
      amount: payload.amount,
      balanceAfter: fromAccount.balance,
      description: payload.description,
      reference,
    },
    {
      accountId: toAccount._id,
      type: MOVEMENT_TYPE.TRANSFER_IN,
      amount: payload.amount,
      balanceAfter: toAccount.balance,
      description: payload.description,
      reference,
    },
  ]);

  return sanitizeTransfer(transfer);
};