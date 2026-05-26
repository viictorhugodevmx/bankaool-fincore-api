import { z } from 'zod';
import { CUSTOMER_STATUS } from '../../constants/status';

export const updateCustomerStatusSchema = z.object({
  kycStatus: z.enum([
    CUSTOMER_STATUS.PENDING_KYC,
    CUSTOMER_STATUS.ACTIVE,
    CUSTOMER_STATUS.BLOCKED,
    CUSTOMER_STATUS.REJECTED,
  ]),
});