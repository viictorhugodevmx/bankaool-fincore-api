import { TransferStatus } from '../../constants/status';

export type TransferResponse = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  status: TransferStatus;
  description: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};