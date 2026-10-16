// frontend/src/components/student/AttendancePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { getStatusColor, formatDate } from '../../utils/helpers';
import {
  Calendar, TrendingUp, CheckCircle,
  XCircle, Clock, RefreshCw,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const AttendancePage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year,  setYear]  = useState(new Date().getFullYear());

  const url = `/student/attendance?month=${month}&year=${year}`;
  const { data, loading, error, refetch } = useFetch(url);

  const attendance = data?.attendance || [];
  const stats      = data?.stats      || {};

  // Build chart data - last 7 days
  const chartData = attendance.slice(0, 7).reverse().map(a => ({
    date:    new Date(a.date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric'
    }),
    value:   a.status === 'present' ? 1 : 0,
    status:  a.status,
  }));

  const statCards = [
    {
      label: 'Total Days',
      value: stats.total   || 0,
      icon:  Calendar,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Present',
      value: stats.present || 0,
      icon:  CheckCircle,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Absent',
      value: stats.absent  || 0,
      icon:  XCircle,
      color: 'from-red-500 to-rose-600',
    },
    {
      label: 'Attendance %',
      value: `${stats.percentage || 0}%`,
      icon:  TrendingUp,
      color: stats.percentage >= 75
        ? 'from-emerald-500 to-teal-600'
        : 'from-orange-500 to-amber-600',
    },
  ];

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">My Attendance 📅</h1>
        <p className="page-subtitle">
          Track your attendance records and statistics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br
                              ${card.color} flex items-center justify-center mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-gray-800
                            dark:text-gray-200">{card.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {card.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Attendance Warning */}
      {stats.percentage < 75 && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0   }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200
                     dark:border-red-800 rounded-2xl flex items-start gap-3"
        >
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">
              Low Attendance Warning!
            </p>
            <p className="text-red-600 dark:text-red-300 text-xs mt-0.5">
              Your attendance is {stats.percentage}%. Minimum required is 75%.
              Please attend classes regularly.
            </p>
          </div>
        </motion.div>
      )}

      {/* Month Filter + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Filter */}
        <div className="card p-5 space-y-4">
          <h3 className="section-title">Filter by Month</h3>
          <div>
            <label className="input-label">Month</label>
            <select
              className="select-field"
              value={month}
              onChange={e => setMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Year</label>
            <select
              className="select-field"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Progress */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Attendance Rate</span>
              <span className="font-bold">{stats.percentage || 0}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage || 0}%` }}
                transition={{ duration: 1 }}
                className={`progress-fill ${
                  (stats.percentage || 0) >= 75
                    ? 'bg-gradient-success'
                    : 'bg-gradient-danger'
                }`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Target: 75% minimum
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="section-title mb-4">Recent 7 Days</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 1]}
                  tickFormatter={v => v === 1 ? 'Present' : 'Absent'}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    props.payload.status.toUpperCase(),
                    'Status'
                  ]}
                  contentStyle={{ borderRadius: '12px', border: 'none' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.status === 'present' ? '#10b981' :
                        entry.status === 'late'    ? '#f59e0b' : '#ef4444'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state h-48">
              <Calendar size={36} className="empty-state-icon" />
              <p className="empty-state-title text-sm">No data for this month</p>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="section-title">
            Attendance Records - {months[month - 1]} {year}
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-primary-200
                            border-t-primary-600 rounded-full
                            animate-spin mx-auto" />
          </div>
        ) : attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td className="font-medium text-sm">
                      {formatDate(record.date)}
                    </td>
                    <td className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long'
                      })}
                    </td>
                    <td>
                      <span className={`badge capitalize
                        ${getStatusColor(record.status)}`}>
                        {record.status === 'present' && '✅ '}
                        {record.status === 'absent'  && '❌ '}
                        {record.status === 'late'    && '⏰ '}
                        {record.status}
                      </span>
                    </td>
                    <td className="text-sm text-gray-500">
                      {record.note || '-'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-12">
            <Calendar size={40} className="empty-state-icon" />
            <p className="empty-state-title">
              No records for {months[month - 1]} {year}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AttendancePage;