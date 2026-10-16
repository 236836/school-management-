// backend/routes/studentRoutes.js
import express from 'express';
import { protect }     from '../middleware/auth.js';
import { studentOnly } from '../middleware/roleCheck.js'; // ← This must exist
import { uploadAssignment } from '../config/cloudinary.js';
import {
  getStudentDashboard,
  getMyAttendance,
  getMyAssignments,
  submitAssignment,
  getMyFees,
  getMyNotices,
} from '../controllers/studentController.js';

const router = express.Router();

router.use(protect, studentOnly);

router.get('/dashboard',  getStudentDashboard);
router.get('/attendance', getMyAttendance);
router.get('/assignments', getMyAssignments);
router.post(
  '/assignments/:assignmentId/submit',
  uploadAssignment.single('file'),
  submitAssignment
);
router.get('/fees',    getMyFees);
router.get('/notices', getMyNotices);

export default router;