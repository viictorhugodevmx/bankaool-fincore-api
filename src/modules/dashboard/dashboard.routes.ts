import { Router } from 'express';
import { USER_ROLES } from '../../constants/roles';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { getSummary } from './dashboard.controller';

const router = Router();

router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.OPERATOR));

router.get('/summary', getSummary);

export default router;