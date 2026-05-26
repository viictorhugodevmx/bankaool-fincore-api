import mongoose from 'mongoose';

import { connectDatabase } from '../config/database';
import { env } from '../config/env';
import { USER_ROLES, UserRole } from '../constants/roles';
import {
  ACCOUNT_STATUS,
  CUSTOMER_STATUS,
  MOVEMENT_TYPE,
  USER_STATUS,
} from '../constants/status';
import { Account } from '../modules/accounts/account.model';
import { Customer } from '../modules/customers/customer.model';
import { Movement } from '../modules/movements/movement.model';
import { User } from '../modules/users/user.model';
import { hashPassword } from '../utils/password';

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

    await Movement.deleteMany({});

    await Account.deleteMany({
      accountNumber: {
        $in: ['BK3600000001', 'BK3600000002'],
      },
    });

    await Customer.deleteMany({
      email: {
        $in: ['victor.customer@bankaool.test', 'andrea.customer@bankaool.test'],
      },
    });

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

    const victorUser = createdUsers.find(
      (user) => user.email === 'victor.customer@bankaool.test'
    );

    const andreaUser = createdUsers.find(
      (user) => user.email === 'andrea.customer@bankaool.test'
    );

    if (!victorUser || !andreaUser) {
      throw new Error('Customer seed users were not created correctly');
    }

    const createdCustomers = await Customer.insertMany([
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

    const victorCustomer = createdCustomers.find(
      (customer) => customer.email === 'victor.customer@bankaool.test'
    );

    const andreaCustomer = createdCustomers.find(
      (customer) => customer.email === 'andrea.customer@bankaool.test'
    );

    if (!victorCustomer || !andreaCustomer) {
      throw new Error('Customer profiles were not created correctly');
    }

    const createdAccounts = await Account.insertMany([
      {
        customerId: victorCustomer._id,
        accountNumber: 'BK3600000001',
        balance: 75000,
        currency: 'MXN',
        status: ACCOUNT_STATUS.ACTIVE,
        dailyLimit: 25000,
        monthlyLimit: 150000,
      },
      {
        customerId: andreaCustomer._id,
        accountNumber: 'BK3600000002',
        balance: 42000,
        currency: 'MXN',
        status: ACCOUNT_STATUS.ACTIVE,
        dailyLimit: 15000,
        monthlyLimit: 90000,
      },
    ]);

    const victorAccount = createdAccounts.find(
      (account) => account.accountNumber === 'BK3600000001'
    );

    const andreaAccount = createdAccounts.find(
      (account) => account.accountNumber === 'BK3600000002'
    );

    if (!victorAccount || !andreaAccount) {
      throw new Error('Seed accounts were not created correctly');
    }

    await Movement.insertMany([
      {
        accountId: victorAccount._id,
        type: MOVEMENT_TYPE.DEPOSIT,
        amount: 50000,
        balanceAfter: 50000,
        description: 'Initial funding deposit',
        reference: 'SEED-VIC-DEP-001',
      },
      {
        accountId: victorAccount._id,
        type: MOVEMENT_TYPE.DEPOSIT,
        amount: 25000,
        balanceAfter: 75000,
        description: 'Payroll deposit',
        reference: 'SEED-VIC-DEP-002',
      },
      {
        accountId: andreaAccount._id,
        type: MOVEMENT_TYPE.DEPOSIT,
        amount: 42000,
        balanceAfter: 42000,
        description: 'Initial funding deposit',
        reference: 'SEED-AND-DEP-001',
      },
    ]);

    console.log('Seed users created successfully:');
    createdUsers.forEach((user) => {
      console.log(`- ${user.name} | ${user.email} | ${user.role}`);
    });

    console.log('Seed customers created successfully:');
    console.log('- Victor Customer | active | low risk');
    console.log('- Andrea Customer | pending_kyc | medium risk');

    console.log('Seed accounts created successfully:');
    console.log('- BK3600000001 | Victor Customer | 75000 MXN');
    console.log('- BK3600000002 | Andrea Customer | 42000 MXN');

    console.log('Seed movements created successfully:');
    console.log('- Victor account | 2 deposits');
    console.log('- Andrea account | 1 deposit');

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