// backend/middleware/roleCheck.js

// ── Generic Role Checker ──────────────────────────────────
// Usage: authorize('admin', 'teacher')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not allowed.`,
      });
    }
    next();
  };
};

// ── Admin Only ────────────────────────────────────────────
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.',
    });
  }
  next();
};

// ── Teacher Only ──────────────────────────────────────────
export const teacherOnly = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teachers only.',
    });
  }
  next();
};

// ── Student Only ──────────────────────────────────────────
export const studentOnly = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Students only.',
    });
  }
  next();
};

// ── Parent Only ───────────────────────────────────────────
export const parentOnly = (req, res, next) => {
  if (req.user.role !== 'parent') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Parents only.',
    });
  }
  next();
};

// ── Teacher OR Admin ──────────────────────────────────────
export const teacherOrAdmin = (req, res, next) => {
  if (!['teacher', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teachers or Admins only.',
    });
  }
  next();
};

// ── Student OR Parent ─────────────────────────────────────
export const studentOrParent = (req, res, next) => {
  if (!['student', 'parent'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Students or Parents only.',
    });
  }
  next();
};

// ── Any Authenticated User ────────────────────────────────
export const anyRole = (req, res, next) => {
  const validRoles = ['admin', 'teacher', 'student', 'parent'];
  if (!validRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Invalid role.',
    });
  }
  next();
};