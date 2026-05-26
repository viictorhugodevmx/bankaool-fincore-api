import { z } from 'zod';

export const createAccountSchema = z.object({
  customerId: z.string().min(1, 'Customer id is required'),
  initialBalance: z.number().min(0, 'Initial balance cannot be negative').optional(),
  currency: z.string().min(3).max(3).optional(),
  dailyLimit: z.number().min(0).optional(),
  monthlyLimit: z.number().min(0).optional(),
});
