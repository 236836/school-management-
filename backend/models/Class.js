// backend/models/Class.js
import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    // e.g., "Grade 10"
  },
  section: {
    type: String,
    required: true,
    // e.g., "A", "B", "C"
  },
  classTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  academicYear: {
    type: String,
    default: '2024-2025'
  },
  maxStrength: {
    type: Number,
    default: 40
  },
  room: String
}, { timestamps: true });

// Compound unique index - same class name + section must be unique
classSchema.index({ name: 1, section: 1 }, { unique: true });

export default mongoose.model('Class', classSchema);