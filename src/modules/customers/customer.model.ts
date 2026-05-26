import { Schema, model, Document, Types } from 'mongoose';
import { CUSTOMER_STATUS, CustomerStatus } from '../../constants/status';

export type CustomerRiskLevel = 'low' | 'medium' | 'high';

export type CustomerDocument = Document & {
  userId: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  taxId: string;
  occupation: string;
  monthlyIncome: number;
  kycStatus: CustomerStatus;
  riskLevel: CustomerRiskLevel;
  createdAt: Date;
  updatedAt: Date;
};

const customerSchema = new Schema<CustomerDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    taxId: {
      type: String,
      required: [true, 'Tax id is required'],
      trim: true,
      unique: true,
    },
    occupation: {
      type: String,
      required: [true, 'Occupation is required'],
      trim: true,
    },
    monthlyIncome: {
      type: Number,
      required: [true, 'Monthly income is required'],
      min: [0, 'Monthly income cannot be negative'],
    },
    kycStatus: {
      type: String,
      enum: Object.values(CUSTOMER_STATUS),
      default: CUSTOMER_STATUS.PENDING_KYC,
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = model<CustomerDocument>('Customer', customerSchema);