import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import {
  getAccountDetail,
  getCustomerAccounts,
  listAccounts,
  postAccount,
} from './account.controller';
import { createAccountSchema } from './account.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.post('/', validate(createAccountSchema), postAccount);
router.get('/', listAccounts);
router.get('/customer/:customerId', getCustomerAccounts);
router.get('/:id', getAccountDetail);

export default router;