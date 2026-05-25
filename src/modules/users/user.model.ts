import { Schema, model, Document } from 'mongoose';
import { USER_ROLES, UserRole } from '../../constants/roles';
import { USER_STATUS, UserStatus } from '../../constants/status';

export type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'User name must have at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'User password is required'],
      minlength: [6, 'Password must have at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<UserDocument>('User', userSchema);