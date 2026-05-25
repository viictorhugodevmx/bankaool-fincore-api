import { USER_ROLES, UserRole } from '../../constants/roles';
import { USER_STATUS } from '../../constants/status';
import { User, UserDocument } from '../users/user.model';
import { AppError } from '../../utils/app-error';
import { comparePassword, hashPassword } from '../../utils/password';
import { signToken } from '../../utils/jwt';
import { AuthResponse, AuthUserResponse } from './auth.types';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

const sanitizeUser = (user: UserDocument): AuthUserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

export const registerUser = async (
  payload: RegisterInput
): Promise<AuthResponse> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await User.create({
    name: payload.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: payload.role ?? USER_ROLES.CUSTOMER,
    status: USER_STATUS.ACTIVE,
  });

  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const loginUser = async (
  payload: LoginInput
): Promise<AuthResponse> => {
  const normalizedEmail = payload.email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select(
    '+password'
  );

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== USER_STATUS.ACTIVE) {
    throw new AppError('User is not active', 403);
  }

  const isPasswordValid = await comparePassword(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(user),
    token,
  };
};

export const getCurrentUser = async (
  userId: string
): Promise<AuthUserResponse> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sanitizeUser(user);
};