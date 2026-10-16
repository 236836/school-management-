// backend/models/Teacher.js
import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    unique: true
  },
  qualification: String,
  specialization: String,
  assignedClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  assignedSubjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  salary: Number,
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false // Admin must approve teachers
  },
  experience: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);