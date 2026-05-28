import { Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { sendSuccess } from '../../utils/response';
import { getAuditLogs } from './audit.service';

export const listAuditLogs = asyncHandler(async (_req, res: Response) => {
  const data = await getAuditLogs();

  return sendSuccess({
    res,
    message: 'Audit logs retrieved successfully',
    data,
    meta: {
      total: data.length,
    },
  });
});