// frontend/src/components/teacher/MyClassesPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { getInitials } from '../../utils/helpers';
import {
  BookOpen, Users, ChevronDown,
  ChevronUp, GraduationCap, RefreshCw,
} from 'lucide-react';

// ── Student List in Class ─────────────────────────────────
const ClassCard = ({ cls, index }) => {
  const [expanded, setExpanded] = useState(false);

  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-600',
  ];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl
                            flex items-center justify-center">
              <BookOpen className="text-white" size={22} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">
                {cls.name}
              </h3>
              <p className="text-white/80 text-sm">
                Section {cls.section}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-black text-2xl">
              {cls.students?.length || 0}
            </p>
            <p className="text-white/70 text-xs">Students</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100
                      dark:divide-gray-700 border-b border-gray-100
                      dark:border-gray-700">
        {[
          {
            label: 'Subjects',
            value: cls.subjects?.length || 0,
          },
          {
            label: 'Room',
            value: cls.room || 'N/A',
          },
          {
            label: 'Capacity',
            value: cls.maxStrength || 40,
          },
        ].map(item => (
          <div key={item.label} className="p-4 text-center">
            <p className="font-black text-xl text-gray-800
                          dark:text-gray-200">{item.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Subjects List */}
      {cls.subjects?.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-100
                        dark:border-gray-700">
          <p className="text-xs text-gray-500 mb-2 font-semibold
                        uppercase tracking-wider">
            Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {cls.subjects.map(sub => (
              <span
                key={sub._id}
                className="badge-primary text-xs"
              >
                {sub.name} ({sub.code})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Students */}
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full px-5 py-3.5 flex items-center
                   justify-between text-sm font-semibold
                   text-gray-700 dark:text-gray-300
                   hover:bg-gray-50 dark:hover:bg-gray-700/50
                   transition-colors"
      >
        <span className="flex items-center gap-2">
          <Users size={16} className="text-primary-500" />
          {expanded ? 'Hide' : 'Show'} Students
          ({cls.students?.length || 0})
        </span>
        {expanded
          ? <ChevronUp size={16} />
          : <ChevronDown size={16} />
        }
      </button>

      {/* Students List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100
                       dark:border-gray-700"
          >
            {cls.students?.length > 0 ? (
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {cls.students.map((student, si) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1,  x: 0  }}
                    transition={{ delay: si * 0.04 }}
                    className="flex items-center gap-3 p-3
                               bg-gray-50 dark:bg-gray-700/50
                               rounded-xl"
                  >
                    {/* Avatar */}
                    {student.user?.profilePhoto?.url ? (
                      <img
                        src={student.user.profilePhoto.url}
                        alt={student.user?.name}
                        className="w-9 h-9 rounded-lg
                                   object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-lg
                                      bg-gradient-to-br ${gradient}
                                      flex items-center justify-center
                                      flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">
                          {getInitials(student.user?.name)}
                        </span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm
                                    text-gray-800 dark:text-gray-200
                                    truncate">
                        {student.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Roll: {student.rollNumber}
                      </p>
                    </div>

                    {/* Index */}
                    <span className="text-xs text-gray-400
                                     font-mono flex-shrink-0">
                      #{si + 1}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-400">
                <GraduationCap
                  size={32}
                  className="mx-auto mb-2 opacity-30"
                />
                <p className="text-sm">No students assigned yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Main My Classes Page ──────────────────────────────────
const MyClassesPage = () => {
  const { data, loading, error, refetch } = useFetch('/teacher/my-classes');
  const classes = data?.classes || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Classes 📚</h1>
          <p className="page-subtitle">
            View all your assigned classes and students.
          </p>
        </div>
        <button
          onClick={refetch}
          className="btn-icon"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Classes',
            value: classes.length,
            color: 'text-primary-600',
            bg:    'bg-primary-50 dark:bg-primary-900/20',
          },
          {
            label: 'Total Students',
            value: classes.reduce(
              (acc, c) => acc + (c.students?.length || 0), 0
            ),
            color: 'text-emerald-600',
            bg:    'bg-emerald-50 dark:bg-emerald-900/20',
          },
          {
            label: 'Total Subjects',
            value: classes.reduce(
              (acc, c) => acc + (c.subjects?.length || 0), 0
            ),
            color: 'text-blue-600',
            bg:    'bg-blue-50 dark:bg-blue-900/20',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.08 }}
            className={`${s.bg} rounded-2xl p-4 text-center`}
          >
            <p className={`text-3xl font-black ${s.color}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Classes */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-28 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {classes.map((cls, i) => (
            <ClassCard key={cls._id} cls={cls} index={i} />
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <BookOpen size={56} className="empty-state-icon" />
          <p className="empty-state-title">No classes assigned</p>
          <p className="empty-state-subtitle">
            Contact admin to assign classes to you.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default MyClassesPage;