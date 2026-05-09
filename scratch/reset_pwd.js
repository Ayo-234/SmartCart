import './fix_env.js';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  await connectDB();
  const email = 'admin@quickcart.com';
  const user = await User.findOne({ email });
  if (user) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash('admin123', salt);
    user.role = 'admin';
    await user.save();
    console.log('Password reset to admin123 for', email);
  } else {
    console.log('User not found');
  }
  process.exit(0);
}

resetPassword();
