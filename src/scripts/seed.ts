import { connectDatabase } from '../config/database';
import { USER_ROLES, UserRole } from '../constants/roles';
import { CUSTOMER_STATUS ,USER_STATUS } from '../constants/status';
import { env } from '../config/env';
import { User } from '../modules/users/user.model';
import { hashPassword } from '../utils/password';
import mongoose from 'mongoose';
import { Customer } from '../modules/customers/customer.model';

type SeedUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const seedUsers: SeedUser[] = [
  {
    name: 'Admin Bankaool',
    email: 'admin@bankaool.test',
    password: 'Password123',
    role: USER_ROLES.ADMIN,
  },
  {
    name: 'Olivia Operator',
    email: 'operator@bankaool.test',
    password: 'Password123',
    role: USER_ROLES.OPERATOR,
  },
  {
    name: 'Victor Customer',
    email: 'victor.customer@bankaool.test',
    password: 'Password123',
    role: USER_ROLES.CUSTOMER,
  },
  {
    name: 'Andrea Customer',
    email: 'andrea.customer@bankaool.test',
    password: 'Password123',
    role: USER_ROLES.CUSTOMER,
  },
];

const seed = async () => {
  try {
    console.log('Starting Bankaool FinCore 360 seed...');
    console.log(`Environment: ${env.nodeEnv}`);

    await connectDatabase();

    await User.deleteMany({
      email: {
        $in: seedUsers.map((user) => user.email),
      },
    });

    const usersToCreate = await Promise.all(
      seedUsers.map(async (user) => ({
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
        role: user.role,
        status: USER_STATUS.ACTIVE,
      }))
    );

    const createdUsers = await User.insertMany(usersToCreate);

    await Customer.deleteMany({
      email: {
        $in: ['victor.customer@bankaool.test', 'andrea.customer@bankaool.test'],
      },
    });

    const victorUser = createdUsers.find(
      (user) => user.email === 'victor.customer@bankaool.test'
    );

    const andreaUser = createdUsers.find(
      (user) => user.email === 'andrea.customer@bankaool.test'
    );

    if (!victorUser || !andreaUser) {
      throw new Error('Customer seed users were not created correctly');
    }

    await Customer.insertMany([
      {
        userId: victorUser._id,
        fullName: 'Victor Customer',
        email: 'victor.customer@bankaool.test',
        phone: '9610000001',
        taxId: 'VICU900101ABC',
        occupation: 'Frontend Developer',
        monthlyIncome: 65000,
        kycStatus: CUSTOMER_STATUS.ACTIVE,
        riskLevel: 'low',
      },
      {
        userId: andreaUser._id,
        fullName: 'Andrea Customer',
        email: 'andrea.customer@bankaool.test',
        phone: '9610000002',
        taxId: 'ANCU920202XYZ',
        occupation: 'Product Manager',
        monthlyIncome: 72000,
        kycStatus: CUSTOMER_STATUS.PENDING_KYC,
        riskLevel: 'medium',
      },
    ]);

    console.log('Seed users created successfully:');
    console.log('- Victor Customer | active | low risk');
    console.log('- Andrea Customer | pending_kyc | medium risk');

    createdUsers.forEach((user) => {
      console.log(`- ${user.name} | ${user.email} | ${user.role}`);
    });

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seed();