import { Schema, model, Document, Types } from 'mongoose';
import { AuditAction } from './audit.types';

export type AuditLogDocument = Document & {
  actorUserId?: Types.ObjectId;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
};

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    actorUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      enum: [
        'transfer_created',
        'transfer_approved',
        'transfer_rejected',
        'customer_blocked',
        'account_blocked',
        'account_unblocked',
      ],
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
    },
    entityId: {
      type: String,
      required: [true, 'Entity id is required'],
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = model<AuditLogDocument>('AuditLog', auditLogSchema);