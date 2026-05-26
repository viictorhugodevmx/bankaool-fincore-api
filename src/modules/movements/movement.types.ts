import { MovementType } from '../../constants/status';

export type MovementResponse = {
  id: string;
  accountId: string;
  type: MovementType;
  amount: number;
  balanceAfter: number;
  description: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};