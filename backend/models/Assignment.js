// backend/models/Assignment.js
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  fileUrl: String,
  filePublicId: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  grade: Number,
  feedback: String,
  status: {
    type: String,
    enum: ['submitted', 'graded', 'late'],
    default: 'submitted'
  }
});

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required']
  },
  description: String,
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  fileUrl: String, // Teacher's assignment file
  filePublicId: String,
  submissions: [submissionSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);