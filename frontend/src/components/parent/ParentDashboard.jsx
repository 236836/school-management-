// frontend/src/components/parent/ParentDashboard.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { DashboardSkeleton } from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';
import { Users, Bell, GraduationCap, RefreshCw } from 'lucide-react';

const ParentDashboard = () => {
  const { data, loading, error, refetch } = useFetch('/parent/dashboard');

  if (loading) return <DashboardSkeleton />;
  if (error) return (
    <div className="empty-state">
      <p className="text-red-500 font-semibold mb-4">{error}</p>
      <button onClick={refetch} className="btn-primary">
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  const { dashboard } = data || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Parent Dashboard 👨‍👩‍👦</h1>
        <p className="page-subtitle">
          Monitor your children's progress and school updates.
        </p>
      </div>

      {/* Children Cards */}
      <div>
        <h3 className="section-title mb-4 flex items-center gap-2">
          <GraduationCap size={18} className="text-primary-500" />
          My Children
        </h3>

        {dashboard?.children?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {dashboard.children.map((child, i) => (
              <motion.div
                key={child._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="card p-6"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl
                                  bg-gradient-to-br from-blue-500 to-cyan-600
                                  flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-white" size={26} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800
                                  dark:text-gray-200 truncate">
                      {child.user?.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {child.class?.name} · Section {child.class?.section}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Roll: {child.rollNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between
                                p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Fee Status
                  </span>
                  <span className={`badge capitalize
                    ${child.feeStatus === 'paid'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                    {child.feeStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card empty-state py-12">
            <Users size={40} className="empty-state-icon" />
            <p className="empty-state-title">No children linked</p>
            <p className="empty-state-subtitle">
              Contact admin to link your children.
            </p>
          </div>
        )}
      </div>

      {/* Notices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Bell size={18} className="text-blue-500" />
          School Notices
        </h3>

        {dashboard?.notices?.length > 0 ? (
          <div className="space-y-3">
            {dashboard.notices.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1,  x: 0   }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
              >
                <p className="font-semibold text-sm text-gray-800
                              dark:text-gray-200">{n.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {n.content?.slice(0, 100)}
                  {n.content?.length > 100 && '...'}
                </p>
                <p className="text-xs text-gray-400 mt-1.5">
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
    </motion.div>
  );
};

export default ParentDashboard;