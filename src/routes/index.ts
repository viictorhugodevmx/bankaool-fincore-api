import { Router } from 'express';

import accountRoutes from '../modules/accounts/account.routes';
import auditRoutes from '../modules/audit/audit.routes';
import authRoutes from '../modules/auth/auth.routes';
import customerRoutes from '../modules/customers/customer.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import movementRoutes from '../modules/movements/movement.routes';
import operationRoutes from '../modules/operations/operation.routes';
import transferRoutes from '../modules/transfers/transfer.routes';

const router = Router();

router.get('/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Bankaool FinCore 360 API is running',
    data: {
      service: 'bankaool-fincore-api',
      status: 'ok',
    },
  });
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/accounts', accountRoutes);
router.use('/', movementRoutes);
router.use('/transfers', transferRoutes);
router.use('/operations', operationRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/audit-logs', auditRoutes);

export default router;