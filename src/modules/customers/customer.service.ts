import { Types } from 'mongoose';
import { CUSTOMER_STATUS, CustomerStatus } from '../../constants/status';
import { AppError } from '../../utils/app-error';
import { Customer, CustomerDocument } from './customer.model';
import { CustomerResponse } from './customer.types';

const sanitizeCustomer = (customer: CustomerDocument): CustomerResponse => ({
  id: customer._id.toString(),
  userId: customer.userId.toString(),
  fullName: customer.fullName,
  email: customer.email,
  phone: customer.phone,
  taxId: customer.taxId,
  occupation: customer.occupation,
  monthlyIncome: customer.monthlyIncome,
  kycStatus: customer.kycStatus,
  riskLevel: customer.riskLevel,
  createdAt: customer.createdAt,
  updatedAt: customer.updatedAt,
});

export const getCustomers = async (): Promise<CustomerResponse[]> => {
  const customers = await Customer.find().sort({ createdAt: -1 });

  return customers.map(sanitizeCustomer);
};

export const getCustomerById = async (
  customerId: string
): Promise<CustomerResponse> => {
  if (!Types.ObjectId.isValid(customerId)) {
    throw new AppError('Invalid customer id', 400);
  }

  const customer = await Customer.findById(customerId);

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  return sanitizeCustomer(customer);
};

export const updateCustomerStatus = async (
  customerId: string,
  kycStatus: CustomerStatus
): Promise<CustomerResponse> => {
  if (!Types.ObjectId.isValid(customerId)) {
    throw new AppError('Invalid customer id', 400);
  }

  const customer = await Customer.findByIdAndUpdate(
    customerId,
    {
      kycStatus,
      riskLevel: kycStatus === CUSTOMER_STATUS.BLOCKED ? 'high' : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  return sanitizeCustomer(customer);
};