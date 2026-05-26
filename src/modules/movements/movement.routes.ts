import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { getAccountMovements } from './movement.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.get('/accounts/:accountId/movements', getAccountMovements);

export default router;