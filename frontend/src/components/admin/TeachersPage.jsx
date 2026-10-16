// frontend/src/components/admin/TeachersPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../common/LoadingSkeleton';
import { getInitials, formatDate } from '../../utils/helpers';
import {
  Search, Plus, CheckCircle, X,
  UserCheck, Trash2, Eye,
  ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react';

// ── Add Teacher Modal ─────────────────────────────────────
const AddTeacherModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', role: 'teacher',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Teacher account created! ✅');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create teacher');
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
            Add New Teacher
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          {[
            { label: 'Full Name',  name: 'name',     type: 'text',     placeholder: 'Mr. Ahmed Khan'      },
            { label: 'Email',      name: 'email',    type: 'email',    placeholder: 'teacher@school.com'  },
            { label: 'Phone',      name: 'phone',    type: 'tel',      placeholder: '03001234567'         },
            { label: 'Password',   name: 'password', type: 'password', placeholder: 'Minimum 6 characters'},
          ].map(field => (
            <div key={field.name}>
              <label className="input-label">{field.label}</label>
              <input
                type={field.type}
                className="input-field"
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={e => setForm(p => ({ ...p, [field.name]: e.target.value }))}
                required={field.name !== 'phone'}
              />
            </div>
          ))}
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
              <> <Plus size={16} /> Add Teacher </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Teachers Page ────────────────────────────────────
const TeachersPage = () => {
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const [showModal,    setShowModal]    = useState(false);
  const [filterApproved, setFilterApproved] = useState('all');

  const approvedParam = filterApproved === 'all' ? '' : `&approved=${filterApproved}`;
  const url = `/admin/teachers?search=${search}&page=${page}&limit=10${approvedParam}`;
  const { data, loading, error, refetch } = useFetch(url);

  const teachers   = data?.teachers   || [];
  const pagination = data?.pagination || {};

  const handleApprove = async (teacherId, name) => {
    try {
      await api.put(`/admin/teachers/${teacherId}/approve`);
      toast.success(`${name} approved! ✅`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to approve');
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Deactivate ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success(`${name} deactivated`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start
                      sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Teachers 👨‍🏫</h1>
          <p className="page-subtitle">Manage all teacher accounts.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filterApproved}
          onChange={e => setFilterApproved(e.target.value)}
          className="select-field sm:w-48"
        >
          <option value="all">All Teachers</option>
          <option value="true">Approved</option>
          <option value="false">Pending Approval</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100
                          dark:border-gray-700">
            <p className="text-sm text-gray-500">
              Total:{' '}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {pagination.total || 0}
              </span>
              {' '}teachers
            </p>
          </div>

          {teachers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Employee ID</th>
                    <th>Specialization</th>
                    <th>Classes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher, i) => (
                    <motion.tr
                      key={teacher._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Teacher Info */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl
                                          bg-gradient-to-br from-emerald-500
                                          to-teal-600 flex items-center
                                          justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">
                              {getInitials(teacher.user?.name)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-800
                                          dark:text-gray-200">
                              {teacher.user?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {teacher.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge-gray">
                          {teacher.employeeId || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <span className="text-sm text-gray-600
                                         dark:text-gray-400">
                          {teacher.specialization || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <span className="badge-primary">
                          {teacher.assignedClasses?.length || 0} classes
                        </span>
                      </td>

                      <td>
                        <span className={`badge ${
                          teacher.isApproved
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {teacher.isApproved ? '✅ Approved' : '⏳ Pending'}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-1">
                          {!teacher.isApproved && (
                            <button
                              onClick={() => handleApprove(
                                teacher._id,
                                teacher.user?.name
                              )}
                              className="btn-icon text-emerald-500
                                         hover:bg-emerald-50
                                         dark:hover:bg-emerald-900/20"
                              title="Approve Teacher"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(
                              teacher.user?._id,
                              teacher.user?.name
                            )}
                            className="btn-icon text-red-500
                                       hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Deactivate"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state py-16">
              <UserCheck size={48} className="empty-state-icon" />
              <p className="empty-state-title">No teachers found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100
                            dark:border-gray-700 flex items-center
                            justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="btn-icon disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-icon disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <AddTeacherModal
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeachersPage;