import { connectDatabase } from '../config/database';
import { USER_ROLES, UserRole } from '../constants/roles';
import { USER_STATUS } from '../constants/status';
import { env } from '../config/env';
import { User } from '../modules/users/user.model';
import { hashPassword } from '../utils/password';
import mongoose from 'mongoose';

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

    console.log('Seed users created successfully:');

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