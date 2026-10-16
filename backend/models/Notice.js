// backend/models/Notice.js
import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notice title is required']
  },
  content: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAudience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'specific-class'],
    default: 'all'
  },
  targetClass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approves teacher notices
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  attachmentUrl: String,
  expiryDate: Date
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);