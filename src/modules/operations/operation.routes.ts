import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  approveTransfer,
  listPendingReviewTransfers,
  rejectTransfer,
} from './operation.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.get('/transfers/pending-review', listPendingReviewTransfers);
router.patch('/transfers/:id/approve', approveTransfer);
router.patch('/transfers/:id/reject', rejectTransfer);

export default router;