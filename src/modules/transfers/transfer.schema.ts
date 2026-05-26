import { z } from 'zod';

export const createTransferSchema = z.object({
  fromAccountId: z.string().min(1, 'From account id is required'),
  toAccountId: z.string().min(1, 'To account id is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().min(3, 'Description must have at least 3 characters'),
});