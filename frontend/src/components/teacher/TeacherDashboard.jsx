// frontend/src/components/teacher/TeacherDashboard.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { DashboardSkeleton } from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';
import {
  BookOpen, ClipboardList, CheckCircle,
  Calendar, RefreshCw,
} from 'lucide-react';

const TeacherDashboard = () => {
  const { data, loading, error, refetch } = useFetch('/teacher/dashboard');

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <div className="empty-state">
      <p className="text-red-500 font-semibold mb-4">{error}</p>
      <button onClick={refetch} className="btn-primary">
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  const { teacher, stats } = data || {};

  const cards = [
    {
      label: 'My Classes',
      value: stats?.totalClasses       || 0,
      icon:  BookOpen,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Assignments',
      value: stats?.totalAssignments   || 0,
      icon:  ClipboardList,
      color: 'from-violet-500 to-indigo-600',
    },
    {
      label: 'Pending Grading',
      value: stats?.pendingSubmissions || 0,
      icon:  CheckCircle,
      color: 'from-orange-500 to-amber-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Teacher Dashboard 👨‍🏫</h1>
        <p className="page-subtitle">
          Welcome back, {teacher?.user?.name}!
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {card.label}
                </p>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br
                                 ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-800 dark:text-gray-100">
                {card.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Assigned Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="section-title mb-4 flex items-center gap-2">
            <BookOpen size={18} className="text-primary-500" />
            My Classes
          </h3>

          {teacher?.assignedClasses?.length > 0 ? (
            <div className="space-y-3">
              {teacher.assignedClasses.map((cls, i) => (
                <motion.div
                  key={cls._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x: 0   }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-center gap-3 p-3 rounded-xl
                             bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="w-10 h-10 rounded-xl
                                  bg-gradient-to-br from-blue-500 to-cyan-600
                                  flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {cls.section}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800
                                  dark:text-gray-200">
                      {cls.name}
                    </p>
                    <p className="text-xs text-gray-500">Section {cls.section}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <BookOpen size={32} className="empty-state-icon" />
              <p className="empty-state-title text-sm">No classes assigned</p>
            </div>
          )}
        </motion.div>

        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-emerald-500" />
            Recent Attendance
          </h3>

          {stats?.recentAttendance?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentAttendance.map((att, i) => (
                <div key={att._id}
                  className="flex items-center justify-between p-3
                             rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p className="font-semibold text-sm text-gray-800
                                  dark:text-gray-200">
                      {att.class?.name} - {att.class?.section}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(att.date)}
                    </p>
                  </div>
                  <span className="badge-success">
                    {att.records?.length || 0} students
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <Calendar size={32} className="empty-state-icon" />
              <p className="empty-state-title text-sm">
                No attendance marked yet
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TeacherDashboard;