// frontend/src/components/student/AssignmentsPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import {
  ClipboardList, Upload, X,
  CheckCircle, Clock, AlertCircle,
  RefreshCw, BookOpen,
} from 'lucide-react';

// ── Submit Modal ──────────────────────────────────────────
const SubmitModal = ({ assignment, onClose, onSuccess }) => {
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);

      await api.post(
        `/student/assignments/${assignment._id}/submit`,
        file ? formData : {},
        file ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
      );

      toast.success('Assignment submitted! 🎉');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const isLate = new Date() > new Date(assignment?.dueDate);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1    }}
        exit={{    opacity: 0, scale: 0.95 }}
        className="modal-content max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Submit Assignment
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          {/* Assignment Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-2">
            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              {assignment?.title}
            </p>
            <p className="text-xs text-gray-500">
              Subject: {assignment?.subject?.name}
            </p>
            <p className="text-xs text-gray-500">
              Total Marks: {assignment?.totalMarks}
            </p>
            <p className={`text-xs font-semibold ${
              isLate ? 'text-red-500' : 'text-emerald-500'
            }`}>
              Due: {formatDate(assignment?.dueDate)}
              {isLate && ' (⚠️ Late Submission)'}
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="input-label">
              Upload File (Optional)
            </label>
            <div className="mt-1 border-2 border-dashed border-gray-200
                            dark:border-gray-600 rounded-xl p-6 text-center
                            hover:border-primary-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={e => setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="space-y-1">
                    <CheckCircle
                      size={32}
                      className="mx-auto text-emerald-500"
                    />
                    <p className="text-sm font-medium text-gray-700
                                  dark:text-gray-300">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload
                      size={32}
                      className="mx-auto text-gray-400"
                    />
                    <p className="text-sm text-gray-500">
                      Click to upload file
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, DOC, DOCX, JPG, PNG (max 20MB)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {isLate && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20
                            border border-orange-200 dark:border-orange-800
                            rounded-xl">
              <p className="text-xs text-orange-700 dark:text-orange-400">
                ⚠️ You are submitting after the deadline.
                This will be marked as a late submission.
              </p>
            </div>
          )}
        </div>

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
              <> <Upload size={16} /> Submit </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Assignments Page ─────────────────────────────────
const StudentAssignmentsPage = () => {
  const [submitModal, setSubmitModal] = useState(null);
  const [filter,      setFilter]      = useState('all');

  const { data, loading, error, refetch } = useFetch('/student/assignments');
  const assignments = data?.assignments || [];

  // Filter assignments
  const filtered = assignments.filter(a => {
    if (filter === 'pending')   return !a.isSubmitted && !a.isOverdue;
    if (filter === 'submitted') return a.isSubmitted;
    if (filter === 'overdue')   return a.isOverdue;
    return true;
  });

  const counts = {
    all:       assignments.length,
    pending:   assignments.filter(a => !a.isSubmitted && !a.isOverdue).length,
    submitted: assignments.filter(a => a.isSubmitted).length,
    overdue:   assignments.filter(a => a.isOverdue).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">My Assignments 📝</h1>
        <p className="page-subtitle">
          View and submit your assignments.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: 'all',       label: `All (${counts.all})`             },
          { key: 'pending',   label: `Pending (${counts.pending})`     },
          { key: 'submitted', label: `Submitted (${counts.submitted})` },
          { key: 'overdue',   label: `Overdue (${counts.overdue})`     },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold
                        transition-all duration-200
              ${filter === tab.key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignments */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-8 w-full rounded-xl" />
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
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((assignment, i) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.06 }}
              className={`card p-5 flex flex-col gap-4 border-l-4
                ${assignment.isSubmitted
                  ? 'border-l-emerald-500'
                  : assignment.isOverdue
                  ? 'border-l-red-500'
                  : 'border-l-primary-500'
                }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200
                                 text-sm">{assignment.title}</h3>
                  {assignment.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                {assignment.isSubmitted ? (
                  <span className="badge-success flex-shrink-0">
                    ✅ Submitted
                  </span>
                ) : assignment.isOverdue ? (
                  <span className="badge-danger flex-shrink-0">
                    ❌ Overdue
                  </span>
                ) : (
                  <span className="badge-primary flex-shrink-0">
                    📋 Pending
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 text-xs
                              text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {assignment.subject?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Due: {formatDate(assignment.dueDate)}
                </span>
                <span>Marks: {assignment.totalMarks}</span>
              </div>

              {/* Grade if submitted */}
              {assignment.mySubmission?.grade !== null &&
               assignment.mySubmission?.grade !== undefined && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20
                                rounded-xl">
                  <p className="text-sm font-bold text-emerald-700
                                dark:text-emerald-400">
                    Grade: {assignment.mySubmission.grade}/{assignment.totalMarks}
                  </p>
                  {assignment.mySubmission.feedback && (
                    <p className="text-xs text-emerald-600
                                  dark:text-emerald-300 mt-1">
                      Feedback: {assignment.mySubmission.feedback}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              {!assignment.isSubmitted && (
                <button
                  onClick={() => setSubmitModal(assignment)}
                  className={`btn w-full justify-center text-sm
                    ${assignment.isOverdue
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'btn-primary'
                    }`}
                >
                  <Upload size={15} />
                  {assignment.isOverdue
                    ? 'Submit (Late)'
                    : 'Submit Assignment'
                  }
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <ClipboardList size={56} className="empty-state-icon" />
          <p className="empty-state-title">No assignments found</p>
          <p className="empty-state-subtitle">
            {filter === 'all'
              ? 'No assignments assigned yet'
              : `No ${filter} assignments`
            }
          </p>
        </div>
      )}

      <AnimatePresence>
        {submitModal && (
          <SubmitModal
            assignment={submitModal}
            onClose={() => setSubmitModal(null)}
            onSuccess={() => { refetch(); setSubmitModal(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentAssignmentsPage;