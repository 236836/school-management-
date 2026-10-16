// backend/routes/parentRoutes.js
import express from 'express';
import { protect }    from '../middleware/auth.js';
import { parentOnly } from '../middleware/roleCheck.js';
import {
  getParentDashboard,
  getMyChildren,
  getChildAttendance,
  getChildFees,
  getNotices,
} from '../controllers/parentController.js';

const router = express.Router();

router.use(protect, parentOnly);

router.get('/dashboard',                         getParentDashboard);
router.get('/children',                          getMyChildren);
router.get('/children/:studentId/attendance',    getChildAttendance);
router.get('/children/:studentId/fees',          getChildFees);
router.get('/notices',                           getNotices);

export default router;