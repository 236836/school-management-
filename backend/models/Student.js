// backend/models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  admissionNumber: {
    type: String,
    unique: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  bloodGroup: String,
  parentInfo: {
    fatherName: String,
    motherName: String,
    parentContact: String,
    parentEmail: String,
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  feeStatus: {
    type: String,
    enum: ['paid', 'pending', 'partial'],
    default: 'pending'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);