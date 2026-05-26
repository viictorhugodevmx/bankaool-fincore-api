import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AppError } from '../../utils/app-error';
import { sendSuccess } from '../../utils/response';
import {
  createAccount,
  getAccountById,
  getAccounts,
  getAccountsByCustomerId,
} from './account.service';

const getParamAsString = (param: string | string[] | undefined): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError('Invalid route parameter', 400);
  }

  return param;
};

export const postAccount = asyncHandler(async (req, res: Response) => {
  const data = await createAccount(req.body);

  return sendSuccess({
    res,
    statusCode: 201,
    message: 'Account created successfully',
    data,
  });
});

export const listAccounts = asyncHandler(async (_req, res: Response) => {
  const data = await getAccounts();

  return sendSuccess({
    res,
    message: 'Accounts retrieved successfully',
    data,
    meta: {
      total: data.length,
    },
  });
});

export const getAccountDetail = asyncHandler(async (req, res: Response) => {
  const accountId = getParamAsString(req.params.id);
  const data = await getAccountById(accountId);

  return sendSuccess({
    res,
    message: 'Account retrieved successfully',
    data,
  });
});

export const getCustomerAccounts = asyncHandler(async (req, res: Response) => {
  const customerId = getParamAsString(req.params.customerId);
  const data = await getAccountsByCustomerId(customerId);

  return sendSuccess({
    res,
    message: 'Customer accounts retrieved successfully',
    data,
    meta: {
      total: data.length,
    },
  });
});