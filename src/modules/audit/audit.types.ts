export type AuditAction =
  | 'transfer_created'
  | 'transfer_approved'
  | 'transfer_rejected'
  | 'customer_blocked'
  | 'account_blocked'
  | 'account_unblocked';

export type AuditLogResponse = {
  id: string;
  actorUserId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};