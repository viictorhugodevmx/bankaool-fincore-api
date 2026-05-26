import { Types } from 'mongoose';
import { AppError } from '../../utils/app-error';
import { Account } from '../accounts/account.model';
import { Movement, MovementDocument } from './movement.model';
import { MovementResponse } from './movement.types';

const sanitizeMovement = (movement: MovementDocument): MovementResponse => ({
  id: movement._id.toString(),
  accountId: movement.accountId.toString(),
  type: movement.type,
  amount: movement.amount,
  balanceAfter: movement.balanceAfter,
  description: movement.description,
  reference: movement.reference,
  createdAt: movement.createdAt,
  updatedAt: movement.updatedAt,
});

export const getMovementsByAccountId = async (
  accountId: string
): Promise<MovementResponse[]> => {
  if (!Types.ObjectId.isValid(accountId)) {
    throw new AppError('Invalid account id', 400);
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError('Account not found', 404);
  }

  const movements = await Movement.find({ accountId }).sort({ createdAt: -1 });

  return movements.map(sanitizeMovement);
};