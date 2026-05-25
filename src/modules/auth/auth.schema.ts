import { z } from 'zod';
import { USER_ROLES } from '../../constants/roles';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Email must be valid'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
  role: z
    .enum([USER_ROLES.ADMIN, USER_ROLES.OPERATOR, USER_ROLES.CUSTOMER])
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
});