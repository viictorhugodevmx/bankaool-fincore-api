import { Types } from 'mongoose';
import { ACCOUNT_STATUS, CUSTOMER_STATUS } from '../../constants/status';
import { AppError } from '../../utils/app-error';
import { Customer } from '../customers/customer.model';
import { Account, AccountDocument } from './account.model';
import { AccountResponse } from './account.types';

type CreateAccountInput = {
  customerId: string;
  initialBalance?: number;
  currency?: string;
  dailyLimit?: number;
  monthlyLimit?: number;
};

const sanitizeAccount = (account: AccountDocument): AccountResponse => ({
  id: account._id.toString(),
  customerId: account.customerId.toString(),
  accountNumber: account.accountNumber,
  balance: account.balance,
  currency: account.currency,
  status: account.status,
  dailyLimit: account.dailyLimit,
  monthlyLimit: account.monthlyLimit,
  createdAt: account.createdAt,
  updatedAt: account.updatedAt,
});

const generateAccountNumber = (): string => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `BK${timestamp}${random}`;
};

export const createAccount = async (
  payload: CreateAccountInput
): Promise<AccountResponse> => {
  if (!Types.ObjectId.isValid(payload.customerId)) {
    throw new AppError('Invalid customer id', 400);
  }

  const customer = await Customer.findById(payload.customerId);

  if (!customer) {
    throw new AppError('Customer not found', 404);
  }

  if (customer.kycStatus !== CUSTOMER_STATUS.ACTIVE) {
    throw new AppError('Customer must have active KYC to create an account', 400);
  }

  const account = await Account.create({
    customerId: customer._id,
    accountNumber: generateAccountNumber(),
    balance: payload.initialBalance ?? 0,
    currency: payload.currency ?? 'MXN',
    status: ACCOUNT_STATUS.ACTIVE,
    dailyLimit: payload.dailyLimit ?? 25000,
    monthlyLimit: payload.monthlyLimit ?? 150000,
  });

  return sanitizeAccount(account);
};

export const getAccounts = async (): Promise<AccountResponse[]> => {
  const accounts = await Account.find().sort({ createdAt: -1 });

  return accounts.map(sanitizeAccount);
};

export const getAccountById = async (
  accountId: string
): Promise<AccountResponse> => {
  if (!Types.ObjectId.isValid(accountId)) {
    throw new AppError('Invalid account id', 400);
  }

  const account = await Account.findById(accountId);

  if (!account) {
    throw new AppError('Account not found', 404);
  }

  return sanitizeAccount(account);
};

export const getAccountsByCustomerId = async (
  customerId: string
): Promise<AccountResponse[]> => {
  if (!Types.ObjectId.isValid(customerId)) {
    throw new AppError('Invalid customer id', 400);
  }

  const accounts = await Account.find({ customerId }).sort({ createdAt: -1 });

  return accounts.map(sanitizeAccount);
};

