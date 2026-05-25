export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  INACTIVE: 'inactive',
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const CUSTOMER_STATUS = {
  PENDING_KYC: 'pending_kyc',
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  REJECTED: 'rejected',
} as const;

export type CustomerStatus =
  (typeof CUSTOMER_STATUS)[keyof typeof CUSTOMER_STATUS];

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked',
  CLOSED: 'closed',
} as const;

export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const TRANSFER_STATUS = {
  COMPLETED: 'completed',
  PENDING_REVIEW: 'pending_review',
  REJECTED: 'rejected',
  FAILED: 'failed',
} as const;

export type TransferStatus =
  (typeof TRANSFER_STATUS)[keyof typeof TRANSFER_STATUS];

export const MOVEMENT_TYPE = {
  DEPOSIT: 'deposit',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
  REVERSAL: 'reversal',
  FEE: 'fee',
} as const;

export type MovementType = (typeof MOVEMENT_TYPE)[keyof typeof MOVEMENT_TYPE];