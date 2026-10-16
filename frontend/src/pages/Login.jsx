// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Mail, Lock, Eye, EyeOff,
  GraduationCap, ArrowRight,
  Shield, BookOpen, Users,
} from 'lucide-react';

// ── Role Quick Access ─────────────────────────────────────
const ROLES = [
  {
    id:       'admin',
    label:    'Admin',
    icon:     Shield,
    gradient: 'from-violet-500 to-indigo-600',
    color:    'text-violet-600',
    bg:       'bg-violet-50 dark:bg-violet-900/20',
    border:   'border-violet-200 dark:border-violet-800',
    demo:     { email: 'admin@school.com', password: 'Admin@123' },
  },
  {
    id:       'teacher',
    label:    'Teacher',
    icon:     BookOpen,
    gradient: 'from-emerald-500 to-teal-600',
    color:    'text-emerald-600',
    bg:       'bg-emerald-50 dark:bg-emerald-900/20',
    border:   'border-emerald-200 dark:border-emerald-800',
    demo:     { email: 'ahmed@school.com', password: 'Teacher@123' },
  },
  {
    id:       'student',
    label:    'Student',
    icon:     GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    color:    'text-blue-600',
    bg:       'bg-blue-50 dark:bg-blue-900/20',
    border:   'border-blue-200 dark:border-blue-800',
    demo:     { email: 'ali@school.com', password: 'Student@123' },
  },
  {
    id:       'parent',
    label:    'Parent',
    icon:     Users,
    gradient: 'from-amber-500 to-orange-600',
    color:    'text-amber-600',
    bg:       'bg-amber-50 dark:bg-amber-900/20',
    border:   'border-amber-200 dark:border-amber-800',
    demo:     { email: 'parent@school.com', password: 'Parent@123' },
  },
];

const ROLE_PATHS = {
  admin:   '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent:  '/parent/dashboard',
};

const Login = () => {
  const [email,      setEmail]      = useState('admin@school.com');
  const [password,   setPassword]   = useState('Admin@123');
  const [activeRole, setActiveRole] = useState('admin');
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleRoleSelect = (role) => {
    setActiveRole(role.id);
    setEmail(role.demo.email);
    setPassword(role.demo.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(ROLE_PATHS[data.user.role] || '/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel — Branding ────────────────────────── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden
                      bg-gradient-to-br from-primary-900 via-primary-800
                      to-indigo-900">

        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96
                          bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96
                          bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2
                          -translate-y-1/2 w-[500px] h-[500px]
                          bg-violet-500/10 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center
                        flex-1 px-12 py-12">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/15 rounded-2xl
                            flex items-center justify-center
                            backdrop-blur-sm border border-white/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EduManage</h1>
              <p className="text-white/60 text-sm">School Management Platform</p>
            </div>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Manage Your School
              <span className="block text-primary-300 mt-1">
                Intelligently.
              </span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed max-w-sm">
              A complete platform for administrators, teachers,
              students and parents.
            </p>
          </motion.div>

          {/* Feature Points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 space-y-4"
          >
            {[
              'Role-based access control',
              'Real-time attendance tracking',
              'Assignment & grade management',
              'Fee collection & reporting',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0   }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-primary-400/30
                                border border-primary-400/50
                                flex items-center justify-center
                                flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary-300" />
                </div>
                <span className="text-white/70 text-sm">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-6"
          >
            {[
              { value: '500+', label: 'Students' },
              { value: '50+',  label: 'Teachers'  },
              { value: '99%',  label: 'Uptime'    },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ─────────────────────── */}
      <div className="flex-1 lg:max-w-[480px] flex flex-col
                      bg-white dark:bg-neutral-900
                      justify-center px-6 py-12 sm:px-12">

        {/* Mobile Logo */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div className="w-10 h-10 bg-primary-600 rounded-xl
                          flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900
                           dark:text-neutral-100">EduManage</h1>
          </div>
        </div>

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0   }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-neutral-900
                         dark:text-neutral-100">
            Welcome back
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-xs font-semibold text-neutral-500
                        uppercase tracking-wider mb-3">
            Select your role
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ROLES.map(role => {
              const Icon      = role.icon;
              const isActive  = activeRole === role.id;
              return (
                <motion.button
                  key={role.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{   scale: 0.97 }}
                  onClick={() => handleRoleSelect(role)}
                  className={`
                    flex flex-col items-center gap-2
                    p-3 rounded-xl border-2
                    transition-all duration-200 cursor-pointer
                    ${isActive
                      ? `${role.border} ${role.bg} shadow-sm`
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${isActive
                      ? `bg-gradient-to-br ${role.gradient}`
                      : 'bg-neutral-100 dark:bg-neutral-800'
                    }
                  `}>
                    <Icon
                      size={15}
                      className={isActive ? 'text-white' : 'text-neutral-500'}
                    />
                  </div>
                  <span className={`
                    text-[11px] font-semibold
                    ${isActive
                      ? role.color
                      : 'text-neutral-500 dark:text-neutral-400'
                    }
                  `}>
                    {role.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Email */}
          <div className="input-wrapper">
            <label className="input-label">Email address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@school.com"
                required
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-wrapper">
            <div className="flex items-center justify-between">
              <label className="input-label">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary-600 dark:text-primary-400
                           hover:text-primary-700 font-medium
                           transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2
                           text-neutral-400 pointer-events-none"
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="input-field pl-10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                           text-neutral-400 hover:text-neutral-600
                           dark:hover:text-neutral-300 transition-colors"
              >
                {showPass
                  ? <EyeOff size={16} />
                  : <Eye size={16} />
                }
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{   scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30
                              border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Demo Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800
                     border border-neutral-200 dark:border-neutral-700
                     rounded-xl text-center"
        >
          <p className="text-xs text-neutral-400">
            💡 Click a role above to auto-fill demo credentials
          </p>
        </motion.div>

        {/* Register Link */}
        <p className="text-center text-sm text-neutral-500
                      dark:text-neutral-400 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400
                       font-semibold hover:text-primary-700
                       transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;