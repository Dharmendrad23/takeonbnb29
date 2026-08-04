/**
 * Run this script to create the admin user in MongoDB.
 * Usage:  node create-admin.js
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['guest', 'host', 'admin'], default: 'guest' },
  isVerified:{ type: Boolean, default: false },
  phone:     { type: String, default: '' },
  avatar:    { type: String, default: '' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const ADMIN_EMAIL    = 'admin@takeonbnb.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME     = 'Super Admin';

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('✅ Existing user upgraded to admin role.');
    } else {
      console.log('ℹ️  Admin user already exists. No changes made.');
    }
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
  });

  console.log('');
  console.log('🎉 Admin user created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Email    : ${ADMIN_EMAIL}`);
  console.log(`   Password : ${ADMIN_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  Please change your password after first login!');
  console.log('');

  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
