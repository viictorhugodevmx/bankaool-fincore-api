import { Schema, model, Document, Types } from 'mongoose';
import { ACCOUNT_STATUS, AccountStatus } from '../../constants/status';

export type AccountDocument = Document & {
  customerId: Types.ObjectId;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
};

const accountSchema = new Schema<AccountDocument>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer id is required'],
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required'],
      unique: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    currency: {
      type: String,
      required: true,
      default: 'MXN',
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },
    dailyLimit: {
      type: Number,
      required: true,
      default: 25000,
      min: [0, 'Daily limit cannot be negative'],
    },
    monthlyLimit: {
      type: Number,
      required: true,
      default: 150000,
      min: [0, 'Monthly limit cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

export const Account = model<AccountDocument>('Account', accountSchema);