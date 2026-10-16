// backend/controllers/authController.js
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import { sendEmail, welcomeEmailTemplate } from '../utils/sendEmail.js';
import crypto from 'crypto';

// ============================================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// ============================================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create user (password hashing happens in model pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone
    });

    // Create role-specific profile
    if (role === 'student') {
      const count = await Student.countDocuments();
      await Student.create({
        user: user._id,
        rollNumber: `STU${Date.now()}${count + 1}`,
        admissionNumber: `ADM${new Date().getFullYear()}${String(count + 1).padStart(4, '0')}`
      });
    } else if (role === 'teacher') {
      const count = await Teacher.countDocuments();
      await Teacher.create({
        user: user._id,
        employeeId: `EMP${Date.now()}${count + 1}`,
        isApproved: false // Needs admin approval
      });
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: '🎉 Welcome to School Management System',
      html: welcomeEmailTemplate(name, role || 'student')
    });

    // Generate token and set cookie
    const token = generateTokenAndSetCookie(user._id, user.role, res);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome aboard! 🎉',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto
      },
      token
    });

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed. Please try again.'
    });
  }
};

// ============================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate token and set cookie
    const token = generateTokenAndSetCookie(user._id, user.role, res);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        lastLogin: user.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// ============================================
// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
// ============================================
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) // Expire immediately
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully. See you soon! 👋'
  });
};

// ============================================
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
// ============================================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============================================
// @desc    Update profile photo
// @route   PUT /api/auth/update-photo
// @access  Private
// ============================================
export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePhoto: {
          url: req.file.path,
          publicId: req.file.filename
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully! 📸',
      profilePhoto: user.profilePhoto
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};