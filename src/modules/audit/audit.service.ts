import { Types } from 'mongoose';
import { AuditLog, AuditLogDocument } from './audit-log.model';
import { AuditAction, AuditLogResponse } from './audit.types';

type CreateAuditLogInput = {
  actorUserId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: unknown;
};

const sanitizeAuditLog = (auditLog: AuditLogDocument): AuditLogResponse => ({
  id: auditLog._id.toString(),
  actorUserId: auditLog.actorUserId ? auditLog.actorUserId.toString() : null,
  action: auditLog.action,
  entityType: auditLog.entityType,
  entityId: auditLog.entityId,
  metadata: auditLog.metadata,
  createdAt: auditLog.createdAt,
  updatedAt: auditLog.updatedAt,
});

export const createAuditLog = async (
  payload: CreateAuditLogInput
): Promise<void> => {
  const actorObjectId =
    payload.actorUserId && Types.ObjectId.isValid(payload.actorUserId)
      ? new Types.ObjectId(payload.actorUserId)
      : undefined;

  await AuditLog.create({
    actorUserId: actorObjectId,
    action: payload.action,
    entityType: payload.entityType,
    entityId: payload.entityId,
    metadata: payload.metadata ?? {},
  });
};

export const getAuditLogs = async (): Promise<AuditLogResponse[]> => {
  const auditLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);

  return auditLogs.map(sanitizeAuditLog);
};