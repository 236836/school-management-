// frontend/src/components/admin/AdminDashboard.jsx
import { motion } from 'framer-motion';
import { useFetch } from '../../hooks/useFetch';
import { DashboardSkeleton } from '../common/LoadingSkeleton';
import { formatDate } from '../../utils/helpers';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  GraduationCap, UserCheck, BookOpen, DollarSign,
  TrendingUp, TrendingDown, Bell, Calendar,
  RefreshCw, ArrowUpRight, Users,
} from 'lucide-react';

// ── Custom Tooltip ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, prefix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-3
                    border border-neutral-200 dark:border-neutral-700
                    shadow-lg text-sm">
      <p className="font-semibold text-neutral-700 dark:text-neutral-300
                    mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {prefix}{p.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────
const StatCard = ({
  title, value, icon: Icon, trend, trendValue,
  gradient, bgLight, delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0  }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -2 }}
    className="card p-6 cursor-default"
  >
    <div className="flex items-start justify-between mb-5">
      <div>
        <p className="text-sm font-medium text-neutral-500
                      dark:text-neutral-400">{title}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br
                       ${gradient} flex items-center justify-center
                       flex-shrink-0 shadow-sm`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>

    <p className="stat-card-value mb-2">{value?.toLocaleString()}</p>

    {trendValue !== undefined && (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 text-xs
                          font-semibold px-2 py-0.5 rounded-full
          ${trend === 'up'
            ? 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400'
            : 'bg-danger-50 text-danger-600 dark:bg-danger-900/30 dark:text-danger-400'
          }`}>
          {trend === 'up'
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />
          }
          {trendValue}
        </span>
        <span className="text-xs text-neutral-400">vs last month</span>
      </div>
    )}
  </motion.div>
);

// ── Pie Colors ────────────────────────────────────────────
const PIE_COLORS = ['#10B981', '#EF4444', '#F59E0B'];

// ── Sample Data ───────────────────────────────────────────
const SAMPLE_FEE = [
  { name: 'Aug', collected: 42000, pending: 8000  },
  { name: 'Sep', collected: 55000, pending: 12000 },
  { name: 'Oct', collected: 48000, pending: 9000  },
  { name: 'Nov', collected: 61000, pending: 7000  },
  { name: 'Dec', collected: 52000, pending: 11000 },
  { name: 'Jan', collected: 67000, pending: 6000  },
];

const SAMPLE_GROWTH = [
  { name: 'Jul', students: 420 },
  { name: 'Aug', students: 435 },
  { name: 'Sep', students: 448 },
  { name: 'Oct', students: 460 },
  { name: 'Nov', students: 458 },
  { name: 'Dec', students: 462 },
  { name: 'Jan', students: 478 },
];

