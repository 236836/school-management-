// frontend/src/components/admin/ClassesPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  BookOpen, Plus, X, Users,
  UserCheck, Trash2, RefreshCw,
  ChevronDown, ChevronUp,
} from 'lucide-react';

// ── Create Class Modal ────────────────────────────────────
const CreateClassModal = ({ onClose, onSuccess, teachers }) => {
  const [form, setForm] = useState({
    name:        '',
    section:     '',
    academicYear:'2024-2025',
    room:        '',
    maxStrength: 40,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.section) {
      toast.error('Class name and section are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/classes', form);
      toast.success(`Class ${form.name}-${form.section} created! 📚`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create class');
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
            Create New Class
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Class Name *</label>
              <input
                className="input-field"
                placeholder="e.g., Grade 10"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="input-label">Section *</label>
              <input
                className="input-field"
                placeholder="e.g., A"
                value={form.section}
                onChange={e => setForm(p => ({
                  ...p, section: e.target.value.toUpperCase()
                }))}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Room</label>
              <input
                className="input-field"
                placeholder="e.g., Room 101"
                value={form.room}
                onChange={e => setForm(p => ({ ...p, room: e.target.value }))}
              />
            </div>
            <div>
              <label className="input-label">Max Students</label>
              <input
                type="number"
                className="input-field"
                value={form.maxStrength}
                min={1}
                max={100}
                onChange={e => setForm(p => ({
                  ...p, maxStrength: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Academic Year</label>
            <select
              className="select-field"
              value={form.academicYear}
              onChange={e => setForm(p => ({
                ...p, academicYear: e.target.value
              }))}
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2023-2024">2023-2024</option>
            </select>
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
              <> <Plus size={16} /> Create Class </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Assign Teacher Modal ──────────────────────────────────
const AssignTeacherModal = ({ classData, teachers, onClose, onSuccess }) => {
  const [teacherId, setTeacherId] = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleAssign = async () => {
    if (!teacherId) {
      toast.error('Please select a teacher');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/classes/assign-teacher', {
        classId: classData._id,
        teacherId,
      });
      toast.success('Teacher assigned! ✅');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to assign');
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
        className="modal-content max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Assign Class Teacher
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm font-semibold text-gray-700
                          dark:text-gray-300">
              Class: {classData.name} - Section {classData.section}
            </p>
          </div>

          <div>
            <label className="input-label">Select Teacher</label>
            <select
              className="select-field"
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
            >
              <option value="">-- Choose Teacher --</option>
              {teachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.user?.name} ({t.specialization || 'General'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleAssign}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <> <UserCheck size={16} /> Assign </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Class Card ────────────────────────────────────────────
const ClassCard = ({ cls, teachers, onRefresh, index }) => {
  const [expanded,       setExpanded]       = useState(false);
  const [showAssignModal,setShowAssignModal] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(
      `Delete class ${cls.name} - ${cls.section}? This cannot be undone!`
    )) return;
    try {
      await api.delete(`/admin/classes/${cls._id}`);
      toast.success('Class deleted');
      onRefresh();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: index * 0.06 }}
        className="card overflow-hidden"
      >
        {/* Card Header */}
        <div className={`bg-gradient-to-r ${gradient} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-black text-lg">
                {cls.name}
              </h3>
              <p className="text-white/80 text-sm">
                Section {cls.section}
              </p>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 bg-white/20 rounded-xl
                              flex items-center justify-center">
                <BookOpen className="text-white" size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50
                            rounded-xl">
              <p className="text-xl font-black text-gray-800
                            dark:text-gray-200">
                {cls.students?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Students</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50
                            rounded-xl">
              <p className="text-xl font-black text-gray-800
                            dark:text-gray-200">
                {cls.subjects?.length || 0}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Subjects</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50
                            rounded-xl">
              <p className="text-xl font-black text-gray-800
                            dark:text-gray-200">
                {cls.maxStrength || 40}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Capacity</p>
            </div>
          </div>

          {/* Class Teacher */}
          <div className="flex items-center justify-between p-3
                          bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Class Teacher</p>
              <p className="text-sm font-semibold text-gray-800
                            dark:text-gray-200 mt-0.5">
                {cls.classTeacher?.user?.name || 'Not Assigned'}
              </p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="btn-ghost text-xs px-3 py-1.5"
            >
              <UserCheck size={14} />
              {cls.classTeacher ? 'Change' : 'Assign'}
            </button>
          </div>

          {/* Room + Year */}
          <div className="flex items-center gap-3 text-xs
                          text-gray-500 dark:text-gray-400">
            {cls.room && (
              <span className="badge-gray">📍 {cls.room}</span>
            )}
            <span className="badge-gray">📅 {cls.academicYear}</span>
          </div>

          {/* Subjects (Expandable) */}
          {cls.subjects?.length > 0 && (
            <div>
              <button
                onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-2 text-xs text-primary-600
                           font-semibold hover:text-primary-700"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {expanded ? 'Hide' : 'Show'} Subjects ({cls.subjects.length})
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{    height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {cls.subjects.map(sub => (
                        <span key={sub._id} className="badge-primary text-xs">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-2
                          border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleDelete}
              className="btn-icon text-red-500
                         hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete Class"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAssignModal && (
          <AssignTeacherModal
            classData={cls}
            teachers={teachers}
            onClose={() => setShowAssignModal(false)}
            onSuccess={onRefresh}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ── Main Classes Page ─────────────────────────────────────
const ClassesPage = () => {
  const [showModal, setShowModal] = useState(false);

  const { data: classData,   loading, error, refetch } = useFetch('/admin/classes');
  const { data: teacherData }                          = useFetch('/admin/teachers');

  const classes  = classData?.classes   || [];
  const teachers = teacherData?.teachers || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Classes 🏫</h1>
          <p className="page-subtitle">
            Manage classes, sections and teacher assignments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={18} /> Create Class
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Classes',
            value: classes.length,
            color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
          },
          {
            label: 'Total Students',
            value: classes.reduce((a, c) => a + (c.students?.length || 0), 0),
            color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
          },
          {
            label: 'Total Subjects',
            value: classes.reduce((a, c) => a + (c.subjects?.length || 0), 0),
            color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600',
          },
          {
            label: 'Unassigned',
            value: classes.filter(c => !c.classTeacher).length,
            color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.08 }}
            className="card p-4"
          >
            <p className={`text-2xl font-black ${s.color.split(' ').pop()}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-28 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-16 w-full rounded-xl" />
                <div className="skeleton h-10 w-full rounded-xl" />
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
      ) : classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls, i) => (
            <ClassCard
              key={cls._id}
              cls={cls}
              teachers={teachers}
              onRefresh={refetch}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <BookOpen size={56} className="empty-state-icon" />
          <p className="empty-state-title">No classes yet</p>
          <p className="empty-state-subtitle">Create your first class</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-4"
          >
            <Plus size={16} /> Create Class
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <CreateClassModal
            onClose={() => setShowModal(false)}
            onSuccess={refetch}
            teachers={teachers}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClassesPage;