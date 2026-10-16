// frontend/src/components/parent/ParentFeesPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import {
  formatDate,
  formatCurrency,
  getStatusColor,
} from '../../utils/helpers';
import { DollarSign, RefreshCw, GraduationCap } from 'lucide-react';

// ── Child Fee Section ─────────────────────────────────────
const ChildFeeSection = ({ child, index }) => {
  const [fees,    setFees]    = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded,  setLoaded]  = useState(false);

  const loadFees = async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const { data } = await api.get(
        `/parent/children/${child._id}/fees`
      );
      setFees(data.fees       || []);
      setSummary(data.summary || {});
      setLoaded(true);
    } catch (err) {
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto load on mount
  useState(() => { loadFees(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0  }}
      transition={{ delay: index * 0.1 }}
      className="card overflow-hidden"
    >
      {/* Child Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl
                          flex items-center justify-center">
            <GraduationCap className="text-white" size={22} />
          </div>
          <div>
            <h3 className="text-white font-black text-lg">
              {child.user?.name}
            </h3>
            <p className="text-white/80 text-sm">
              {child.class?.name} - Section {child.class?.section}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4
                        divide-x divide-gray-100
                        dark:divide-gray-700 border-b
                        border-gray-100 dark:border-gray-700">
          {[
            {
              label: 'Total',
              value: formatCurrency(summary.total || 0),
              color: 'text-gray-700 dark:text-gray-300',
            },
            {
              label: 'Paid',
              value: formatCurrency(summary.paid || 0),
              color: 'text-emerald-600',
            },
            {
              label: 'Pending',
              value: formatCurrency(summary.pending || 0),
              color: 'text-orange-600',
            },
            {
              label: 'Overdue',
              value: formatCurrency(summary.overdue || 0),
              color: 'text-red-600',
            },
          ].map(s => (
            <div key={s.label} className="p-4 text-center">
              <p className={`font-black text-sm ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Fee Records */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}
                className="skeleton h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : fees && fees.length > 0 ? (
          <div className="space-y-3">
            {fees.map((fee, fi) => (
              <motion.div
                key={fee._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1,  x: 0  }}
                transition={{ delay: fi * 0.04 }}
                className="flex items-center justify-between
                           p-3 bg-gray-50 dark:bg-gray-700/50
                           rounded-xl"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800
                                dark:text-gray-200 capitalize">
                    {fee.feeType}
                  </p>
                  <p className="text-xs text-gray-500">
                    {fee.month} · Due: {formatDate(fee.dueDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-800
                                dark:text-gray-200">
                    {formatCurrency(fee.amount)}
                  </p>
                  <span className={`badge text-xs capitalize
                    ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : fees && fees.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">
            No fee records
          </p>
        ) : null}
      </div>
    </motion.div>
  );
};

// ── Main Parent Fees Page ─────────────────────────────────
const ParentFeesPage = () => {
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
          <h1 className="page-title">Fee Records 💰</h1>
          <p className="page-subtitle">
            View fee payment history for your children.
          </p>
        </div>
        <button onClick={refetch} className="btn-icon">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Children Fees */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton h-24 w-full rounded-none" />
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j}
                    className="skeleton h-14 w-full rounded-xl" />
                ))}
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
            <ChildFeeSection
              key={child._id}
              child={child}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="card empty-state py-20">
          <DollarSign size={56} className="empty-state-icon" />
          <p className="empty-state-title">No children linked</p>
          <p className="empty-state-subtitle">
            Contact admin to link your children.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ParentFeesPage;