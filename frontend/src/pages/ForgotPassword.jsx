// frontend/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  Mail, ArrowLeft,
  GraduationCap, Send,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! 📧');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900
                    via-primary-900 to-gray-900 flex items-center
                    justify-center p-4 relative overflow-hidden">

      {/* Background blob */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96
                      bg-primary-500/10 rounded-full blur-3xl
                      pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0  }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center
                          w-16 h-16 glass rounded-2xl mb-5">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-white/60 text-sm">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl">

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             text-white/40 pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl
                             bg-white/10 border border-white/20
                             text-white placeholder-white/40
                             focus:outline-none focus:border-white/50
                             transition-all text-sm"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{   scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r
                           from-primary-500 to-pink-500 text-white
                           rounded-xl font-bold flex items-center
                           justify-center gap-2 hover:opacity-90
                           disabled:opacity-60 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30
                                  border-t-white rounded-full
                                  animate-spin" />
                ) : (
                  <> <Send size={18} /> Send Reset Link </>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1   }}
              className="text-center space-y-4"
            >
              <div className="text-6xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-white">
                Check Your Email!
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                We sent a reset link to{' '}
                <strong className="text-white">{email}</strong>.
                The link expires in 10 minutes.
              </p>
              <div className="p-4 bg-white/5 rounded-xl
                              border border-white/10 text-left">
                <p className="text-white/40 text-xs">💡 Tips:</p>
                <ul className="text-white/40 text-xs mt-2 space-y-1">
                  <li>• Check spam/junk folder</li>
                  <li>• Link expires in 10 minutes</li>
                  <li>• Request new link if expired</li>
                </ul>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-white/60 text-sm hover:text-white
                           transition-colors"
              >
                Send again →
              </button>
            </motion.div>
          )}

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2
                         text-white/50 text-sm hover:text-white
                         transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;