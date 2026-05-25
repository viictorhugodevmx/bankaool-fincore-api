import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../constants/roles';

export type JwtPayload = {
  userId: string;
  role: UserRole;
};

export const signToken = (payload: JwtPayload): string => {
  const secret: Secret = env.jwtSecret;

  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};