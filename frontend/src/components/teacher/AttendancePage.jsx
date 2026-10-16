// frontend/src/components/teacher/AttendancePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { getInitials } from '../../utils/helpers';
import {
  Calendar, CheckCircle, XCircle,
  Clock, Save, RefreshCw, Users,
} from 'lucide-react';

// ── Status Button ─────────────────────────────────────────
const StatusBtn = ({ status, current, onClick }) => {
  const styles = {
    present: {
      active:   'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
      inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-emerald-50 hover:text-emerald-600',
      icon:     <CheckCircle size={14} />,
    },
    absent: {
      active:   'bg-red-500 text-white shadow-lg shadow-red-500/30',
      inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50 hover:text-red-600',
      icon:     <XCircle size={14} />,
    },
    late: {
      active:   'bg-orange-500 text-white shadow-lg shadow-orange-500/30',
      inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-orange-50 hover:text-orange-600',
      icon:     <Clock size={14} />,
    },
  };

  const s = styles[status];
  const isActive = current === status;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{   scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg
                  text-xs font-semibold transition-all duration-200
                  ${isActive ? s.active : s.inactive}`}
    >
      {s.icon}
      <span className="capitalize">{status}</span>
    </motion.button>
  );
};

// ── Main Attendance Page ──────────────────────────────────
const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate,  setSelectedDate]  = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance,    setAttendance]    = useState({});
  const [saving,        setSaving]        = useState(false);

  // Get teacher dashboard to find assigned classes
  const { data: dashData } = useFetch('/teacher/dashboard');
  const assignedClasses = dashData?.teacher?.assignedClasses || [];

  // Get students of selected class
  const { data: studentsData, loading: studentsLoading } = useFetch(
    selectedClass ? `/teacher/classes/${selectedClass}/students` : null
  );
  const students = studentsData?.students || [];

  // Initialize attendance when students load
  useEffect(() => {
    if (students.length > 0) {
      const initial = {};
      students.forEach(s => {
        initial[s._id] = attendance[s._id] || 'present';
      });
      setAttendance(initial);
    }
  }, [students]);

  // Mark all at once
  const markAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s._id] = status; });
    setAttendance(updated);
    toast.success(`All marked as ${status}`);
  };

  // Save attendance
  const handleSave = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }
    if (students.length === 0) {
      toast.error('No students in this class');
      return;
    }

    setSaving(true);
    try {
      const records = students.map(s => ({
        student: s._id,
        status:  attendance[s._id] || 'absent',
      }));

      await api.post('/teacher/attendance', {
        classId: selectedClass,
        date:    selectedDate,
        records,
      });

      toast.success('Attendance saved successfully! ✅');
    } catch (err) {
      toast.error(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  // Count stats
  const stats = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent:  Object.values(attendance).filter(s => s === 'absent').length,
    late:    Object.values(attendance).filter(s => s === 'late').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Mark Attendance 📅</h1>
        <p className="page-subtitle">
          Take daily attendance for your classes.
        </p>
      </div>

      {/* Controls */}
      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Class Select */}
          <div>
            <label className="input-label">Select Class</label>
            <select
              className="select-field"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="">-- Choose Class --</option>
              {assignedClasses.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - Section {cls.section}
                </option>
              ))}
            </select>
          </div>

          {/* Date Select */}
          <div>
            <label className="input-label">Date</label>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      {selectedClass && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          className="space-y-4"
        >
          {/* Stats + Bulk Actions */}
          {students.length > 0 && (
            <div className="card p-4 flex flex-col sm:flex-row
                            items-start sm:items-center justify-between gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300">
                    Present: {stats.present}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300">
                    Absent: {stats.absent}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm font-semibold text-gray-700
                                   dark:text-gray-300">
                    Late: {stats.late}
                  </span>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Mark All:</span>
                <button
                  onClick={() => markAll('present')}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-700
                             rounded-lg text-xs font-semibold
                             hover:bg-emerald-200 transition-colors"
                >
                  ✅ Present
                </button>
                <button
                  onClick={() => markAll('absent')}
                  className="px-3 py-1.5 bg-red-100 text-red-700
                             rounded-lg text-xs font-semibold
                             hover:bg-red-200 transition-colors"
                >
                  ❌ Absent
                </button>
              </div>
            </div>
          )}

          {/* Student Cards */}
          {studentsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card p-4 flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-3 w-24" />
                  </div>
                  <div className="skeleton h-8 w-64 rounded-lg" />
                </div>
              ))}
            </div>
          ) : students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student, i) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1,  x: 0   }}
                  transition={{ delay: i * 0.04  }}
                  className={`card p-4 flex items-center gap-4
                              border-l-4 transition-all duration-200
                    ${attendance[student._id] === 'present'
                      ? 'border-l-emerald-500'
                      : attendance[student._id] === 'absent'
                      ? 'border-l-red-500'
                      : attendance[student._id] === 'late'
                      ? 'border-l-orange-500'
                      : 'border-l-gray-200 dark:border-l-gray-600'
                    }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br
                                  from-blue-500 to-cyan-600 flex items-center
                                  justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {getInitials(student.user?.name)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800
                                  dark:text-gray-200 truncate">
                      {student.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Roll: {student.rollNumber}
                    </p>
                  </div>

                  {/* Status Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {['present', 'absent', 'late'].map(status => (
                      <StatusBtn
                        key={status}
                        status={status}
                        current={attendance[student._id]}
                        onClick={() => setAttendance(prev => ({
                          ...prev,
                          [student._id]: status,
                        }))}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card empty-state py-16">
              <Users size={48} className="empty-state-icon" />
              <p className="empty-state-title">No students in this class</p>
              <p className="empty-state-subtitle">
                Ask admin to assign students to this class
              </p>
            </div>
          )}

          {/* Save Button */}
          {students.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary px-8"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30
                                    border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <> <Save size={18} /> Save Attendance </>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State - No class selected */}
      {!selectedClass && (
        <div className="card empty-state py-20">
          <Calendar size={56} className="empty-state-icon" />
          <p className="empty-state-title text-lg">Select a Class</p>
          <p className="empty-state-subtitle">
            Choose a class above to start marking attendance
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AttendancePage;