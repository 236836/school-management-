// frontend/src/components/parent/ChildrenPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { formatDate, getStatusColor } from '../../utils/helpers';
import {
  GraduationCap, Calendar, DollarSign,
  TrendingUp, RefreshCw, ChevronDown,
  ChevronUp, Users,
} from 'lucide-react';

// ── Child Card ────────────────────────────────────────────
const ChildCard = ({ child, index }) => {
  const [expanded,    setExpanded]    = useState(false);
  const [attendance,  setAttendance]  = useState(null);
  const [fees,        setFees]        = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const loadData = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (attendance) return;

    setLoadingData(true);
    try {
      const [attRes, feeRes] = await Promise.all([
        api.get(`/parent/children/${child._id}/attendance`),
        api.get(`/parent/children/${child._id}/fees`),
      ]);
      setAttendance(attRes.data);
      setFees(feeRes.data);
    } catch (err) {
      console.error('Failed to load child data');
    } finally {
      setLoadingData(false);
    }
  };

  const pct = attendance?.stats?.percentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl
                            flex items-center justify-center">
              <GraduationCap className="text-white" size={26} />
            </div>
            <div>
              <h3 className="text-white font-black text-lg">
                {child.user?.name}
              </h3>
              <p className="text-white/80 text-sm">
                {child.class?.name} - Section {child.class?.section}
              </p>
              <p className="text-white/60 text-xs">
                Roll: {child.rollNumber}
              </p>
            </div>
          </div>
          <span className={`badge flex-shrink-0 capitalize ${
            child.feeStatus === 'paid'
              ? 'bg-white/20 text-white'
              : 'bg-red-400/80 text-white'
          }`}>
            {child.feeStatus}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100
                      dark:divide-gray-700 border-b border-gray-100
                      dark:border-gray-700">
        {[
          { label: 'Admission', value: child.admissionNumber || 'N/A' },
          { label: 'Gender',    value: child.gender          || 'N/A' },
          { label: 'Blood',     value: child.bloodGroup      || 'N/A' },
        ].map(item => (
          <div key={item.label} className="p-4 text-center">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="font-bold text-sm text-gray-800
                          dark:text-gray-200 mt-0.5 capitalize">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Expand Button */}
      <button
        onClick={loadData}
        className="w-full p-4 flex items-center justify-between
                   text-sm font-semibold text-gray-700
                   dark:text-gray-300 hover:bg-gray-50
                   dark:hover:bg-gray-700/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <TrendingUp size={16} className="text-primary-500" />
          View Detailed Report
        </span>
        {expanded
          ? <ChevronUp size={16} />
          : <ChevronDown size={16} />
        }
      </button>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-100 dark:border-gray-700"
        >
          {loadingData ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary-200
                              border-t-primary-600 rounded-full
                              animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading report...</p>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Attendance */}
              {attendance && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700
                                 dark:text-gray-300 mb-3
                                 flex items-center gap-2">
                    <Calendar size={15} className="text-emerald-500" />
                    Attendance
                  </h4>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs
                                    text-gray-500 mb-1.5">
                      <span>Rate</span>
                      <span className={`font-bold ${
                        pct >= 75
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1 }}
                        className={`progress-fill ${
                          pct >= 75
                            ? 'bg-gradient-success'
                            : 'bg-gradient-danger'
                        }`}
                      />
                    </div>
                    {pct < 75 && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ Below 75% minimum!
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: 'Total',
                        value: attendance.stats?.total   || 0,
                        color: 'text-gray-700 dark:text-gray-300',
                        bg:    'bg-gray-50 dark:bg-gray-700/50',
                      },
                      {
                        label: 'Present',
                        value: attendance.stats?.present || 0,
                        color: 'text-emerald-600',
                        bg:    'bg-emerald-50 dark:bg-emerald-900/20',
                      },
                      {
                        label: 'Absent',
                        value: attendance.stats?.absent  || 0,
                        color: 'text-red-500',
                        bg:    'bg-red-50 dark:bg-red-900/20',
                      },
                    ].map(s => (
                      <div
                        key={s.label}
                        className={`${s.bg} rounded-xl p-3 text-center`}
                      >
                        <p className={`text-xl font-black ${s.color}`}>
                          {s.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fees */}
              {fees && fees.fees?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700
                                 dark:text-gray-300 mb-3
                                 flex items-center gap-2">
                    <DollarSign size={15} className="text-orange-500" />
                    Fee History
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fees.fees.map(fee => (
                      <div
                        key={fee._id}
                        className="flex items-center justify-between
                                   p-3 bg-gray-50 dark:bg-gray-700/50
                                   rounded-xl text-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-800
                                        dark:text-gray-200 capitalize">
                            {fee.feeType}
                          </p>
                          <p className="text-xs text-gray-500">
                            {fee.month}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800
                                        dark:text-gray-200">
                            PKR {fee.amount?.toLocaleString()}
                          </p>
                          <span className={`badge text-xs capitalize
                            ${getStatusColor(fee.status)}`}>
                            {fee.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Main Children Page ────────────────────────────────────
const ChildrenPage = () => {
  const { data, loading, error, refetch } =
    useFetch('/parent/children');
  const children = data?.children || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Children 👨‍👩‍👦</h1>
          <p className="page-subtitle">
            Monitor your children's academic progress.
          </p>
        </div>
        <button onClick={refetch} className="btn-icon">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* List */}
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
      ) : children.length > 0 ? (
        <div className="space-y-5">
          {children.map((child, i) => (
            <ChildCard key={child._id} child={child} index={i} />
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <Users size={56} className="empty-state-icon" />
          <p className="empty-state-title">No children linked</p>
          <p className="empty-state-subtitle">
            Contact admin to link your children.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ChildrenPage;