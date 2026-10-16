// frontend/src/components/admin/FeesPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { formatDate, formatCurrency, getStatusColor } from '../../utils/helpers';
import { TableSkeleton } from '../common/LoadingSkeleton';
import {
  DollarSign, Plus, CheckCircle,
  X, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';

// ── Mark Paid Modal ───────────────────────────────────────
const MarkPaidModal = ({ fee, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    status:     'paid',
    paidAmount: fee?.amount || 0,
    paidDate:   new Date().toISOString().split('T')[0],
    remarks:    '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/fees/${fee._id}`, form);
      toast.success('Fee status updated! ✅');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update');
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
            Update Fee Status
          </h2>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Student: <strong>{fee?.student?.user?.name}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Amount: <strong>{formatCurrency(fee?.amount)}</strong>
            </p>
          </div>

          <div>
            <label className="input-label">Status</label>
            <select
              className="select-field"
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
            >
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="input-label">Amount Paid</label>
            <input
              type="number"
              className="input-field"
              value={form.paidAmount}
              onChange={e => setForm(p => ({
                ...p, paidAmount: Number(e.target.value)
              }))}
            />
          </div>

          <div>
            <label className="input-label">Payment Date</label>
            <input
              type="date"
              className="input-field"
              value={form.paidDate}
              onChange={e => setForm(p => ({
                ...p, paidDate: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="input-label">Remarks</label>
            <input
              className="input-field"
              placeholder="e.g., Bank transfer"
              value={form.remarks}
              onChange={e => setForm(p => ({
                ...p, remarks: e.target.value
              }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-success"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <> <CheckCircle size={16} /> Update Status </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Fees Page ────────────────────────────────────────
const FeesPage = () => {
  const [page,       setPage]       = useState(1);
  const [filter,     setFilter]     = useState('all');
  const [selectedFee,setSelectedFee]= useState(null);

  const statusParam = filter === 'all' ? '' : `&status=${filter}`;
  const url = `/admin/fees?page=${page}&limit=10${statusParam}`;
  const { data, loading, error, refetch } = useFetch(url);

  const fees       = data?.fees       || [];
  const pagination = data?.pagination || {};

  // Summary stats
  const totalPending = fees
    .filter(f => f.status === 'pending')
    .reduce((acc, f) => acc + f.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Fee Management 💰</h1>
        <p className="page-subtitle">
          Track and manage student fee payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label:    'Total Records',
            value:    pagination.total || 0,
            color:    'from-blue-500 to-cyan-600',
            icon:     DollarSign,
          },
          {
            label:    'Pending Amount',
            value:    formatCurrency(totalPending),
            color:    'from-orange-500 to-amber-600',
            icon:     DollarSign,
          },
          {
            label:    'Current Page',
            value:    `${fees.filter(f => f.status === 'paid').length} Paid`,
            color:    'from-emerald-500 to-teal-600',
            icon:     CheckCircle,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br
                              ${card.color} flex items-center justify-center`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>
                <p className="text-xl font-black text-gray-800
                              dark:text-gray-200">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="card p-4 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700
                          dark:text-gray-300 flex-shrink-0">
          Filter by Status:
        </label>
        <select
          className="select-field max-w-48"
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Fees</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="partial">Partial</option>
        </select>
      </div>

      {/* Fees Table */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={refetch} className="btn-primary">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {fees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                    <th>Action</th>
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
                        <p className="font-semibold text-sm text-gray-800
                                      dark:text-gray-200">
                          {fee.student?.user?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fee.student?.rollNumber}
                        </p>
                      </td>

                      <td>
                        <span className="badge-primary capitalize">
                          {fee.feeType}
                        </span>
                      </td>

                      <td>
                        <p className="font-bold text-sm text-gray-800
                                      dark:text-gray-200">
                          {formatCurrency(fee.amount)}
                        </p>
                        {fee.paidAmount > 0 && fee.paidAmount < fee.amount && (
                          <p className="text-xs text-emerald-500">
                            Paid: {formatCurrency(fee.paidAmount)}
                          </p>
                        )}
                      </td>

                      <td>
                        <span className="text-sm text-gray-600
                                         dark:text-gray-400">
                          {formatDate(fee.dueDate)}
                        </span>
                      </td>

                      <td>
                        <span className={`badge capitalize
                          ${getStatusColor(fee.status)}`}>
                          {fee.status}
                        </span>
                      </td>

                      <td>
                        <span className="text-xs text-gray-500 font-mono">
                          {fee.receiptNumber || 'N/A'}
                        </span>
                      </td>

                      <td>
                        {fee.status !== 'paid' && (
                          <button
                            onClick={() => setSelectedFee(fee)}
                            className="btn-icon text-emerald-500
                                       hover:bg-emerald-50
                                       dark:hover:bg-emerald-900/20"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state py-16">
              <DollarSign size={48} className="empty-state-icon" />
              <p className="empty-state-title">No fee records found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100
                            dark:border-gray-700 flex items-center
                            justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="btn-icon disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-icon disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedFee && (
          <MarkPaidModal
            fee={selectedFee}
            onClose={() => setSelectedFee(null)}
            onSuccess={refetch}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FeesPage;