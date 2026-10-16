// frontend/src/components/admin/StudentsPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../../hooks/useDebounce';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TableSkeleton } from '../common/LoadingSkeleton';
import {
  getInitials, getRoleGradient,
  formatDate, getStatusColor,
} from '../../utils/helpers';
import {
  Search, Plus, Eye, Trash2,
  GraduationCap, X, ChevronLeft,
  ChevronRight, Filter, RefreshCw,
} from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';

// ── Add Student Modal ─────────────────────────────────────
const AddStudentModal = ({ onClose, onSuccess, classes }) => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Student account created! ✅');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Add New Student
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input
              className="input-field"
              placeholder="Enter student name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="student@school.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="input-label">Phone</label>
            <input
              className="input-field"
              placeholder="03001234567"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div>
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
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
              <>
                <div className="w-4 h-4 border-2 border-white/30
                                border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <> <Plus size={16} /> Add Student </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Student Detail Modal ──────────────────────────────────
const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

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
            Student Details
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4 p-4 bg-gray-50
                          dark:bg-gray-700/50 rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br
                            from-blue-500 to-cyan-600 flex items-center
                            justify-center flex-shrink-0">
              {student.user?.profilePhoto?.url ? (
                <img
                  src={student.user.profilePhoto.url}
                  className="w-full h-full rounded-2xl object-cover"
                  alt={student.user?.name}
                />
              ) : (
                <span className="text-white text-2xl font-black">
                  {getInitials(student.user?.name)}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                {student.user?.name}
              </h3>
              <p className="text-gray-500 text-sm">{student.user?.email}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Roll: {student.rollNumber}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Class',    value: `${student.class?.name || 'N/A'} - ${student.class?.section || ''}` },
              { label: 'Gender',   value: student.gender || 'N/A' },
              { label: 'Blood',    value: student.bloodGroup || 'N/A' },
              { label: 'DOB',      value: formatDate(student.dateOfBirth) },
              { label: 'Phone',    value: student.user?.phone || 'N/A' },
              { label: 'Admission',value: formatDate(student.admissionDate) },
            ].map(item => (
              <div key={item.label}
                className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="font-semibold text-sm text-gray-800
                              dark:text-gray-200 capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Fee Status */}
          <div className="flex items-center justify-between p-3
                          bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Fee Status
            </span>
            <span className={`badge capitalize
              ${getStatusColor(student.feeStatus)}`}>
              {student.feeStatus}
            </span>
          </div>

          {/* Parent Info */}
          {student.parentInfo?.fatherName && (
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">
                Parent Information
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                Father: {student.parentInfo.fatherName}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                Mother: {student.parentInfo.motherName}
              </p>
              <p className="text-sm text-gray-500">
                Contact: {student.parentInfo.parentContact}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Students Page ────────────────────────────────────
const StudentsPage = () => {
  const [search,         setSearch]         = useState('');
  const [page,           setPage]           = useState(1);
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [selectedStudent,setSelectedStudent]= useState(null);

  const debouncedSearch = useDebounce(search, 500);

  const url = `/admin/students?search=${debouncedSearch}&page=${page}&limit=10`;
  const { data, loading, error, refetch } = useFetch(url);

  const students   = data?.students   || [];
  const pagination = data?.pagination || {};

  // ── Delete Student ──────────────────────────────────────
  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Deactivate ${name}?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success(`${name} deactivated ✅`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start
                      sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Students 🎓</h1>
          <p className="page-subtitle">
            Manage all student accounts and information.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* ── Search Bar ─────────────────────── */}
      <div className="card p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── Students Table ──────────────────── */}
      {loading ? (
        <TableSkeleton rows={8} />
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          className="card overflow-hidden"
        >
          {/* Stats Bar */}
          <div className="px-6 py-4 border-b border-gray-100
                          dark:border-gray-700 flex items-center
                          justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {students.length}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {pagination.total || 0}
              </span>
              {' '}students
            </p>
            <button
              onClick={refetch}
              className="btn-icon"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Table */}
          {students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No</th>
                    <th>Class</th>
                    <th>Fee Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, i) => (
                    <motion.tr
                      key={student._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0   }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Student Info */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl
                                          bg-gradient-to-br from-blue-500
                                          to-cyan-600 flex items-center
                                          justify-center flex-shrink-0">
                            {student.user?.profilePhoto?.url ? (
                              <img
                                src={student.user.profilePhoto.url}
                                className="w-10 h-10 rounded-xl object-cover"
                                alt={student.user?.name}
                              />
                            ) : (
                              <span className="text-white text-sm font-bold">
                                {getInitials(student.user?.name)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-800
                                          dark:text-gray-200 truncate">
                              {student.user?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td>
                        <span className="badge-gray">
                          {student.rollNumber}
                        </span>
                      </td>

                      {/* Class */}
                      <td>
                        <span className="text-sm text-gray-600
                                         dark:text-gray-400">
                          {student.class
                            ? `${student.class.name} - ${student.class.section}`
                            : 'Not Assigned'}
                        </span>
                      </td>

                      {/* Fee Status */}
                      <td>
                        <span className={`badge capitalize
                          ${getStatusColor(student.feeStatus)}`}>
                          {student.feeStatus || 'pending'}
                        </span>
                      </td>

                      {/* Joined */}
                      <td>
                        <span className="text-sm text-gray-500">
                          {formatDate(student.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="btn-icon text-blue-500
                                       hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(
                              student.user?._id,
                              student.user?.name
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
              <GraduationCap size={48} className="empty-state-icon" />
              <p className="empty-state-title">No students found</p>
              <p className="empty-state-subtitle">
                {search ? 'Try a different search term' : 'Add your first student'}
              </p>
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
                <span className="text-sm font-semibold text-gray-800
                                 dark:text-gray-200 px-2">
                  {pagination.currentPage}
                </span>
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
        </motion.div>
      )}

      {/* ── Modals ─────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <AddStudentModal
            onClose={() => setShowAddModal(false)}
            onSuccess={refetch}
            classes={[]}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStudent && (
          <StudentDetailModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StudentsPage;