// backend/models/Fee.js
import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeType: {
    type: String,
    enum: ['tuition', 'transport', 'library', 'sports', 'examination', 'other'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'partial'],
    default: 'pending'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  month: String, // e.g., "January 2024"
  academicYear: String,
  remarks: String
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);