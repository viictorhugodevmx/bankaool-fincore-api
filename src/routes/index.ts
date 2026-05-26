import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware';
import { AppError } from '../utils/app-error';
import authRoutes from '../modules/auth/auth.routes';
import customerRoutes from '../modules/customers/customer.routes';
import accountRoutes from '../modules/accounts/account.routes';
import movementRoutes from '../modules/movements/movement.routes';

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

const testValidationSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  amount: z.number().positive('Amount must be greater than 0'),
});

router.post(
  '/dev/validate-test',
  validate(testValidationSchema),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Validation passed',
      data: req.body,
    });
  }
);

router.get('/dev/error-test', (_req, _res, next) => {
  next(
    new AppError('Controlled error test', 418, {
      reason: 'This endpoint validates centralized error handling',
    })
  );
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/accounts', accountRoutes);
router.use('/', movementRoutes);

export default router;