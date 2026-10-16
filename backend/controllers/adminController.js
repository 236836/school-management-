// backend/controllers/adminController.js
import User     from '../models/User.js';
import Student  from '../models/Student.js';
import Teacher  from '../models/Teacher.js';
import Class    from '../models/Class.js';
import Subject  from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import Fee      from '../models/Fee.js';
import Notice   from '../models/Notice.js';

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
export const getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      pendingFees,
      recentNotices,
      attendanceToday,
    ] = await Promise.all([
      Student.countDocuments({ isActive: true }),
      Teacher.countDocuments({ isActive: true, isApproved: true }),
      Class.countDocuments(),
      Fee.countDocuments({ status: 'pending' }),
      Notice.find({ isApproved: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('postedBy', 'name role'),
      Attendance.find({
        date: { $gte: todayStart, $lte: todayEnd },
      }),
    ]);

    // Calculate attendance percentage
    const totalPresent = attendanceToday.reduce((acc, att) => {
      return acc + att.records.filter(r => r.status === 'present').length;
    }, 0);

    const totalRecords = attendanceToday.reduce(
      (acc, att) => acc + att.records.length, 0
    );

    const attendancePercentage = totalRecords > 0
      ? Math.round((totalPresent / totalRecords) * 100)
      : 0;

    // Fee chart - last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const feeChart = await Fee.aggregate([
      {
        $match: {
          status:    'paid',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month:  '$createdAt' },
            year:  { $year:   '$createdAt' },
          },
          totalCollected: { $sum: '$paidAmount' },
          count:          { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        totalClasses,
        pendingFees,
        attendancePercentage,
        recentNotices,
        feeChart,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// STUDENT MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllStudents = async (req, res) => {
  try {
    const {
      search = '',
      page   = 1,
      limit  = 10,
      classId,
    } = req.query;

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    let studentQuery = { isActive: true };
    if (classId) studentQuery.class = classId;

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name:  { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
        role: 'student',
      }).select('_id');

      studentQuery.user = {
        $in: matchingUsers.map(u => u._id),
      };
    }

    const [students, total] = await Promise.all([
      Student.find(studentQuery)
        .populate('user',  'name email phone profilePhoto isActive')
        .populate('class', 'name section')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Student.countDocuments(studentQuery),
    ]);

    res.status(200).json({
      success: true,
      students,
      pagination: {
        currentPage: pageNum,
        totalPages:  Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user',  'name email phone profilePhoto address')
      .populate('class', 'name section');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const {
      name, phone, address, gender,
      dateOfBirth, bloodGroup, classId, parentInfo,
      userId,
    } = req.body;

    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { name, phone, address },
        { new: true }
      );
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        gender,
        dateOfBirth,
        bloodGroup,
        class: classId,
        parentInfo,
      },
      { new: true }
    ).populate('user', 'name email phone profilePhoto');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully! ✅',
      student,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// TEACHER MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllTeachers = async (req, res) => {
  try {
    const {
      search   = '',
      page     = 1,
      limit    = 10,
      approved,
    } = req.query;

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    let teacherQuery = {};
    if (approved !== undefined) {
      teacherQuery.isApproved = approved === 'true';
    }

    if (search) {
      const matchingUsers = await User.find({
        $or: [
          { name:  { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
        role: 'teacher',
      }).select('_id');

      teacherQuery.user = {
        $in: matchingUsers.map(u => u._id),
      };
    }

    const [teachers, total] = await Promise.all([
      Teacher.find(teacherQuery)
        .populate('user',             'name email phone profilePhoto isActive')
        .populate('assignedClasses',  'name section')
        .populate('assignedSubjects', 'name code')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Teacher.countDocuments(teacherQuery),
    ]);

    res.status(200).json({
      success: true,
      teachers,
      pagination: {
        currentPage: pageNum,
        totalPages:  Math.ceil(total / limitNum),
        total,
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('user', 'name email');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Teacher ${teacher.user.name} approved! ✅`,
      teacher,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// CLASS MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path:     'classTeacher',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('subjects', 'name code')
      .populate({
        path:     'students',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ name: 1, section: 1 });

    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createClass = async (req, res) => {
  try {
    const {
      name, section, academicYear, room, maxStrength,
    } = req.body;

    if (!name || !section) {
      return res.status(400).json({
        success: false,
        message: 'Class name and section are required.',
      });
    }

    const existing = await Class.findOne({
      name:    name.trim(),
      section: section.trim().toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Class ${name} - Section ${section} already exists.`,
      });
    }

    const newClass = await Class.create({
      name:        name.trim(),
      section:     section.trim().toUpperCase(),
      academicYear,
      room,
      maxStrength,
    });

    res.status(201).json({
      success: true,
      message: `Class ${name}-${section} created! 📚`,
      class:   newClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class updated! ✅',
      class:   updatedClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignTeacherToClass = async (req, res) => {
  try {
    const { classId, teacherId } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { classTeacher: teacherId },
      { new: true }
    );

    await Teacher.findByIdAndUpdate(teacherId, {
      $addToSet: { assignedClasses: classId },
    });

    res.status(200).json({
      success: true,
      message: 'Teacher assigned to class! ✅',
      class:   updatedClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.body;

    await Class.findByIdAndUpdate(classId, {
      $addToSet: { students: studentId },
    });

    await Student.findByIdAndUpdate(studentId, {
      class: classId,
    });

    res.status(200).json({
      success: true,
      message: 'Student assigned to class! ✅',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// SUBJECT MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path:     'teacher',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('class', 'name section')
      .sort({ name: 1 });

    res.status(200).json({ success: true, subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSubject = async (req, res) => {
  try {
    const {
      name, code, description,
      classId, teacherId,
      totalMarks, passingMarks,
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Subject name and code are required.',
      });
    }

    // Check duplicate code
    const existing = await Subject.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Subject code "${code}" already exists.`,
      });
    }

    const subject = await Subject.create({
      name,
      code:        code.toUpperCase(),
      description,
      class:        classId   || null,
      teacher:      teacherId || null,
      totalMarks:   totalMarks   || 100,
      passingMarks: passingMarks || 33,
    });

    // Add subject to class
    if (classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { subjects: subject._id },
      });
    }

    // Add subject to teacher
    if (teacherId) {
      await Teacher.findByIdAndUpdate(teacherId, {
        $addToSet: { assignedSubjects: subject._id },
      });
    }

    res.status(201).json({
      success: true,
      message: `Subject "${name}" created! 📖`,
      subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const {
      name, code, description,
      classId, teacherId,
      totalMarks, passingMarks,
    } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code:         code?.toUpperCase(),
        description,
        class:         classId   || null,
        teacher:       teacherId || null,
        totalMarks,
        passingMarks,
      },
      { new: true, runValidators: true }
    )
      .populate({
        path:     'teacher',
        populate: { path: 'user', select: 'name' },
      })
      .populate('class', 'name section');

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated! ✅',
      subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found.',
      });
    }

    // Remove from class
    await Class.updateMany(
      { subjects: req.params.id },
      { $pull: { subjects: req.params.id } }
    );

    // Remove from teacher
    await Teacher.updateMany(
      { assignedSubjects: req.params.id },
      { $pull: { assignedSubjects: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// NOTICE MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllNotices = async (req, res) => {
  try {
    const {
      page     = 1,
      limit    = 10,
      approved,
    } = req.query;

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    let query = {};
    if (approved !== undefined) {
      query.isApproved = approved === 'true';
    }

    const [notices, total] = await Promise.all([
      Notice.find(query)
        .populate('postedBy',    'name role')
        .populate('targetClass', 'name section')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Notice.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      notices,
      pagination: {
        currentPage: pageNum,
        totalPages:  Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const {
      title, content, targetAudience,
      targetClass, priority, expiryDate,
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const notice = await Notice.create({
      title,
      content,
      postedBy:       req.user.id,
      targetAudience: targetAudience || 'all',
      targetClass:    targetClass    || null,
      priority:       priority       || 'medium',
      expiryDate:     expiryDate     || null,
      isApproved:     true,
    });

    res.status(201).json({
      success: true,
      message: 'Notice posted! 📢',
      notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice updated! ✅',
      notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notice deleted.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notice approved! ✅',
      notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// FEE MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const getAllFees = async (req, res) => {
  try {
    const {
      page      = 1,
      limit     = 10,
      status,
      studentId,
    } = req.query;

    const pageNum  = parseInt(page);
    const limitNum = parseInt(limit);
    const skip     = (pageNum - 1) * limitNum;

    let query = {};
    if (status)    query.status  = status;
    if (studentId) query.student = studentId;

    const [fees, total] = await Promise.all([
      Fee.find(query)
        .populate({
          path:     'student',
          populate: { path: 'user', select: 'name email' },
        })
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Fee.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      fees,
      pagination: {
        currentPage: pageNum,
        totalPages:  Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFee = async (req, res) => {
  try {
    const {
      studentId, feeType, amount,
      dueDate, month, academicYear, remarks,
    } = req.body;

    if (!studentId || !feeType || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Student, fee type, amount and due date are required.',
      });
    }

    const count         = await Fee.countDocuments();
    const receiptNumber = `REC${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;

    const fee = await Fee.create({
      student:      studentId,
      feeType,
      amount,
      dueDate,
      month,
      academicYear: academicYear || '2024-2025',
      receiptNumber,
      remarks,
    });

    res.status(201).json({
      success: true,
      message: 'Fee record created! 💰',
      fee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeeStatus = async (req, res) => {
  try {
    const { status, paidAmount, paidDate, remarks } = req.body;

    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      {
        status,
        paidAmount,
        paidDate: paidDate || new Date(),
        remarks,
      },
      { new: true }
    ).populate({
      path:     'student',
      populate: { path: 'user', select: 'name email' },
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee status updated! ✅',
      fee,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════
// ATTENDANCE REPORTS
// ═══════════════════════════════════════════════════════════
export const getAttendanceReport = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    const query = {};
    if (classId) query.class = classId;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate('class',    'name section')
      .populate('markedBy', 'user')
      .populate({
        path:     'records.student',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ date: -1 });

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};