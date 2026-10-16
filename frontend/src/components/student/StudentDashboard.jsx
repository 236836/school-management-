// frontend/src/components/student/StudentDashboard.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { DashboardSkeleton } from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';
import {
  ClipboardList, Bell, DollarSign,
  TrendingUp, RefreshCw,
} from 'lucide-react';

const StudentDashboard = () => {
  const { data, loading, error, refetch } = useFetch('/student/dashboard');

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <div className="empty-state">
      <p className="text-red-500 font-semibold mb-4">{error}</p>
      <button onClick={refetch} className="btn-primary">
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  const { student, dashboard } = data || {};
  const pct = dashboard?.attendancePercentage || 0;

  const miniStats = [
    {
      label: 'Assignments Due',
      value: dashboard?.upcomingAssignments?.length || 0,
      icon:  ClipboardList,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20',
    },
    {
      label: 'Pending Fees',
      value: dashboard?.pendingFees || 0,
      icon:  DollarSign,
      color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Notices',
      value: dashboard?.notices?.length || 0,
      icon:  Bell,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Attendance %',
      value: `${pct}%`,
      icon:  TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* ── Welcome Banner ────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0   }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600
                   rounded-2xl p-6 text-white overflow-hidden relative"
      >
        {/* Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32
                        bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 right-16 w-20 h-20
                        bg-white/5 rounded-full translate-y-10" />

        <div className="relative flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">
              Hello, {student?.user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-white/80 text-sm">
              {student?.class?.name} · Section {student?.class?.section}
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              Roll No: {student?.rollNumber}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white/60 text-xs mb-1">Attendance</p>
            <p className="text-5xl font-black">{pct}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-5">
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              initial={{ width: 0   }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-2 bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/60 text-xs">
              {dashboard?.presentDays || 0} Present
            </span>
            <span className="text-white/60 text-xs">
              {dashboard?.totalDays || 0} Total Days
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Mini Stats ───────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {miniStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ delay: i * 0.07 }}
              className="card p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${s.color}
                              flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black text-gray-800
                              dark:text-gray-200">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400
                              truncate">{s.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Assignments + Notices ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="section-title mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-violet-500" />
            Upcoming Assignments
          </h3>

          {dashboard?.upcomingAssignments?.length > 0 ? (
            <div className="space-y-3">
              {dashboard.upcomingAssignments.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x: 0   }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-800
                                    dark:text-gray-200 truncate">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {a.subject?.name}
                      </p>
                    </div>
                    <span className="badge-warning flex-shrink-0 text-[10px]">
                      Due {formatDate(a.dueDate)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <ClipboardList size={32} className="empty-state-icon" />
              <p className="empty-state-title text-sm">
                No upcoming assignments 🎉
              </p>
            </div>
          )}
        </motion.div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Bell size={18} className="text-blue-500" />
            Recent Notices
          </h3>

          {dashboard?.notices?.length > 0 ? (
            <div className="space-y-3">
              {dashboard.notices.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x: 0   }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                >
                  <p className="font-semibold text-sm text-gray-800
                                dark:text-gray-200">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(n.createdAt)}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state py-8">
              <Bell size={32} className="empty-state-icon" />
              <p className="empty-state-title text-sm">No notices</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;