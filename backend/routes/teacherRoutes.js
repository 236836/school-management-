// backend/routes/teacherRoutes.js
import express from 'express';
import { protect }        from '../middleware/auth.js';
import { teacherOrAdmin } from '../middleware/roleCheck.js';
import { uploadAssignment } from '../config/cloudinary.js';
import {
  getTeacherDashboard,
  getMyClasses,
  getClassStudents,
  markAttendance,
  getClassAttendance,
  createAssignment,
  getTeacherAssignments,
  getAssignmentById,
  gradeSubmission,
  postNotice,
  getTeacherNotices,
} from '../controllers/teacherController.js';

const router = express.Router();

router.use(protect, teacherOrAdmin);

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', getTeacherDashboard);

// ── My Classes ────────────────────────────────────────────
router.get('/my-classes',                  getMyClasses);
router.get('/classes/:classId/students',   getClassStudents);

// ── Attendance ────────────────────────────────────────────
router.post('/attendance',  markAttendance);
router.get('/attendance',   getClassAttendance);

// ── Assignments ───────────────────────────────────────────
router.get('/assignments',       getTeacherAssignments);
router.get('/assignments/:id',   getAssignmentById);
router.post('/assignments',
  uploadAssignment.single('file'), createAssignment);
router.post('/assignments/grade', gradeSubmission);

// ── Notices ───────────────────────────────────────────────
router.post('/notices', postNotice);
router.get('/notices',  getTeacherNotices);

export default router;