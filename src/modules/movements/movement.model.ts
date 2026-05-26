import { Schema, model, Document, Types } from 'mongoose';
import { MOVEMENT_TYPE, MovementType } from '../../constants/status';

export type MovementDocument = Document & {
  accountId: Types.ObjectId;
  type: MovementType;
  amount: number;
  balanceAfter: number;
  description: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};

const movementSchema = new Schema<MovementDocument>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'Account id is required'],
    },
    type: {
      type: String,
      enum: Object.values(MOVEMENT_TYPE),
      required: [true, 'Movement type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    balanceAfter: {
      type: Number,
      required: [true, 'Balance after is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, 'Reference is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Movement = model<MovementDocument>('Movement', movementSchema);