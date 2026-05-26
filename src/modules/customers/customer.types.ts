import { CustomerStatus } from '../../constants/status';

export type CustomerResponse = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  taxId: string;
  occupation: string;
  monthlyIncome: number;
  kycStatus: CustomerStatus;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
};