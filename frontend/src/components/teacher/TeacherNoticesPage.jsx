// frontend/src/components/teacher/TeacherNoticesPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { Bell, Plus, X, RefreshCw } from 'lucide-react';

// ── Post Notice Modal ─────────────────────────────────────
const PostNoticeModal = ({ onClose, onSuccess, classes }) => {
  const [form, setForm] = useState({
    title:       '',
    content:     '',
    targetClass: '',
    priority:    'medium',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/teacher/notices', form);
      toast.success('Notice submitted for approval! 📢');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to post notice');
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
          <h2 className="text-lg font-bold text-gray-800
                         dark:text-gray-200">
            Post Notice
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          <div>
            <label className="input-label">Title *</label>
            <input
              className="input-field"
              placeholder="Notice title"
              value={form.title}
              onChange={e => setForm(p => ({
                ...p, title: e.target.value
              }))}
              required
            />
          </div>

          <div>
            <label className="input-label">Content *</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Write your notice here..."
              value={form.content}
              onChange={e => setForm(p => ({
                ...p, content: e.target.value
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Target Class</label>
              <select
                className="select-field"
                value={form.targetClass}
                onChange={e => setForm(p => ({
                  ...p, targetClass: e.target.value
                }))}
              >
                <option value="">All Students</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Priority</label>
              <select
                className="select-field"
                value={form.priority}
                onChange={e => setForm(p => ({
                  ...p, priority: e.target.value
                }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20
                          border border-yellow-200 dark:border-yellow-800
                          rounded-xl text-xs text-yellow-700
                          dark:text-yellow-300">
            ℹ️ Your notice will be reviewed by admin before publishing.
          </div>
        </form>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <> <Bell size={16} /> Post Notice </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Teacher Notices Page ─────────────────────────────
const TeacherNoticesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: noticeData, loading, error, refetch } =
    useFetch('/teacher/notices');
  const { data: dashData } = useFetch('/teacher/dashboard');

  const notices = noticeData?.notices || [];
  const classes = dashData?.teacher?.assignedClasses || [];

  const priorityConfig = {
    urgent: {
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      dot:   'bg-red-500',
      icon:  '🚨',
    },
    high: {
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      dot:   'bg-orange-500',
      icon:  '🔴',
    },
    medium: {
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      dot:   'bg-blue-500',
      icon:  '🔵',
    },
    low: {
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      dot:   'bg-gray-400',
      icon:  '⚪',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notices 📢</h1>
          <p className="page-subtitle">
            Post and view notices for your classes.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Post Notice
        </button>
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-2/3" />
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
      ) : notices.length > 0 ? (
        <div className="space-y-4">
          {notices.map((notice, i) => {
            const config = priorityConfig[notice.priority]
              || priorityConfig.low;

            return (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: i * 0.06 }}
                className="card p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Priority dot */}
                  <div className={`w-3 h-3 rounded-full mt-1.5
                                   flex-shrink-0 ${config.dot}`} />

                  <div className="flex-1 min-w-0">
                    {/* Title + badges */}
                    <div className="flex items-start
                                    justify-between gap-3 mb-2">
                      <h3 className="font-bold text-gray-800
                                     dark:text-gray-200 text-sm">
                        {notice.title}
                      </h3>
                      <div className="flex items-center gap-2
                                      flex-shrink-0">
                        <span className={`badge ${config.badge}`}>
                          {config.icon} {notice.priority}
                        </span>
                        <span className={`badge ${
                          notice.isApproved
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {notice.isApproved
                            ? '✅ Approved'
                            : '⏳ Pending'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm text-gray-600
                                  dark:text-gray-400 mb-3
                                  leading-relaxed">
                      {notice.content}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3
                                    text-xs text-gray-400">
                      <span>
                        By {notice.postedBy?.name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(notice.createdAt)}</span>
                      {notice.targetClass && (
                        <>
                          <span>•</span>
                          <span className="badge-gray">
                            {notice.targetClass.name}-
                            {notice.targetClass.section}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <Bell size={56} className="empty-state-icon" />
          <p className="empty-state-title">No notices yet</p>
          <p className="empty-state-subtitle">
            Post your first notice
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            <Plus size={16} /> Post Notice
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <PostNoticeModal
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
            classes={classes}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeacherNoticesPage;