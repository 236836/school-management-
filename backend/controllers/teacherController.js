// backend/controllers/teacherController.js
import Teacher    from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Notice     from '../models/Notice.js';
import Class      from '../models/Class.js';
import Student    from '../models/Student.js';

// ── Get Teacher Dashboard ─────────────────────────────────
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id })
      .populate('assignedClasses',  'name section room')
      .populate('assignedSubjects', 'name code');

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found. Contact admin.',
      });
    }

    const [totalAssignments, pendingArr, recentAttendance] =
      await Promise.all([
        Assignment.countDocuments({
          teacher:  teacher._id,
          isActive: true,
        }),
        Assignment.aggregate([
          { $match: { teacher: teacher._id } },
          { $unwind: '$submissions' },
          { $match: { 'submissions.status': 'submitted' } },
          { $count: 'total' },
        ]),
        Attendance.find({ markedBy: teacher._id })
          .sort({ date: -1 })
          .limit(7)
          .populate('class', 'name section'),
      ]);

    res.status(200).json({
      success: true,
      teacher,
      stats: {
        totalClasses:       teacher.assignedClasses.length,
        totalAssignments,
        pendingSubmissions: pendingArr[0]?.total || 0,
        recentAttendance,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Classes ────────────────────────────────────────
export const getMyClasses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    const classes = await Class.find({
      _id: { $in: teacher.assignedClasses },
    })
      .populate({
        path:     'students',
        populate: { path: 'user', select: 'name email profilePhoto' },
      })
      .populate('subjects', 'name code')
      .sort({ name: 1 });

    res.status(200).json({ success: true, classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Students of a Class ───────────────────────────────
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.find({
      class:    classId,
      isActive: true,
    })
      .populate('user', 'name email profilePhoto phone')
      .sort({ rollNumber: 1 });

    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Mark Attendance ───────────────────────────────────────
export const markAttendance = async (req, res) => {
  try {
    const { classId, date, records } = req.body;

    if (!classId || !date || !records || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Class, date and records are required.',
      });
    }

    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      class: classId,
      date:  attendanceDate,
    });

    if (existing) {
      existing.records = records;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: 'Attendance updated! ✅',
        attendance: existing,
      });
    }

    const attendance = await Attendance.create({
      class:    classId,
      date:     attendanceDate,
      markedBy: teacher._id,
      records,
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked! ✅',
      attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Class Attendance ──────────────────────────────────
export const getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;

    const query = {};
    if (classId) query.class = classId;

    if (date) {
      const d    = new Date(date);
      d.setHours(0, 0, 0, 0);
      const dEnd = new Date(date);
      dEnd.setHours(23, 59, 59, 999);
      query.date = { $gte: d, $lte: dEnd };
    }

    const attendance = await Attendance.find(query)
      .populate({
        path:     'records.student',
        populate: { path: 'user', select: 'name profilePhoto' },
      })
      .populate('class', 'name section')
      .sort({ date: -1 });

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Create Assignment ─────────────────────────────────────
export const createAssignment = async (req, res) => {
  try {
    const {
      title, description, classId,
      subjectId, dueDate, totalMarks,
    } = req.body;

    if (!title || !classId || !subjectId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, class, subject and due date are required.',
      });
    }

    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    let fileUrl      = '';
    let filePublicId = '';

    if (req.file) {
      const { uploadToCloudinary } = await import('../config/cloudinary.js');
      const uploaded = await uploadToCloudinary(
        req.file.buffer, 'assignments'
      );
      fileUrl      = uploaded.url;
      filePublicId = uploaded.publicId;
    }

    const assignment = await Assignment.create({
      title,
      description,
      class:      classId,
      subject:    subjectId,
      teacher:    teacher._id,
      dueDate:    new Date(dueDate),
      totalMarks: totalMarks || 100,
      fileUrl,
      filePublicId,
    });

    res.status(201).json({
      success: true,
      message: `Assignment "${title}" created! 📝`,
      assignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Teacher Assignments ───────────────────────────────
export const getTeacherAssignments = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found.',
      });
    }

    const assignments = await Assignment.find({ teacher: teacher._id })
      .populate('class',   'name section')
      .populate('subject', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Assignment By ID ──────────────────────────────────
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('class',   'name section')
      .populate('subject', 'name code')
      .populate({
        path:     'submissions.student',
        populate: { path: 'user', select: 'name email profilePhoto' },
      });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    res.status(200).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Grade Submission ──────────────────────────────────────
export const gradeSubmission = async (req, res) => {
  try {
    const { assignmentId, studentId, grade, feedback } = req.body;

    if (grade === undefined || grade === null) {
      return res.status(400).json({
        success: false,
        message: 'Grade is required.',
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found.',
      });
    }

    const idx = assignment.submissions.findIndex(
      s => s.student.toString() === studentId
    );

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Student submission not found.',
      });
    }

    assignment.submissions[idx].grade    = grade;
    assignment.submissions[idx].feedback = feedback || '';
    assignment.submissions[idx].status   = 'graded';
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Submission graded! 🎯',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Post Notice ───────────────────────────────────────────
export const postNotice = async (req, res) => {
  try {
    const { title, content, targetClass, priority } = req.body;

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
      targetAudience: targetClass ? 'specific-class' : 'students',
      targetClass:    targetClass || null,
      priority:       priority    || 'medium',
      isApproved:     false,
    });

    res.status(201).json({
      success: true,
      message: 'Notice submitted for admin approval! 📢',
      notice,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Teacher Notices ───────────────────────────────────
export const getTeacherNotices = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id });

    const notices = await Notice.find({
      $or: [
        { isApproved: true,  targetAudience: 'all'      },
        { isApproved: true,  targetAudience: 'teachers' },
        { postedBy:   req.user.id },
      ],
    })
      .populate('postedBy',    'name role')
      .populate('targetClass', 'name section')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};