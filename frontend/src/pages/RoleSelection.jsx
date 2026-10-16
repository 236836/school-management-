// frontend/src/pages/RoleSelection.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { roleConfig, schoolInfo } from '../config/roleConfig';
import RoleCard from '../components/auth/RoleCard';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/login/${role.id}`);
  };

  const roles = Object.values(roleConfig);

  return (
    <div className="min-h-screen relative overflow-hidden
                    bg-gradient-to-br from-neutral-50 via-white
                    to-indigo-50 dark:from-neutral-950
                    dark:via-neutral-900 dark:to-indigo-950">

      {/* ── Decorative Background ────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96
                        bg-indigo-500/10 rounded-full blur-3xl
                        animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96
                        bg-purple-500/10 rounded-full blur-3xl
                        animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64
                        bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72
                        bg-emerald-500/8 rounded-full blur-3xl" />

        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle,
                              #4F46E5 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col
                      px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── School Branding ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0   }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10 sm:mb-14"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0    }}
            transition={{
              type:     'spring',
              stiffness: 200,
              damping:   15,
              delay:    0.1,
            }}
            className="mb-5"
          >
            <img
              src={schoolInfo.logo}
              alt={schoolInfo.name}
              className="w-24 h-24 sm:w-28 sm:h-28
                         object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 mb-4
                            px-4 py-1.5 rounded-full
                            bg-indigo-100 dark:bg-indigo-900/30
                            border border-indigo-200/50
                            dark:border-indigo-800/50">
              <Sparkles size={14} className="text-indigo-600
                                            dark:text-indigo-400" />
              <span className="text-xs font-semibold
                               text-indigo-700 dark:text-indigo-300
                               uppercase tracking-wider">
                Welcome to the Future of Education
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl
                           font-black text-neutral-900
                           dark:text-neutral-100 mb-3
                           tracking-tight leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-600
                               via-purple-600 to-blue-600
                               bg-clip-text text-transparent">
                {schoolInfo.short}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-500
                          dark:text-neutral-400 max-w-2xl mx-auto">
              Choose how you want to continue
            </p>
          </motion.div>
        </motion.div>

        {/* ── Role Cards ──────────────────────────────────── */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2
                            lg:grid-cols-4 gap-5 lg:gap-6">
              {roles.map((role, i) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onSelect={handleRoleSelect}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 sm:mt-14 text-center"
        >
          {/* Features */}
          <div className="flex flex-wrap items-center justify-center
                          gap-6 sm:gap-8 mb-6">
            {[
              { icon: ShieldCheck, label: 'Secure' },
              { icon: Sparkles,    label: 'Simple' },
              { icon: Lock,        label: 'Smart'  },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}
                     className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg
                                  bg-white dark:bg-neutral-800
                                  border border-neutral-200
                                  dark:border-neutral-700
                                  flex items-center justify-center
                                  shadow-sm">
                    <Icon size={15} className="text-indigo-600
                                              dark:text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold
                                   text-neutral-600
                                   dark:text-neutral-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-neutral-400">
            © 2025 {schoolInfo.name}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;