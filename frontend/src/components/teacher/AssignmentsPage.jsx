// frontend/src/components/teacher/AssignmentsPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import {
  ClipboardList, Plus, X, Eye,
  CheckCircle, RefreshCw, Users,
  Calendar, BookOpen,
} from 'lucide-react';

// ── Create Assignment Modal ───────────────────────────────
const CreateAssignmentModal = ({ onClose, onSuccess, classes, subjects }) => {
  const [form, setForm] = useState({
    title:       '',
    description: '',
    classId:     '',
    subjectId:   '',
    dueDate:     '',
    totalMarks:  100,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.classId || !form.subjectId || !form.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/teacher/assignments', form);
      toast.success('Assignment created! 📝');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1    }}
        exit={{    opacity: 0, scale: 0.95 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Create Assignment
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          {/* Title */}
          <div>
            <label className="input-label">Title *</label>
            <input
              className="input-field"
              placeholder="e.g., Chapter 5 Exercise"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Assignment instructions..."
              value={form.description}
              onChange={e => setForm(p => ({
                ...p, description: e.target.value
              }))}
            />
          </div>

          {/* Class + Subject */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Class *</label>
              <select
                className="select-field"
                value={form.classId}
                onChange={e => setForm(p => ({ ...p, classId: e.target.value }))}
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Subject *</label>
              <select
                className="select-field"
                value={form.subjectId}
                onChange={e => setForm(p => ({
                  ...p, subjectId: e.target.value
                }))}
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(sub => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date + Marks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Due Date *</label>
              <input
                type="date"
                className="input-field"
                value={form.dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(p => ({
                  ...p, dueDate: e.target.value
                }))}
                required
              />
            </div>

            <div>
              <label className="input-label">Total Marks</label>
              <input
                type="number"
                className="input-field"
                value={form.totalMarks}
                min={1}
                max={200}
                onChange={e => setForm(p => ({
                  ...p, totalMarks: Number(e.target.value)
                }))}
              />
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <> <Plus size={16} /> Create </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Grade Modal ───────────────────────────────────────────
const GradeModal = ({ assignment, onClose, onSuccess }) => {
  const [grades,  setGrades]  = useState({});
  const [loading, setLoading] = useState(false);

  const handleGrade = async (studentId, grade, feedback) => {
    setLoading(true);
    try {
      await api.post('/teacher/assignments/grade', {
        assignmentId: assignment._id,
        studentId,
        grade:        Number(grade),
        feedback,
      });
      toast.success('Graded successfully! 🎯');
      onSuccess();
    } catch (err) {
      toast.error(err.message || 'Failed to grade');
    } finally {
      setLoading(false);
    }
  };

  const submissions = assignment?.submissions || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1    }}
        exit={{    opacity: 0, scale: 0.95 }}
        className="modal-content max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {assignment?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {submissions.length} submission(s)
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-4 max-h-96 overflow-y-auto">
          {submissions.length > 0 ? (
            submissions.map((sub, i) => (
              <div key={sub._id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50
                           rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-gray-800
                                  dark:text-gray-200">
                      {sub.student?.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted: {formatDate(sub.submittedAt)}
                      {sub.status === 'late' && (
                        <span className="ml-2 text-orange-500 font-semibold">
                          (Late)
                        </span>
                      )}
                    </p>
                  </div>
                  {sub.status === 'graded' && (
                    <span className="badge-success">
                      Graded: {sub.grade}/{assignment?.totalMarks}
                    </span>
                  )}
                </div>

                {sub.fileUrl && (
                  <a
                    href={sub.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 text-sm hover:underline
                               flex items-center gap-1"
                  >
                    📎 View Submission
                  </a>
                )}

                {sub.status !== 'graded' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder={`Grade (/${assignment?.totalMarks})`}
                      min={0}
                      max={assignment?.totalMarks}
                      className="input-field flex-1"
                      value={grades[sub.student?._id]?.grade || ''}
                      onChange={e => setGrades(prev => ({
                        ...prev,
                        [sub.student?._id]: {
                          ...prev[sub.student?._id],
                          grade: e.target.value,
                        }
                      }))}
                    />
                    <input
                      placeholder="Feedback (optional)"
                      className="input-field flex-1"
                      value={grades[sub.student?._id]?.feedback || ''}
                      onChange={e => setGrades(prev => ({
                        ...prev,
                        [sub.student?._id]: {
                          ...prev[sub.student?._id],
                          feedback: e.target.value,
                        }
                      }))}
                    />
                    <button
                      onClick={() => handleGrade(
                        sub.student?._id,
                        grades[sub.student?._id]?.grade || 0,
                        grades[sub.student?._id]?.feedback || ''
                      )}
                      disabled={loading}
                      className="btn-success flex-shrink-0"
                    >
                      <CheckCircle size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state py-8">
              <Users size={36} className="empty-state-icon" />
              <p className="empty-state-title text-sm">No submissions yet</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Assignments Page ─────────────────────────────────
const AssignmentsPage = () => {
  const [showModal,    setShowModal]    = useState(false);
  const [gradeModal,   setGradeModal]   = useState(null);

  const { data: dashData } = useFetch('/teacher/dashboard');
  const { data,    loading, error, refetch } = useFetch('/teacher/assignments');

  const assignments     = data?.assignments     || [];
  const assignedClasses = dashData?.teacher?.assignedClasses  || [];
  const assignedSubjects= dashData?.teacher?.assignedSubjects || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Assignments 📝</h1>
          <p className="page-subtitle">
            Create and manage assignments for your classes.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Create Assignment
        </button>
      </div>

      {/* Assignments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-1/2" />
              <div className="flex gap-2">
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : assignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment, i) => {
            const isOverdue    = new Date() > new Date(assignment.dueDate);
            const submissionsCount = assignment.submissions?.length || 0;
            const gradedCount  = assignment.submissions?.filter(
              s => s.status === 'graded'
            ).length || 0;

            return (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: i * 0.06 }}
                className="card p-5 flex flex-col gap-4"
              >
                {/* Assignment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200
                                   text-sm leading-snug">
                      {assignment.title}
                    </h3>
                    {assignment.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                  </div>
                  <span className={`badge flex-shrink-0 ${
                    isOverdue
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {isOverdue ? '⏰ Overdue' : '✅ Active'}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-xs
                                  text-gray-500 dark:text-gray-400">
                    <BookOpen size={13} />
                    <span>{assignment.subject?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs
                                  text-gray-500 dark:text-gray-400">
                    <Users size={13} />
                    <span>
                      {assignment.class?.name} - {assignment.class?.section}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs
                                  text-gray-500 dark:text-gray-400">
                    <Calendar size={13} />
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Marks: {assignment.totalMarks}
                  </div>
                </div>

                {/* Submissions */}
                <div className="flex items-center justify-between
                                pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="badge-primary">
                      {submissionsCount} submitted
                    </span>
                    {gradedCount > 0 && (
                      <span className="badge-success">
                        {gradedCount} graded
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setGradeModal(assignment)}
                    className="btn-ghost text-xs px-3 py-1.5"
                  >
                    <Eye size={14} /> View Submissions
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <ClipboardList size={56} className="empty-state-icon" />
          <p className="empty-state-title">No assignments yet</p>
          <p className="empty-state-subtitle">
            Create your first assignment above
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            <Plus size={16} /> Create Assignment
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <CreateAssignmentModal
            onClose={()  => setShowModal(false)}
            onSuccess={refetch}
            classes={assignedClasses}
            subjects={assignedSubjects}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gradeModal && (
          <GradeModal
            assignment={gradeModal}
            onClose={()  => setGradeModal(null)}
            onSuccess={() => { refetch(); setGradeModal(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AssignmentsPage;