// backend/controllers/studentController.js
import Student    from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Notice     from '../models/Notice.js';
import Fee        from '../models/Fee.js';

// ── Student Dashboard ─────────────────────────────────────
export const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('user',  'name email profilePhoto phone')
      .populate('class', 'name section');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const [
      upcomingAssignments,
      notices,
      pendingFees,
      allAttendance,
    ] = await Promise.all([
      Assignment.find({
        class:    student.class?._id,
        dueDate:  { $gte: new Date() },
        isActive: true,
      })
        .populate('subject', 'name')
        .sort({ dueDate: 1 })
        .limit(5),

      Notice.find({
        isApproved: true,
        $or: [
          { targetAudience: 'all'      },
          { targetAudience: 'students' },
          { targetClass: student.class?._id },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(5),

      Fee.countDocuments({
        student: student._id,
        status:  { $in: ['pending', 'overdue'] },
      }),

      Attendance.find({
        class:             student.class?._id,
        'records.student': student._id,
      }),
    ]);

    let presentCount = 0;
    const totalDays  = allAttendance.length;

    allAttendance.forEach(record => {
      const myRecord = record.records.find(
        r => r.student.toString() === student._id.toString()
      );
      if (myRecord?.status === 'present') presentCount++;
    });

    const attendancePercentage = totalDays > 0
      ? Math.round((presentCount / totalDays) * 100)
      : 0;

    res.status(200).json({
      success: true,
      student,
      dashboard: {
        upcomingAssignments,
        notices,
        pendingFees,
        attendancePercentage,
        totalDays,
        presentDays: presentCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Attendance ─────────────────────────────────────
export const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const { month, year } = req.query;

    let dateQuery = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate   = new Date(parseInt(year), parseInt(month),     0);
      dateQuery       = { date: { $gte: startDate, $lte: endDate } };
    }

    const records = await Attendance.find({
      class:             student.class,
      'records.student': student._id,
      ...dateQuery,
    }).sort({ date: -1 });

    const myAttendance = records.map(record => {
      const myRecord = record.records.find(
        r => r.student.toString() === student._id.toString()
      );
      return {
        date:   record.date,
        status: myRecord?.status || 'absent',
        note:   myRecord?.note   || '',
      };
    });

    const stats = {
      total:   myAttendance.length,
      present: myAttendance.filter(a => a.status === 'present').length,
      absent:  myAttendance.filter(a => a.status === 'absent').length,
      late:    myAttendance.filter(a => a.status === 'late').length,
      excused: myAttendance.filter(a => a.status === 'excused').length,
    };

    stats.percentage = stats.total > 0
      ? Math.round((stats.present / stats.total) * 100)
      : 0;

    res.status(200).json({
      success: true,
      attendance: myAttendance,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Assignments ────────────────────────────────────
export const getMyAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const assignments = await Assignment.find({
      class:    student.class,
      isActive: true,
    })
      .populate('subject', 'name code')
      .populate({
        path:     'teacher',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ dueDate: 1 });

    const withStatus = assignments.map(a => {
      const submission = a.submissions.find(
        s => s.student.toString() === student._id.toString()
      );
      return {
        ...a.toObject(),
        mySubmission: submission || null,
        isSubmitted:  !!submission,
        isOverdue:    !submission && new Date() > new Date(a.dueDate),
      };
    });

    res.status(200).json({ success: true, assignments: withStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Submit Assignment ─────────────────────────────────────
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment || !assignment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or closed.',
      });
    }

    const alreadySubmitted = assignment.submissions.some(
      s => s.student.toString() === student._id.toString()
    );

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment.',
      });
    }

    let fileUrl      = '';
    let filePublicId = '';

    if (req.file) {
      const { uploadToCloudinary } = await import('../config/cloudinary.js');
      const uploaded = await uploadToCloudinary(
        req.file.buffer, 'submissions'
      );
      fileUrl      = uploaded.url;
      filePublicId = uploaded.publicId;
    }

    const isLate = new Date() > new Date(assignment.dueDate);

    assignment.submissions.push({
      student:     student._id,
      fileUrl,
      filePublicId,
      status:      isLate ? 'late' : 'submitted',
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message: isLate
        ? '⚠️ Submitted late!'
        : '🎉 Assignment submitted successfully!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Fees ───────────────────────────────────────────
export const getMyFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found.',
      });
    }

    const fees = await Fee.find({ student: student._id })
      .sort({ createdAt: -1 });

    const summary = {
      total:   fees.reduce((acc, f) => acc + f.amount, 0),
      paid:    fees.filter(f => f.status === 'paid')
                   .reduce((acc, f) => acc + (f.paidAmount || 0), 0),
      pending: fees.filter(f => f.status === 'pending')
                   .reduce((acc, f) => acc + f.amount, 0),
      overdue: fees.filter(f => f.status === 'overdue')
                   .reduce((acc, f) => acc + f.amount, 0),
    };

    res.status(200).json({ success: true, fees, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Notices ────────────────────────────────────────
export const getMyNotices = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });

    const notices = await Notice.find({
      isApproved: true,
      $or: [
        { targetAudience: 'all'      },
        { targetAudience: 'students' },
        { targetClass:    student?.class },
      ],
    })
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};