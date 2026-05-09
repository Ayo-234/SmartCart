import './fix_env.js';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

async function fixAdmin() {
  await connectDB();
  const email = 'admin@quickcart.com';
  const user = await User.findOne({ email });
  if (user) {
    console.log('Found user:', user.email, 'Current role:', user.role);
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log('Updated user role to admin');
    }
  } else {
    console.log('User not found:', email);
  }
  process.exit(0);
}

fixAdmin();
