import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.js'; // Adjust the path if needed

dotenv.config();

const createAdminUser = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('hamzammemon123', 10);

  const admin = new User({
    email: 'admin@example.com',
    password: hashedPassword,
    isAdmin: true,
  });

  await admin.save();
  console.log('Admin user created');
  process.exit();
};

createAdminUser();
