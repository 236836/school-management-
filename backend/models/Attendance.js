// backend/models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  records: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'absent'
    },
    note: String
  }]
}, { timestamps: true });

// Prevent duplicate attendance for same class and date
attendanceSchema.index({ class: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);