// ── Main Component ────────────────────────────────────────
const AdminDashboard = () => {
  const { data, loading, error, refetch } = useFetch('/admin/dashboard');

  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="empty-state min-h-[60vh]">
      <div className="w-16 h-16 bg-danger-50 dark:bg-danger-900/20
                      rounded-2xl flex items-center justify-center mb-4">
        <RefreshCw size={28} className="text-danger-500" />
      </div>
      <p className="empty-state-title text-lg mb-2">
        Failed to load dashboard
      </p>
      <p className="empty-state-subtitle mb-6">{error}</p>
      <button onClick={refetch} className="btn-primary">
        <RefreshCw size={16} /> Retry
      </button>
    </div>
  );

  const stats = data?.stats || {};
  const pct   = stats.attendancePercentage || 0;

  const feeData = stats.feeChart?.length > 0
    ? stats.feeChart.map(d => ({
        name:      `${d._id.month}/${d._id.year}`,
        collected: d.totalCollected,
        pending:   0,
      }))
    : SAMPLE_FEE;

  const pieData = [
    { name: 'Present', value: pct         },
    { name: 'Absent',  value: 100 - pct   },
  ];

  const statCards = [
    {
      title:     'Total Students',
      value:     stats.totalStudents || 0,
      icon:      GraduationCap,
      gradient:  'from-blue-500 to-indigo-600',
      trend:     'up',
      trendValue:'12 new',
      delay:     0,
    },
    {
      title:     'Total Teachers',
      value:     stats.totalTeachers || 0,
      icon:      UserCheck,
      gradient:  'from-emerald-500 to-teal-600',
      trend:     'up',
      trendValue:'3 new',
      delay:     0.08,
    },
    {
      title:     'Total Classes',
      value:     stats.totalClasses || 0,
      icon:      BookOpen,
      gradient:  'from-violet-500 to-purple-600',
      delay:     0.16,
    },
    {
      title:     'Pending Fees',
      value:     stats.pendingFees || 0,
      icon:      DollarSign,
      gradient:  'from-amber-500 to-orange-600',
      trend:     'down',
      trendValue:'5 less',
      delay:     0.24,
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Page Header ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0   }}
        className="flex flex-col sm:flex-row items-start
                   sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's your school overview for today.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm
                        text-neutral-500 dark:text-neutral-400
                        bg-white dark:bg-neutral-800
                        border border-neutral-200 dark:border-neutral-700
                        px-4 py-2.5 rounded-xl shadow-card">
          <Calendar size={15} />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year:    'numeric',
            month:   'long',
            day:     'numeric',
          })}
        </div>
      </motion.div>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2
                      lg:grid-cols-4 gap-5">
        {statCards.map(card => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Fee Collection Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Fee Collection</h3>
              <p className="text-sm text-neutral-400 mt-0.5">
                Monthly collection overview
              </p>
            </div>
            <span className="badge-success flex items-center gap-1">
              <TrendingUp size={12} />
              +18% this month
            </span>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={feeData}
              barSize={28}
              barGap={4}
            >
              <defs>
                <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#4F46E5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#F59E0B" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip prefix="PKR " />}
                cursor={{ fill: 'rgba(79,70,229,0.04)' }}
              />
              <Bar
                dataKey="collected"
                name="Collected"
                fill="url(#collectedGrad)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                fill="url(#pendingGrad)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.4 }}
          className="card p-6 flex flex-col"
        >
          <h3 className="section-title mb-1">
            Today's Attendance
          </h3>
          <p className="text-sm text-neutral-400 mb-4">
            School-wide overview
          </p>

          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col
                              items-center justify-center">
                <p className="text-3xl font-bold text-neutral-900
                               dark:text-neutral-100">{pct}%</p>
                <p className="text-xs text-neutral-400">Present</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-4">
            {[
              { label: 'Present', color: '#10B981', value: `${pct}%` },
              { label: 'Absent',  color: '#EF4444', value: `${100 - pct}%` },
            ].map(item => (
              <div key={item.label}
                className="flex items-center justify-between
                           text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <span className="text-neutral-600
                                   dark:text-neutral-400">
                    {item.label}
                  </span>
                </div>
                <span className="font-semibold text-neutral-900
                                  dark:text-neutral-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Student Growth + Notices ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Student Growth */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.5 }}
          className="card p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="section-title">Student Enrollment</h3>
              <p className="text-sm text-neutral-400 mt-0.5">
                Growth over last 7 months
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SAMPLE_GROWTH}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"   stopColor="#4F46E5" stopOpacity={0.15} />
                  <stop offset="95%"  stopColor="#4F46E5" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#4F46E5', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="students"
                name="Students"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={{ fill: '#4F46E5', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4F46E5', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Notices */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.6 }}
          className="card p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="section-title">Recent Notices</h3>
            <span className="badge-neutral">
              {stats.recentNotices?.length || 0}
            </span>
          </div>

          {stats.recentNotices?.length > 0 ? (
            <div className="space-y-3 flex-1 overflow-y-auto
                            no-scrollbar">
              {stats.recentNotices.map((notice, i) => {
                const priorityColor = {
                  urgent: 'bg-danger-500',
                  high:   'bg-warning-500',
                  medium: 'bg-secondary-500',
                  low:    'bg-neutral-400',
                }[notice.priority] || 'bg-neutral-400';

                return (
                  <motion.div
                    key={notice._id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0   }}
                    transition={{ delay: 0.6 + i * 0.07 }}
                    className="flex items-start gap-3 p-3 rounded-xl
                               bg-neutral-50 dark:bg-neutral-700/50
                               hover:bg-neutral-100
                               dark:hover:bg-neutral-700
                               transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5
                                     flex-shrink-0 ${priorityColor}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold
                                    text-neutral-900 dark:text-neutral-100
                                    truncate">
                        {notice.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {formatDate(notice.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state flex-1 py-8">
              <Bell size={32} className="empty-state-icon" />
              <p className="empty-state-title text-sm">
                No notices yet
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;