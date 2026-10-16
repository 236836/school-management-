// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Eye, EyeOff,
  Phone, GraduationCap, ArrowRight,
} from 'lucide-react';

const ROLE_PATHS = {
  admin:   '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent:  '/parent/dashboard',
};

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    confirmPassword: '', role: 'student', phone: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success('Account created successfully! 🎉');
      navigate(ROLE_PATHS[data.user.role] || '/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full pl-12 pr-4 py-3.5 rounded-xl
    bg-white/10 border border-white/20 text-white
    placeholder-white/40 focus:outline-none
    focus:border-white/50 focus:bg-white/15
    transition-all duration-200 text-sm`;

  return (
    <div className="min-h-screen bg-gradient-dark
                    flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-96 h-96
                      bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96
                      bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ duration: 0.5  }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-16 h-16 glass rounded-2xl mb-5">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Create Account
          </h1>
          <p className="text-white/60 text-sm">
            Join EduManage School System
          </p>
        </div>

        {/* Register Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-white/40 pointer-events-none" />
              <input name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="Full name" required className={inputClass} />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-white/40 pointer-events-none" />
              <input name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="Email address" required className={inputClass} />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-white/40 pointer-events-none" />
              <input name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="Phone number (optional)"
                className={inputClass} />
            </div>

            {/* Role */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-white/10
                         border border-white/20 text-white
                         focus:outline-none focus:border-white/50
                         transition-all duration-200 text-sm
                         appearance-none cursor-pointer"
            >
              {['student','teacher','parent','admin'].map(r => (
                <option key={r} value={r}
                  className="bg-gray-900 text-white capitalize">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-white/40 pointer-events-none" />
              <input name="password"
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="Password (min 6 chars)"
                required className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-white/40 hover:text-white/70">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2
                -translate-y-1/2 text-white/40 pointer-events-none" />
              <input name="confirmPassword" type="password"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Confirm password"
                required className={inputClass} />
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r
                         from-primary-500 to-pink-500 text-white
                         rounded-xl font-bold text-sm
                         flex items-center justify-center gap-2
                         hover:opacity-90 transition-all duration-200
                         disabled:opacity-60 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30
                                  border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <> Create Account <ArrowRight size={18} /> </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/50 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login"
              className="text-white font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;