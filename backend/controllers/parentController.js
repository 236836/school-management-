// backend/controllers/parentController.js
import Student    from '../models/Student.js';
import Fee        from '../models/Fee.js';
import Notice     from '../models/Notice.js';
import Attendance from '../models/Attendance.js';

// ── Parent Dashboard ──────────────────────────────────────
export const getParentDashboard = async (req, res) => {
  try {
    const children = await Student.find({
      'parentInfo.parentUser': req.user.id,
    })
      .populate('user',  'name email profilePhoto')
      .populate('class', 'name section');

    const notices = await Notice.find({
      isApproved: true,
      $or: [
        { targetAudience: 'all'     },
        { targetAudience: 'parents' },
      ],
    })
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get pending fees for all children
    let totalPendingFees = 0;
    for (const child of children) {
      const pendingCount = await Fee.countDocuments({
        student: child._id,
        status:  { $in: ['pending', 'overdue'] },
      });
      totalPendingFees += pendingCount;
    }

    res.status(200).json({
      success: true,
      dashboard: {
        children,
        notices,
        totalChildren:   children.length,
        totalPendingFees,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get My Children ───────────────────────────────────────
export const getMyChildren = async (req, res) => {
  try {
    const children = await Student.find({
      'parentInfo.parentUser': req.user.id,
    })
      .populate('user',  'name email profilePhoto phone')
      .populate('class', 'name section');

    res.status(200).json({ success: true, children });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Child Attendance ──────────────────────────────────
export const getChildAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Verify child belongs to this parent
    const student = await Student.findOne({
      _id:                     studentId,
      'parentInfo.parentUser': req.user.id,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'Access denied or student not found.',
      });
    }

    const records = await Attendance.find({
      class:             student.class,
      'records.student': student._id,
    }).sort({ date: -1 });

    const attendance = records.map(record => {
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
      total:   attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent:  attendance.filter(a => a.status === 'absent').length,
      late:    attendance.filter(a => a.status === 'late').length,
    };

    stats.percentage = stats.total > 0
      ? Math.round((stats.present / stats.total) * 100)
      : 0;

    res.status(200).json({ success: true, attendance, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Child Fees ────────────────────────────────────────
export const getChildFees = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findOne({
      _id:                     studentId,
      'parentInfo.parentUser': req.user.id,
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: 'Access denied or student not found.',
      });
    }

    const fees = await Fee.find({ student: studentId })
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

// ── Get Notices for Parent ────────────────────────────────
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      isApproved: true,
      $or: [
        { targetAudience: 'all'     },
        { targetAudience: 'parents' },
      ],
    })
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};