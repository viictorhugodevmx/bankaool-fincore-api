import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  getCustomerDetail,
  listCustomers,
  patchCustomerStatus,
} from './customer.controller';
import { updateCustomerStatusSchema } from './customer.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.get('/', listCustomers);
router.get('/:id', getCustomerDetail);
router.patch('/:id/status', validate(updateCustomerStatusSchema), patchCustomerStatus);

export default router;