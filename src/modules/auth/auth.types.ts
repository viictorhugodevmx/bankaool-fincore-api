import { UserRole } from '../../constants/roles';
import { UserStatus } from '../../constants/status';

export type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export type AuthResponse = {
  user: AuthUserResponse;
  token: string;
};