// backend/routes/adminRoutes.js
import express   from 'express';
import { protect }   from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleCheck.js';
import {
  getDashboardStats,
  getAllStudents,
  getStudentById,
  updateStudent,
  getAllTeachers,
  approveTeacher,
  deleteUser,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  assignTeacherToClass,
  assignStudentToClass,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  approveNotice,
  getAllFees,
  createFee,
  updateFeeStatus,
  getAttendanceReport,
} from '../controllers/adminController.js';

const router = express.Router();

// ── All routes need admin login ───────────────────────────
router.use(protect, adminOnly);

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Students ──────────────────────────────────────────────
router.get('/students',     getAllStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);

// ── Teachers ──────────────────────────────────────────────
router.get('/teachers',             getAllTeachers);
router.put('/teachers/:id/approve', approveTeacher);
router.delete('/users/:id',         deleteUser);

// ── Classes ───────────────────────────────────────────────
router.get('/classes',                 getAllClasses);
router.post('/classes',                createClass);
router.put('/classes/:id',             updateClass);
router.delete('/classes/:id',          deleteClass);
router.post('/classes/assign-teacher', assignTeacherToClass);
router.post('/classes/assign-student', assignStudentToClass);

// ── Subjects ──────────────────────────────────────────────
router.get('/subjects',        getAllSubjects);
router.post('/subjects',       createSubject);
router.put('/subjects/:id',    updateSubject);
router.delete('/subjects/:id', deleteSubject);

// ── Notices ───────────────────────────────────────────────
router.get('/notices',             getAllNotices);
router.post('/notices',            createNotice);
router.put('/notices/:id',         updateNotice);
router.delete('/notices/:id',      deleteNotice);
router.put('/notices/:id/approve', approveNotice);

// ── Fees ──────────────────────────────────────────────────
router.get('/fees',     getAllFees);
router.post('/fees',    createFee);
router.put('/fees/:id', updateFeeStatus);

// ── Attendance ────────────────────────────────────────────
router.get('/attendance', getAttendanceReport);

export default router;