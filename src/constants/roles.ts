export const USER_ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  CUSTOMER: 'customer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_ROLE_VALUES = Object.values(USER_ROLES);