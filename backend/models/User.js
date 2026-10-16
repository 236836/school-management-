// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent'],
    default: 'student'
  },
  profilePhoto: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  passwordResetToken: String,
  passwordResetExpire: Date
}, { 
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hash password BEFORE saving to database
userSchema.pre('save', async function() {
  // Only hash if password was changed
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);