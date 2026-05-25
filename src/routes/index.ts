import { Router } from 'express';

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

export default router;