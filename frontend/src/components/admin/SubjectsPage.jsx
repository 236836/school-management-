// frontend/src/components/admin/SubjectsPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  BookOpen, Plus, X, Trash2,
  RefreshCw, Edit2, Save,
  GraduationCap, UserCheck,
} from 'lucide-react';

// ── Create Subject Modal ──────────────────────────────────
const SubjectModal = ({
  onClose,
  onSuccess,
  classes,
  teachers,
  editData = null,
}) => {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name:         editData?.name         || '',
    code:         editData?.code         || '',
    description:  editData?.description  || '',
    classId:      editData?.class?._id   || '',
    teacherId:    editData?.teacher?._id || '',
    totalMarks:   editData?.totalMarks   || 100,
    passingMarks: editData?.passingMarks || 33,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.code) {
      toast.error('Subject name and code are required');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/admin/subjects/${editData._id}`, form);
        toast.success(`Subject "${form.name}" updated! ✅`);
      } else {
        await api.post('/admin/subjects', form);
        toast.success(`Subject "${form.name}" created! 📖`);
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
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
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br
                            from-primary-500 to-indigo-600
                            flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800
                           dark:text-gray-200">
              {isEdit ? 'Edit Subject' : 'Create New Subject'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-body space-y-4">

          {/* Name + Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">
                Subject Name *
              </label>
              <input
                className="input-field"
                placeholder="e.g., Mathematics"
                value={form.name}
                onChange={e => setForm(p => ({
                  ...p, name: e.target.value
                }))}
                required
              />
            </div>
            <div>
              <label className="input-label">
                Subject Code *
              </label>
              <input
                className="input-field"
                placeholder="e.g., MATH10"
                value={form.code}
                onChange={e => setForm(p => ({
                  ...p,
                  code: e.target.value.toUpperCase()
                }))}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Must be unique (e.g., MATH10A)
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="input-label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Brief description of this subject..."
              value={form.description}
              onChange={e => setForm(p => ({
                ...p, description: e.target.value
              }))}
            />
          </div>

          {/* Class + Teacher */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">
                Assign to Class
              </label>
              <select
                className="select-field"
                value={form.classId}
                onChange={e => setForm(p => ({
                  ...p, classId: e.target.value
                }))}
              >
                <option value="">-- Select Class --</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="input-label">
                Assign Teacher
              </label>
              <select
                className="select-field"
                value={form.teacherId}
                onChange={e => setForm(p => ({
                  ...p, teacherId: e.target.value
                }))}
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.user?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Total Marks</label>
              <input
                type="number"
                className="input-field"
                value={form.totalMarks}
                min={1}
                max={500}
                onChange={e => setForm(p => ({
                  ...p,
                  totalMarks: Number(e.target.value)
                }))}
              />
            </div>
            <div>
              <label className="input-label">Passing Marks</label>
              <input
                type="number"
                className="input-field"
                value={form.passingMarks}
                min={1}
                onChange={e => setForm(p => ({
                  ...p,
                  passingMarks: Number(e.target.value)
                }))}
              />
            </div>
          </div>

          {/* Pass percentage indicator */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20
                          rounded-xl text-xs text-blue-700
                          dark:text-blue-300">
            📊 Pass percentage:{' '}
            <strong>
              {form.totalMarks > 0
                ? Math.round((form.passingMarks / form.totalMarks) * 100)
                : 0
              }%
            </strong>
          </div>
        </form>

        {/* Footer */}
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
                              border-t-white rounded-full
                              animate-spin" />
            ) : isEdit ? (
              <> <Save size={16} /> Update Subject </>
            ) : (
              <> <Plus size={16} /> Create Subject </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Subject Card ──────────────────────────────────────────
const SubjectCard = ({ subject, onEdit, onDelete, index }) => {
  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-green-600',
  ];

  const gradient = gradients[index % gradients.length];
  const passPercent = subject.totalMarks > 0
    ? Math.round((subject.passingMarks / subject.totalMarks) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="card overflow-hidden cursor-default"
    >
      {/* Colored Top Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* Subject Name */}
            <h3 className="font-black text-gray-800
                           dark:text-gray-200 text-base truncate">
              {subject.name}
            </h3>

            {/* Subject Code Badge */}
            <span className="inline-block mt-1 px-2.5 py-0.5
                             bg-primary-100 dark:bg-primary-900/30
                             text-primary-700 dark:text-primary-400
                             text-xs font-mono font-bold rounded-lg">
              {subject.code}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(subject)}
              className="btn-icon text-blue-500
                         hover:bg-blue-50
                         dark:hover:bg-blue-900/20"
              title="Edit Subject"
            >
              <Edit2 size={15} />
            </button>
            <button
              onClick={() => onDelete(subject._id, subject.name)}
              className="btn-icon text-red-500
                         hover:bg-red-50
                         dark:hover:bg-red-900/20"
              title="Delete Subject"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Description */}
        {subject.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400
                        mb-4 line-clamp-2 leading-relaxed">
            {subject.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="space-y-2 mb-4">
          {/* Class */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-50
                            dark:bg-blue-900/20 flex items-center
                            justify-center flex-shrink-0">
              <GraduationCap size={12} className="text-blue-600" />
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              Class:
            </span>
            <span className="font-semibold text-gray-700
                             dark:text-gray-300">
              {subject.class
                ? `${subject.class.name} - ${subject.class.section}`
                : 'Not assigned'
              }
            </span>
          </div>

          {/* Teacher */}
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-50
                            dark:bg-emerald-900/20 flex items-center
                            justify-center flex-shrink-0">
              <UserCheck size={12} className="text-emerald-600" />
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              Teacher:
            </span>
            <span className={`font-semibold truncate ${
              subject.teacher?.user?.name
                ? 'text-gray-700 dark:text-gray-300'
                : 'text-orange-500'
            }`}>
              {subject.teacher?.user?.name || '⚠️ Not assigned'}
            </span>
          </div>
        </div>

        {/* Marks Info */}
        <div className="pt-3 border-t border-gray-100
                        dark:border-gray-700">
          <div className="flex items-center justify-between
                          text-xs text-gray-500 mb-1.5">
            <span>Pass Rate</span>
            <span className="font-bold text-gray-700
                             dark:text-gray-300">
              {subject.passingMarks}/{subject.totalMarks} marks
              ({passPercent}%)
            </span>
          </div>
          {/* Progress Bar */}
          <div className="progress-bar">
            <div
              className={`progress-fill bg-gradient-to-r ${gradient}`}
              style={{ width: `${passPercent}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Subjects Page ────────────────────────────────────
const SubjectsPage = () => {
  const [showModal,  setShowModal]  = useState(false);
  const [editSubject,setEditSubject]= useState(null);
  const [filterClass,setFilterClass]= useState('all');

  // Fetch data
  const {
    data,        loading,  error,   refetch,
  } = useFetch('/admin/subjects');

  const { data: classData   } = useFetch('/admin/classes');
  const { data: teacherData } = useFetch('/admin/teachers');

  const allSubjects = data?.subjects     || [];
  const classes     = classData?.classes  || [];
  const teachers    = teacherData?.teachers
    ?.filter(t => t.isApproved)          || [];

  // Filter subjects by class
  const subjects = filterClass === 'all'
    ? allSubjects
    : allSubjects.filter(s =>
        s.class?._id === filterClass ||
        (filterClass === 'unassigned' && !s.class)
      );

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(
      `Delete subject "${name}"? This cannot be undone!`
    )) return;

    try {
      await api.delete(`/admin/subjects/${id}`);
      toast.success(`Subject "${name}" deleted`);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  // Handle edit
  const handleEdit = (subject) => {
    setEditSubject(subject);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditSubject(null);
  };

  // Stats
  const withTeacher    = allSubjects.filter(s => s.teacher).length;
  const withoutTeacher = allSubjects.filter(s => !s.teacher).length;
  const withClass      = allSubjects.filter(s => s.class).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* ── Header ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start
                      sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Subjects 📖</h1>
          <p className="page-subtitle">
            Create and manage all subjects with teacher assignments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>

      {/* ── Stats Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Subjects',
            value: allSubjects.length,
            color: 'bg-primary-50 dark:bg-primary-900/20',
            text:  'text-primary-600',
            icon:  '📚',
          },
          {
            label: 'With Teacher',
            value: withTeacher,
            color: 'bg-emerald-50 dark:bg-emerald-900/20',
            text:  'text-emerald-600',
            icon:  '✅',
          },
          {
            label: 'No Teacher',
            value: withoutTeacher,
            color: 'bg-orange-50 dark:bg-orange-900/20',
            text:  'text-orange-600',
            icon:  '⚠️',
          },
          {
            label: 'In Classes',
            value: withClass,
            color: 'bg-blue-50 dark:bg-blue-900/20',
            text:  'text-blue-600',
            icon:  '🏫',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.08 }}
            className={`${s.color} rounded-2xl p-4`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className={`text-2xl font-black ${s.text}`}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Warning if subjects need teachers ────────── */}
      {withoutTeacher > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-orange-50 dark:bg-orange-900/20
                     border border-orange-200 dark:border-orange-800
                     rounded-2xl flex items-start gap-3"
        >
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-orange-700
                          dark:text-orange-400 text-sm">
              {withoutTeacher} subject(s) have no teacher assigned!
            </p>
            <p className="text-orange-600 dark:text-orange-300
                          text-xs mt-0.5">
              Click the edit button on each subject to assign a teacher.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Filter by Class ───────────────────────────── */}
      <div className="card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-600
                           dark:text-gray-400 flex-shrink-0">
            Filter by Class:
          </span>

          {/* All button */}
          <button
            onClick={() => setFilterClass('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold
                        transition-all duration-200
              ${filterClass === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
          >
            All ({allSubjects.length})
          </button>

          {/* Class buttons */}
          {classes.map(cls => {
            const count = allSubjects.filter(
              s => s.class?._id === cls._id
            ).length;
            return (
              <button
                key={cls._id}
                onClick={() => setFilterClass(cls._id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold
                            transition-all duration-200
                  ${filterClass === cls._id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {cls.name}-{cls.section} ({count})
              </button>
            );
          })}

          {/* Unassigned button */}
          <button
            onClick={() => setFilterClass('unassigned')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold
                        transition-all duration-200
              ${filterClass === 'unassigned'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
          >
            Unassigned (
            {allSubjects.filter(s => !s.class).length}
            )
          </button>
        </div>
      </div>

      {/* ── Subjects Grid ─────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2
                        lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-2 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-2 w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 font-semibold mb-2">
            Failed to load subjects
          </p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      ) : subjects.length > 0 ? (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {subjects.length}
            </span>
            {' '}subject{subjects.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-3 gap-5">
            {subjects.map((subject, i) => (
              <SubjectCard
                key={subject._id}
                subject={subject}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="card empty-state py-24">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat:   Infinity,
              duration: 3,
              ease:     'easeInOut',
            }}
            className="text-7xl mb-4"
          >
            📖
          </motion.div>
          <p className="empty-state-title text-lg">
            {filterClass === 'all'
              ? 'No subjects created yet'
              : 'No subjects in this class'
            }
          </p>
          <p className="empty-state-subtitle">
            {filterClass === 'all'
              ? 'Add your first subject to get started'
              : 'Try "All" filter or add subjects to this class'
            }
          </p>
          {filterClass === 'all' && (
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary mt-6"
            >
              <Plus size={18} /> Add First Subject
            </button>
          )}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <SubjectModal
            onClose={handleModalClose}
            onSuccess={refetch}
            classes={classes}
            teachers={teachers}
            editData={editSubject}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubjectsPage;