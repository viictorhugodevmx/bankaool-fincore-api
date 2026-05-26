import { Schema, model, Document, Types } from 'mongoose';
import { TRANSFER_STATUS, TransferStatus } from '../../constants/status';

export type TransferDocument = Document & {
  fromAccountId: Types.ObjectId;
  toAccountId: Types.ObjectId;
  amount: number;
  status: TransferStatus;
  description: string;
  reference: string;
  createdAt: Date;
  updatedAt: Date;
};

const transferSchema = new Schema<TransferDocument>(
  {
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'From account id is required'],
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: [true, 'To account id is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    status: {
      type: String,
      enum: Object.values(TRANSFER_STATUS),
      default: TRANSFER_STATUS.COMPLETED,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    reference: {
      type: String,
      required: [true, 'Reference is required'],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Transfer = model<TransferDocument>('Transfer', transferSchema);