// frontend/src/pages/RoleLogin.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { roleConfig, schoolInfo } from '../config/roleConfig';
import AuthBranding  from '../components/auth/AuthBranding';
import PasswordInput from '../components/auth/PasswordInput';
import {
  Mail, ArrowRight, ArrowLeft,
  Check, AlertCircle,
} from 'lucide-react';

const RoleLogin = () => {
  const { roleId } = useParams();
  const navigate   = useNavigate();
  const { login }  = useAuth();

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [remember,  setRemember]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const role = roleConfig[roleId];

  // Redirect if invalid role
  useEffect(() => {
    if (!role) {
      navigate('/');
      return;
    }
    // Auto-fill demo credentials
    setEmail(role.demo.email);
    setPassword(role.demo.password);
  }, [role, navigate]);

  if (!role) return null;

  const Icon = role.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);

      // Verify role matches
      if (data.user.role !== roleId) {
        setError(`This account is not a ${role.title}. Please use the correct role login.`);
        setLoading(false);
        return;
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(role.dashboardPath);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-neutral-950">

      {/* ═══════════════════════════════════════════════════
          LEFT PANEL — IMAGE + BRANDING
          ═══════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0   }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{ width: '48%' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={role.image}
            alt={role.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br
                          ${role.gradient} opacity-85`} />
          {/* Bottom Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t
                          from-black/50 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col h-full
                        p-10 xl:p-14 text-white">

          {/* Top: Branding */}
          <AuthBranding compact dark />

          {/* Middle: Hero Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.2 }}
            >
              {/* Role Badge */}
              <div className="inline-flex items-center gap-2 mb-6
                              px-4 py-2 rounded-full
                              bg-white/15 backdrop-blur-md
                              border border-white/20">
                <Icon size={16} />
                <span className="text-sm font-semibold">
                  {role.title} Portal
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl xl:text-5xl font-black
                             leading-tight mb-4">
                {role.heading.split(',')[0]},
                <br />
                <span className="opacity-90">
                  {role.heading.split(',')[1]}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-white/80 max-w-md
                            leading-relaxed">
                {role.subtitle}
              </p>

              {/* Feature Points */}
              <div className="mt-10 space-y-3">
                {[
                  'Access your personalized dashboard',
                  'Manage your data securely',
                  'Real-time notifications',
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0   }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full
                                    bg-white/25 backdrop-blur-sm
                                    flex items-center justify-center
                                    flex-shrink-0">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-white/80 text-sm">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom: Decoration */}
          <div className="text-white/50 text-xs">
            © 2025 {schoolInfo.short}
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-1/4 right-8 w-32 h-32
                        rounded-full border border-white/10" />
        <div className="absolute bottom-1/3 right-16 w-20 h-20
                        rounded-full border border-white/10" />
      </motion.div>

      {/* ═══════════════════════════════════════════════════
          RIGHT PANEL — LOGIN FORM
          ═══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col
                      overflow-y-auto
                      bg-neutral-50 dark:bg-neutral-900">

        {/* Back Button */}
        <div className="p-6 flex-shrink-0">
          <Link
            to="/"
            className="inline-flex items-center gap-2
                       text-sm font-medium
                       text-neutral-600 dark:text-neutral-400
                       hover:text-neutral-900
                       dark:hover:text-neutral-100
                       transition-colors group"
          >
            <ArrowLeft size={16} className="transition-transform
                                            group-hover:-translate-x-1" />
            Choose another role
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center
                        px-6 sm:px-12 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-md"
          >

            {/* Mobile Branding */}
            <div className="lg:hidden mb-8 text-center">
              <AuthBranding compact={false} />

              {/* Mobile Role Image */}
              <div className="mt-6 relative rounded-2xl overflow-hidden
                              h-40 shadow-lg">
                <img
                  src={role.image}
                  alt={role.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br
                                ${role.gradient} opacity-75`} />
                <div className="absolute inset-0 flex items-center
                                justify-center">
                  <div className="text-center text-white">
                    <div className="w-14 h-14 mx-auto mb-2 rounded-2xl
                                    bg-white/20 backdrop-blur-md
                                    flex items-center justify-center">
                      <Icon size={26} />
                    </div>
                    <p className="font-bold text-lg">{role.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              {/* Icon Badge */}
              <div className="inline-flex items-center gap-3 mb-6
                              px-4 py-2 rounded-xl
                              bg-white dark:bg-neutral-800
                              border border-neutral-200
                              dark:border-neutral-700 shadow-sm">
                <div className="w-8 h-8 rounded-lg flex items-center
                                justify-center"
                     style={{
                       backgroundColor: role.accentLight,
                     }}>
                  <Icon size={16} style={{ color: role.accent }} />
                </div>
                <span className="text-sm font-semibold
                                 text-neutral-700 dark:text-neutral-300">
                  {role.title} Login
                </span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-black
                             text-neutral-900 dark:text-neutral-100
                             tracking-tight mb-2">
                Welcome back!
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Sign in to access your dashboard
              </p>
            </div>

            {/* ── Login Form ────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold
                                  text-neutral-700 dark:text-neutral-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               text-neutral-400 pointer-events-none z-10"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl text-sm
                               bg-white dark:bg-neutral-800
                               text-neutral-900 dark:text-neutral-100
                               border border-neutral-200
                               dark:border-neutral-700
                               placeholder-neutral-400
                               focus:outline-none focus:ring-2
                               transition-all duration-200"
                    onFocus={(e) => {
                      e.target.style.borderColor = role.accent;
                      e.target.style.boxShadow   = `0 0 0 3px ${role.accent}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '';
                      e.target.style.boxShadow   = '';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold
                                    text-neutral-700 dark:text-neutral-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold hover:underline
                               transition-colors"
                    style={{ color: role.accent }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  accent={role.accent}
                />
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2.5 cursor-pointer
                                select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4 h-4 rounded border-2
                                  border-neutral-300 dark:border-neutral-600
                                  peer-checked:border-transparent
                                  transition-all"
                       style={{
                         backgroundColor: remember
                           ? role.accent
                           : 'transparent',
                       }}>
                    {remember && (
                      <Check size={12} className="text-white"
                             strokeWidth={3} />
                    )}
                  </div>
                </div>
                <span className="text-sm text-neutral-600
                                 dark:text-neutral-400">
                  Remember me for 30 days
                </span>
              </label>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0,    height: 'auto' }}
                    exit={{    opacity: 0, y: -10, height: 0 }}
                    className="flex items-start gap-2 p-3 rounded-xl
                               bg-red-50 dark:bg-red-900/20
                               border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle size={16} className="text-red-500
                                                     flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{   scale: 0.99 }}
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: role.accent,
                  boxShadow: `0 4px 14px ${role.accent}40`,
                }}
                className="w-full py-3.5 rounded-xl text-white
                           font-bold text-sm flex items-center
                           justify-center gap-2
                           hover:opacity-95 hover:-translate-y-0.5
                           active:translate-y-0
                           disabled:opacity-60 disabled:cursor-not-allowed
                           transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30
                                    border-t-white rounded-full
                                    animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {role.button}
                    <ArrowRight size={17} />
                  </>
                )}
              </motion.button>

              {/* Demo Hint */}
              <div className="p-3 rounded-xl
                              bg-white dark:bg-neutral-800
                              border border-neutral-200
                              dark:border-neutral-700
                              text-center">
                <p className="text-xs text-neutral-500
                              dark:text-neutral-400">
                  💡 Demo credentials pre-filled
                </p>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-neutral-200
                              dark:bg-neutral-700" />
              <span className="text-xs text-neutral-400 font-medium">
                OR
              </span>
              <div className="flex-1 h-px bg-neutral-200
                              dark:bg-neutral-700" />
            </div>

            {/* Register Link */}
            <p className="text-center text-sm
                          text-neutral-500 dark:text-neutral-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold hover:underline
                           transition-colors"
                style={{ color: role.accent }}
              >
                Create account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;