// frontend/src/components/student/FeesPage.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import { DollarSign, RefreshCw, CheckCircle } from 'lucide-react';

const StudentFeesPage = () => {
  const { data, loading, error, refetch } = useFetch('/student/fees');

  const fees    = data?.fees    || [];
  const summary = data?.summary || {};

  const summaryCards = [
    {
      label: 'Total Fees',
      value: formatCurrency(summary.total   || 0),
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Paid',
      value: formatCurrency(summary.paid    || 0),
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Pending',
      value: formatCurrency(summary.pending || 0),
      color: 'from-orange-500 to-amber-600',
    },
    {
      label: 'Overdue',
      value: formatCurrency(summary.overdue || 0),
      color: 'from-red-500 to-rose-600',
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
        <h1 className="page-title">My Fees 💰</h1>
        <p className="page-subtitle">
          View your fee payment history and pending dues.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br
                            ${card.color} flex items-center
                            justify-center mb-3`}>
              <DollarSign size={18} className="text-white" />
            </div>
            <p className="text-lg font-black text-gray-800
                          dark:text-gray-200">{card.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Overdue Warning */}
      {(summary.overdue || 0) > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200
                     dark:border-red-800 rounded-2xl flex items-start gap-3"
        >
          <span className="text-2xl flex-shrink-0">🚨</span>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">
              Overdue Fees!
            </p>
            <p className="text-red-600 dark:text-red-300 text-xs mt-0.5">
              You have {formatCurrency(summary.overdue)} in overdue fees.
              Please contact the accounts office immediately.
            </p>
          </div>
        </motion.div>
      )}

      {/* Fee Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="section-title">Fee Records</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary-200
                            border-t-primary-600 rounded-full
                            animate-spin mx-auto" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={refetch} className="btn-primary">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        ) : fees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee, i) => (
                  <motion.tr
                    key={fee._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <td>
                      <span className="badge-primary capitalize">
                        {fee.feeType}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600 dark:text-gray-400">
                      {fee.month || '-'}
                    </td>
                    <td>
                      <p className="font-bold text-sm text-gray-800
                                    dark:text-gray-200">
                        {formatCurrency(fee.amount)}
                      </p>
                      {fee.paidAmount > 0 &&
                       fee.paidAmount < fee.amount && (
                        <p className="text-xs text-emerald-500">
                          Paid: {formatCurrency(fee.paidAmount)}
                        </p>
                      )}
                    </td>
                    <td className="text-sm text-gray-500">
                      {formatDate(fee.dueDate)}
                    </td>
                    <td className="text-sm text-gray-500">
                      {fee.paidDate ? formatDate(fee.paidDate) : '-'}
                    </td>
                    <td>
                      <span className={`badge capitalize
                        ${getStatusColor(fee.status)}`}>
                        {fee.status === 'paid' && '✅ '}
                        {fee.status}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400 font-mono">
                      {fee.receiptNumber || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-16">
            <DollarSign size={48} className="empty-state-icon" />
            <p className="empty-state-title">No fee records</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentFeesPage;