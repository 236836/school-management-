// frontend/src/components/student/NoticesPage.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import { Bell, RefreshCw } from 'lucide-react';

const priorityConfig = {
  urgent: {
    badge: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    dot:   'bg-red-500',
    icon:  '🚨',
  },
  high: {
    badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dot:   'bg-orange-500',
    icon:  '🔴',
  },
  medium: {
    badge: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    dot:   'bg-blue-500',
    icon:  '🔵',
  },
  low: {
    badge: 'bg-gray-100   text-gray-700   dark:bg-gray-700      dark:text-gray-300',
    dot:   'bg-gray-400',
    icon:  '⚪',
  },
};

const StudentNoticesPage = () => {
  const { data, loading, error, refetch } = useFetch('/student/notices');
  const notices = data?.notices || [];

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
            School announcements and class notices.
          </p>
        </div>
        <button onClick={refetch} className="btn-icon" title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Notices */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
            const config = priorityConfig[notice.priority] || priorityConfig.low;
            return (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0  }}
                transition={{ delay: i * 0.06 }}
                className="card p-5 flex gap-4"
              >
                {/* Priority Dot */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-1 ${config.dot}`} />
                  <div className="flex-1 w-0.5 bg-gray-100
                                  dark:bg-gray-700 min-h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200
                                   text-sm">{notice.title}</h3>
                    <span className={`badge flex-shrink-0 ${config.badge}`}>
                      {config.icon} {notice.priority}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400
                                leading-relaxed mb-3">
                    {notice.content}
                  </p>

                  <div className="flex items-center gap-3 text-xs
                                  text-gray-400 dark:text-gray-500">
                    <span>
                      {notice.postedBy?.name || 'School'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(notice.createdAt)}</span>
                    {notice.targetAudience !== 'all' && (
                      <>
                        <span>•</span>
                        <span className="badge-gray capitalize text-[10px]">
                          {notice.targetAudience}
                        </span>
                      </>
                    )}
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
            Check back later for announcements
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default StudentNoticesPage;