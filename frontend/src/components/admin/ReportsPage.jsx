// frontend/src/components/admin/ReportsPage.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart,
  Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ReportsPage = () => {
  const { data, loading } = useFetch('/admin/dashboard');
  const stats = data?.stats || {};

  const feeData = stats.feeChart?.length > 0
    ? stats.feeChart.map(d => ({
        name:   `${d._id.month}/${d._id.year}`,
        amount: d.totalCollected,
        count:  d.count,
      }))
    : [
        { name: 'Sep', amount: 55000, count: 30 },
        { name: 'Oct', amount: 48000, count: 28 },
        { name: 'Nov', amount: 61000, count: 35 },
        { name: 'Dec', amount: 52000, count: 32 },
        { name: 'Jan', amount: 67000, count: 40 },
        { name: 'Feb', amount: 71000, count: 42 },
      ];

  const roleData = [
    { name: 'Students', value: stats.totalStudents || 45 },
    { name: 'Teachers', value: stats.totalTeachers || 8  },
  ];

  const attendanceWeekData = [
    { day: 'Mon', present: 42, absent: 8  },
    { day: 'Tue', present: 45, absent: 5  },
    { day: 'Wed', present: 38, absent: 12 },
    { day: 'Thu', present: 44, absent: 6  },
    { day: 'Fri', present: 40, absent: 10 },
  ];

  const kpiCards = [
    {
      title:    'Revenue This Month',
      value:    formatCurrency(feeData[feeData.length - 1]?.amount || 0),
      change:   '+12%',
      positive: true,
      icon:     DollarSign,
      color:    'from-emerald-500 to-teal-600',
    },
    {
      title:    'Total Enrolled',
      value:    stats.totalStudents || 0,
      change:   '+5 this month',
      positive: true,
      icon:     Users,
      color:    'from-blue-500 to-cyan-600',
    },
    {
      title:    'Attendance Rate',
      value:    `${stats.attendancePercentage || 0}%`,
      change:   stats.attendancePercentage >= 80 ? 'Good' : 'Needs improvement',
      positive: (stats.attendancePercentage || 0) >= 80,
      icon:     TrendingUp,
      color:    'from-violet-500 to-indigo-600',
    },
    {
      title:    'Active Classes',
      value:    stats.totalClasses || 0,
      change:   'Running smoothly',
      positive: true,
      icon:     BookOpen,
      color:    'from-orange-500 to-amber-600',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-6 space-y-3">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="page-title">Analytics & Reports 📊</h1>
        <p className="page-subtitle">
          School performance overview and key metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {card.title}
                </p>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br
                                 ${card.color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-800
                            dark:text-gray-200 mb-1">
                {card.value}
              </p>
              <p className={`text-xs font-semibold ${
                card.positive ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {card.positive ? '↑' : '↓'} {card.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Fee Collection Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="section-title mb-5">
            Fee Collection Trend
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={feeData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#6366f1"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="#6366f1"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={v => [formatCurrency(v), 'Collected']}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#grad1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Role Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="section-title mb-5">User Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {roleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                formatter={(value) => (
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Weekly Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="section-title mb-5">Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceWeekData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="section-title mb-5">Quick Overview</h3>
          <div className="space-y-4">
            {[
              {
                label:   'Student-Teacher Ratio',
                value:   stats.totalTeachers > 0
                  ? `${Math.round(
                      (stats.totalStudents || 0) / (stats.totalTeachers || 1)
                    )}:1`
                  : 'N/A',
                color:   'bg-blue-500',
                width:   '70%',
              },
              {
                label:   'Classes Utilization',
                value:   `${Math.min(
                  Math.round(
                    ((stats.totalStudents || 0) /
                    ((stats.totalClasses || 1) * 40)) * 100
                  ), 100
                )}%`,
                color:   'bg-emerald-500',
                width:   `${Math.min(
                  Math.round(
                    ((stats.totalStudents || 0) /
                    ((stats.totalClasses || 1) * 40)) * 100
                  ), 100
                )}%`,
              },
              {
                label:   'Fee Collection Rate',
                value:   `${Math.round(
                  100 - ((stats.pendingFees || 0) /
                  Math.max(stats.totalStudents || 1, 1)) * 100
                )}%`,
                color:   'bg-violet-500',
                width:   '65%',
              },
              {
                label:   'Attendance Rate',
                value:   `${stats.attendancePercentage || 0}%`,
                color:   (stats.attendancePercentage || 0) >= 75
                  ? 'bg-emerald-500'
                  : 'bg-red-500',
                width:   `${stats.attendancePercentage || 0}%`,
              },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-800
                                   dark:text-gray-200">{item.value}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`progress-fill ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;