import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const seedUsers = async () => {
  try {
    // 1. Connect to MongoDB using existing configuration
    await connectDB();

    console.log('[Seeding Users] Checking existing users...');

    // 2. Remove existing users with these emails to prevent duplicate key errors
    await User.deleteMany({
      email: { $in: ['kamal@gmail.com', 'admin@rajarata.lk'] },
    });

    console.log('[Seeding Users] Inserting Tourist user...');
    // We use "new User" and ".save()" so the pre('save') bcrypt hashing hook is guaranteed to execute
    const tourist = new User({
      name: 'Kamal Perera',
      email: 'kamal@gmail.com',
      password: 'TouristPassword123',
      role: 'tourist',
    });
    await tourist.save();

    console.log('[Seeding Users] Inserting Admin user...');
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@rajarata.lk',
      password: 'AdminPassword123',
      role: 'admin',
    });
    await admin.save();

    console.log('--------------------------------------------------');
    console.log(' Successfully seeded users into rajarata_daytrail!');
    console.log('--------------------------------------------------');
    console.log(`1. Tourist Account:`);
    console.log(`   Name:     ${tourist.name}`);
    console.log(`   Email:    ${tourist.email}`);
    console.log(`   Password: TouristPassword123`);
    console.log(`   Role:     ${tourist.role}`);
    console.log(`   ID:       ${tourist._id}`);
    console.log('--------------------------------------------------');
    console.log(`2. Administrator Account:`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: AdminPassword123`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   ID:       ${admin._id}`);
    console.log('--------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error] Failed to seed users:', error);
    process.exit(1);
  }
};

seedUsers();