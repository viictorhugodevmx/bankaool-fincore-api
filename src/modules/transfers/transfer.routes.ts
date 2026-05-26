import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { postTransfer } from './transfer.controller';
import { createTransferSchema } from './transfer.schema';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.post('/', validate(createTransferSchema), postTransfer);

export default router;