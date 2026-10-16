// backend/models/Subject.js
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  totalMarks: {
    type: Number,
    default: 100
  },
  passingMarks: {
    type: Number,
    default: 33
  }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);