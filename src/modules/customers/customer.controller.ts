import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { AppError } from '../../utils/app-error';
import { sendSuccess } from '../../utils/response';
import {
  getCustomerById,
  getCustomers,
  updateCustomerStatus,
} from './customer.service';

const getParamAsString = (param: string | string[] | undefined): string => {
  if (!param || Array.isArray(param)) {
    throw new AppError('Invalid route parameter', 400);
  }

  return param;
};

export const listCustomers = asyncHandler(async (_req, res: Response) => {
  const data = await getCustomers();

  return sendSuccess({
    res,
    message: 'Customers retrieved successfully',
    data,
    meta: {
      total: data.length,
    },
  });
});

export const getCustomerDetail = asyncHandler(async (req, res: Response) => {
  const customerId = getParamAsString(req.params.id);

  const data = await getCustomerById(customerId);

  return sendSuccess({
    res,
    message: 'Customer retrieved successfully',
    data,
  });
});

export const patchCustomerStatus = asyncHandler(async (req, res: Response) => {
  const customerId = getParamAsString(req.params.id);

  const data = await updateCustomerStatus(customerId, req.body.kycStatus);

  return sendSuccess({
    res,
    message: 'Customer status updated successfully',
    data,
  });
});