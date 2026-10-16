// frontend/src/components/admin/NoticesPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, getStatusColor } from '../../utils/helpers';
import {
  Bell, Plus, Trash2, CheckCircle,
  X, RefreshCw, AlertCircle,
} from 'lucide-react';

// ── Add Notice Modal ──────────────────────────────────────
const AddNoticeModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title:          '',
    content:        '',
    targetAudience: 'all',
    priority:       'medium',
    expiryDate:     '',
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
      await api.post('/admin/notices', form);
      toast.success('Notice posted! 📢');
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
        className="modal-content max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Post New Notice
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
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="input-label">Content *</label>
            <textarea
              className="input-field resize-none"
              rows={4}
              placeholder="Write notice content here..."
              value={form.content}
              onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Target Audience</label>
              <select
                className="select-field"
                value={form.targetAudience}
                onChange={e => setForm(p => ({
                  ...p, targetAudience: e.target.value
                }))}
              >
                <option value="all">Everyone</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
                <option value="parents">Parents Only</option>
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

          <div>
            <label className="input-label">Expiry Date (Optional)</label>
            <input
              type="date"
              className="input-field"
              value={form.expiryDate}
              onChange={e => setForm(p => ({
                ...p, expiryDate: e.target.value
              }))}
            />
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
              <> <Bell size={16} /> Post Notice </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Priority Badge ────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const styles = {
    urgent: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    high:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    low:    'bg-gray-100   text-gray-700   dark:bg-gray-700      dark:text-gray-400',
  };
  const icons = {
    urgent: '🚨', high: '🔴', medium: '🔵', low: '⚪',
  };
  return (
    <span className={`badge capitalize ${styles[priority] || styles.low}`}>
      {icons[priority]} {priority}
    </span>
  );
};

// ── Main Notices Page ─────────────────────────────────────
const NoticesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data, loading, error, refetch } = useFetch('/admin/notices');

  const notices = data?.notices || [];

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete notice "${title}"?`)) return;
    try {
      await api.delete(`/admin/notices/${id}`);
      toast.success('Notice deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/notices/${id}/approve`);
      toast.success('Notice approved! ✅');
      refetch();
    } catch (err) {
      toast.error('Failed to approve');
    }
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
          <h1 className="page-title">Notice Board 📢</h1>
          <p className="page-subtitle">
            Manage and post school announcements.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Post Notice
        </button>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-2/3" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((notice, i) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.06 }}
              className="card p-5 flex flex-col gap-3"
            >
              {/* Notice Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 dark:text-gray-200
                                 text-sm leading-snug">
                    {notice.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    By {notice.postedBy?.name} · {formatDate(notice.createdAt)}
                  </p>
                </div>
                <PriorityBadge priority={notice.priority} />
              </div>

              {/* Content */}
              <p className="text-sm text-gray-600 dark:text-gray-400
                            leading-relaxed line-clamp-2">
                {notice.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between
                              pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className={`badge ${
                    notice.isApproved
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {notice.isApproved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                  <span className="badge-gray capitalize">
                    {notice.targetAudience}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {!notice.isApproved && (
                    <button
                      onClick={() => handleApprove(notice._id)}
                      className="btn-icon text-emerald-500
                                 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      title="Approve"
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notice._id, notice.title)}
                    className="btn-icon text-red-500
                               hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <Bell size={48} className="empty-state-icon" />
          <p className="empty-state-title">No notices yet</p>
          <p className="empty-state-subtitle">Post your first notice</p>
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
          <AddNoticeModal
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoticesPage;