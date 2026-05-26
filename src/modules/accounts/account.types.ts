import { AccountStatus } from '../../constants/status';

export type AccountResponse = {
  id: string;
  customerId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
};