// frontend/src/components/admin/AttendanceReports.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import api from '../../api/axios';
import { formatDate, getStatusColor } from '../../utils/helpers';
import {
  Calendar, Search, Download,
  RefreshCw, BarChart3, Users,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const AttendanceReports = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [startDate,     setStartDate]     = useState('');
  const [endDate,       setEndDate]       = useState('');
  const [searched,      setSearched]      = useState(false);
  const [reportData,    setReportData]    = useState([]);
  const [loading,       setLoading]       = useState(false);

  const { data: classData } = useFetch('/admin/classes');
  const classes = classData?.classes || [];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      let url = '/admin/attendance?';
      if (selectedClass) url += `classId=${selectedClass}&`;
      if (startDate)     url += `startDate=${startDate}&`;
      if (endDate)       url += `endDate=${endDate}`;

      const { data } = await api.get(url);
      setReportData(data.attendance || []);
    } catch (err) {
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // Build chart data from records
  const chartData = reportData.slice(0, 10).map(record => {
    const present = record.records.filter(
      r => r.status === 'present'
    ).length;
    const absent  = record.records.filter(
      r => r.status === 'absent'
    ).length;
    const total   = record.records.length;

    return {
      date:       new Date(record.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
      }),
      present,
      absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }).reverse();

  // Overall stats
  const totalRecords = reportData.reduce(
    (acc, r) => acc + r.records.length, 0
  );
  const totalPresent = reportData.reduce(
    (acc, r) => acc + r.records.filter(
      s => s.status === 'present'
    ).length, 0
  );
  const overallPercentage = totalRecords > 0
    ? Math.round((totalPresent / totalRecords) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Attendance Reports 📊</h1>
        <p className="page-subtitle">
          View and analyze attendance data across all classes.
        </p>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Filter Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="input-label">Class</label>
            <select
              className="select-field"
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="input-label">Start Date</label>
            <input
              type="date"
              className="input-field"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">End Date</label>
            <input
              type="date"
              className="input-field"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <> <Search size={16} /> Generate Report </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {searched && !loading && (
        <>
          {/* Summary Stats */}
          {reportData.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Records Found',
                  value: reportData.length,
                  color: 'text-blue-600',
                },
                {
                  label: 'Total Students',
                  value: totalRecords,
                  color: 'text-gray-600 dark:text-gray-400',
                },
                {
                  label: 'Total Present',
                  value: totalPresent,
                  color: 'text-emerald-600',
                },
                {
                  label: 'Avg Attendance',
                  value: `${overallPercentage}%`,
                  color: overallPercentage >= 75
                    ? 'text-emerald-600'
                    : 'text-red-600',
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1   }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-4 text-center"
                >
                  <p className={`text-3xl font-black ${s.color}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Chart */}
          {chartData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              className="card p-6"
            >
              <h3 className="section-title mb-5">
                Attendance Trend (Last {chartData.length} Days)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} barGap={4}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar
                    dataKey="present"
                    name="Present"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="absent"
                    name="Absent"
                    fill="#f87171"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Detailed Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2 }}
            className="card overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100
                            dark:border-gray-700 flex items-center
                            justify-between">
              <h3 className="section-title">Detailed Records</h3>
              <span className="badge-primary">
                {reportData.length} records
              </span>
            </div>

            {reportData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Class</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Late</th>
                      <th>Total</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((record, i) => {
                      const present = record.records.filter(
                        r => r.status === 'present'
                      ).length;
                      const absent  = record.records.filter(
                        r => r.status === 'absent'
                      ).length;
                      const late    = record.records.filter(
                        r => r.status === 'late'
                      ).length;
                      const total   = record.records.length;
                      const pct     = total > 0
                        ? Math.round((present / total) * 100)
                        : 0;

                      return (
                        <motion.tr
                          key={record._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="font-medium text-sm">
                            {formatDate(record.date)}
                          </td>
                          <td>
                            <span className="badge-primary">
                              {record.class?.name} - {record.class?.section}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold text-emerald-600">
                              {present}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold text-red-500">
                              {absent}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold text-orange-500">
                              {late}
                            </span>
                          </td>
                          <td className="font-semibold text-gray-700
                                         dark:text-gray-300">
                            {total}
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200
                                              dark:bg-gray-600 rounded-full
                                              overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    pct >= 75
                                      ? 'bg-emerald-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className={`text-sm font-bold ${
                                pct >= 75
                                  ? 'text-emerald-600'
                                  : 'text-red-500'
                              }`}>
                                {pct}%
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state py-16">
                <BarChart3 size={48} className="empty-state-icon" />
                <p className="empty-state-title">No records found</p>
                <p className="empty-state-subtitle">
                  Try different filters or date range
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Initial empty state */}
      {!searched && (
        <div className="card empty-state py-24">
          <Calendar size={64} className="empty-state-icon" />
          <p className="empty-state-title text-lg">
            Generate Attendance Report
          </p>
          <p className="empty-state-subtitle">
            Select a class and date range, then click Generate Report
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AttendanceReports;