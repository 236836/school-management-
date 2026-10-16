// backend/routes/authRoutes.js
import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getMe, 
  updateProfilePhoto 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadProfile } from '../config/cloudinary.js';

const router = express.Router();

// Public routes (no login needed)
router.post('/register', register);
router.post('/login', login);

// Protected routes (must be logged in)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/update-photo', protect, uploadProfile.single('photo'), updateProfilePhoto);

export default router;