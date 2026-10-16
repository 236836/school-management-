// frontend/src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Shield, BookOpen,
  Users, Bell, DollarSign, Calendar,
  ChevronRight, Star, CheckCircle,
  BarChart3, Clock, Award,
} from 'lucide-react';

// ── Animation Variants ────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40  },
  show:   { opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12 } },
};

// ── Features Data ─────────────────────────────────────────
const features = [
  {
    icon:  Shield,
    title: 'Role Based Access',
    desc:  'Separate portals for Admin, Teacher, Student and Parent with secure JWT authentication.',
    color: 'from-violet-500 to-indigo-600',
    bg:    'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon:  Calendar,
    title: 'Attendance Tracking',
    desc:  'Mark and monitor daily attendance with real-time statistics and monthly reports.',
    color: 'from-emerald-500 to-teal-600',
    bg:    'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon:  BookOpen,
    title: 'Assignment Management',
    desc:  'Create, submit and grade assignments with file upload support and deadline tracking.',
    color: 'from-blue-500 to-cyan-600',
    bg:    'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon:  DollarSign,
    title: 'Fee Management',
    desc:  'Track fee payments, generate receipts and send reminders for pending dues.',
    color: 'from-orange-500 to-amber-600',
    bg:    'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    icon:  Bell,
    title: 'Notice Board',
    desc:  'Post and receive important announcements with priority levels and audience targeting.',
    color: 'from-pink-500 to-rose-600',
    bg:    'bg-pink-50 dark:bg-pink-900/20',
  },
  {
    icon:  BarChart3,
    title: 'Analytics & Reports',
    desc:  'Visual dashboards with charts showing attendance trends, fee collection and performance.',
    color: 'from-teal-500 to-cyan-600',
    bg:    'bg-teal-50 dark:bg-teal-900/20',
  },
];

// ── Stats Data ────────────────────────────────────────────
const stats = [
  { value: '500+', label: 'Students Managed'  },
  { value: '50+',  label: 'Teachers Onboard'  },
  { value: '99%',  label: 'Uptime Guarantee'  },
  { value: '24/7', label: 'System Available'  },
];

// ── Roles Data ────────────────────────────────────────────
const roles = [
  {
    emoji:    '👑',
    title:    'Admin',
    gradient: 'from-violet-600 to-indigo-600',
    perks: [
      'Full system control',
      'User management',
      'Reports & analytics',
      'Fee management',
    ],
  },
  {
    emoji:    '📚',
    title:    'Teacher',
    gradient: 'from-emerald-600 to-teal-600',
    perks: [
      'Mark attendance',
      'Create assignments',
      'Grade submissions',
      'Post class notices',
    ],
  },
  {
    emoji:    '🎓',
    title:    'Student',
    gradient: 'from-blue-600 to-cyan-600',
    perks: [
      'View attendance',
      'Submit assignments',
      'Check fees',
      'Read notices',
    ],
  },
  {
    emoji:    '👨‍👩‍👦',
    title:    'Parent',
    gradient: 'from-orange-500 to-amber-500',
    perks: [
      'Track children',
      'View attendance',
      'Pay fees online',
      'Get notifications',
    ],
  },
];

// ── Navbar ────────────────────────────────────────────────
const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50
                  bg-white/10 backdrop-blur-md
                  border-b border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-4
                    flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl
                        flex items-center justify-center">
          <GraduationCap className="text-white" size={20} />
        </div>
        <span className="text-white font-bold text-xl">
          EduManage
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-white/80 hover:text-white text-sm
                     font-medium transition-colors px-4 py-2"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-white text-primary-700 px-5 py-2
                     rounded-xl text-sm font-bold
                     hover:bg-white/90 transition-all
                     hover:scale-105 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </div>
  </nav>
);

// ── Main Landing Page ─────────────────────────────────────
const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero Section ───────────────────────────────── */}
      <section className="relative min-h-screen flex items-center
                          justify-center px-6 overflow-hidden
                          bg-gradient-to-br from-gray-900
                          via-primary-900 to-gray-900">

        {/* Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96
                        bg-primary-500/15 rounded-full blur-3xl
                        pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96
                        bg-pink-500/10 rounded-full blur-3xl
                        pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64
                        bg-cyan-500/10 rounded-full blur-3xl
                        pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Hero Content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center max-w-4xl mx-auto pt-20"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2
                             bg-white/10 border border-white/20
                             rounded-full text-sm font-medium
                             text-white/80 backdrop-blur-sm">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              Complete School Management System
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-black
                       mb-6 leading-tight"
          >
            Manage Your School
            <span className="block bg-gradient-to-r from-primary-400
                             via-pink-400 to-cyan-400
                             bg-clip-text text-transparent
                             animate-pulse-slow">
              Smarter & Faster
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-xl text-white/60 mb-10 max-w-2xl
                       mx-auto leading-relaxed"
          >
            A powerful ERP system for schools with dedicated portals
            for Admins, Teachers, Students and Parents.
            Built with modern technology for the best experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center
                       justify-center gap-4"
          >
            <Link
              to="/login"
              className="flex items-center gap-2 px-8 py-4
                         bg-gradient-to-r from-primary-500 to-pink-500
                         text-white rounded-2xl font-bold text-lg
                         hover:opacity-90 hover:scale-105
                         active:scale-95 transition-all duration-200
                         shadow-2xl shadow-primary-500/30"
            >
              <GraduationCap size={22} />
              Start Now - It's Free
              <ChevronRight size={20} />
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4
                         bg-white/10 border border-white/20
                         text-white rounded-2xl font-bold text-lg
                         hover:bg-white/20 transition-all duration-200
                         backdrop-blur-sm"
            >
              Create Account
            </Link>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6
                       mt-16 pt-12 border-t border-white/10"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-black text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 font-semibold text-sm
                             uppercase tracking-widest">
              Features
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">
              Everything You Need
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              A complete suite of tools to manage your school efficiently
              with modern features and beautiful design.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2
                          lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="bg-gray-800/50 border border-gray-700/50
                             rounded-2xl p-6 hover:border-gray-600
                             transition-all duration-300 cursor-default
                             hover:bg-gray-800"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br
                                   ${feature.color} flex items-center
                                   justify-center mb-4 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roles Section ───────────────────────────────── */}
      <section className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-pink-400 font-semibold text-sm
                             uppercase tracking-widest">
              User Roles
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">
              Built for Everyone
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Dedicated portal for each user role with
              role-specific features and permissions.
            </p>
          </motion.div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2
                          lg:grid-cols-4 gap-6">
            {roles.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-gray-800/50 border border-gray-700/50
                           rounded-2xl overflow-hidden
                           hover:border-gray-600 transition-all
                           duration-300"
              >
                {/* Role Header */}
                <div className={`bg-gradient-to-r ${role.gradient}
                                 p-6 text-center`}>
                  <div className="text-5xl mb-3">{role.emoji}</div>
                  <h3 className="text-xl font-black text-white">
                    {role.title}
                  </h3>
                </div>

                {/* Role Features */}
                <div className="p-5 space-y-3">
                  {role.perks.map(perk => (
                    <div key={perk}
                      className="flex items-center gap-3">
                      <CheckCircle
                        size={16}
                        className="text-emerald-400 flex-shrink-0"
                      />
                      <span className="text-white/70 text-sm">
                        {perk}
                      </span>
                    </div>
                  ))}

                  <Link
                    to="/login"
                    className={`flex items-center justify-center gap-2
                                w-full mt-4 py-2.5 px-4 rounded-xl
                                bg-gradient-to-r ${role.gradient}
                                text-white text-sm font-bold
                                hover:opacity-90 transition-all
                                hover:scale-105 active:scale-95`}
                  >
                    Login as {role.title}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ────────────────────────── */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-semibold text-sm
                             uppercase tracking-widest">
              How It Works
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">
              Get Started in 3 Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step:  '01',
                icon:  Users,
                title: 'Create Account',
                desc:  'Register with your role (Admin, Teacher, Student or Parent) and get instant access.',
                color: 'from-primary-500 to-indigo-600',
              },
              {
                step:  '02',
                icon:  Shield,
                title: 'Admin Approves',
                desc:  'Admin reviews and approves teacher accounts. Students get auto-enrolled.',
                color: 'from-emerald-500 to-teal-600',
              },
              {
                step:  '03',
                icon:  Award,
                title: 'Start Managing',
                desc:  'Access your personalized dashboard with all the tools you need.',
                color: 'from-orange-500 to-amber-600',
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  {/* Connector Line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-10
                                    left-full w-full h-0.5
                                    bg-gradient-to-r from-gray-700
                                    to-transparent z-0" />
                  )}

                  {/* Step Circle */}
                  <div className={`relative z-10 w-20 h-20 mx-auto
                                   rounded-2xl bg-gradient-to-br
                                   ${step.color} flex items-center
                                   justify-center mb-5 shadow-2xl`}>
                    <Icon size={32} className="text-white" />
                    <div className="absolute -top-2 -right-2 w-7 h-7
                                    bg-gray-900 border-2 border-gray-700
                                    rounded-full flex items-center
                                    justify-center">
                      <span className="text-xs font-black text-white">
                        {step.step}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br
                          from-primary-900 via-gray-900 to-gray-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Float animation icon */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              repeat:   Infinity,
              duration: 3,
              ease:     'easeInOut',
            }}
            className="text-7xl mb-8"
          >
            🏫
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Ready to Transform
            <span className="block text-transparent bg-gradient-to-r
                             from-primary-400 to-pink-400
                             bg-clip-text">
              Your School?
            </span>
          </h2>

          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of schools already using EduManage to
            streamline their operations and improve communication.
          </p>

          <div className="flex flex-col sm:flex-row items-center
                          justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 px-10 py-4
                         bg-gradient-to-r from-primary-500 to-pink-500
                         text-white rounded-2xl font-black text-lg
                         hover:opacity-90 hover:scale-105
                         active:scale-95 transition-all
                         shadow-2xl shadow-primary-500/30"
            >
              <GraduationCap size={22} />
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-10 py-4
                         border-2 border-white/30 text-white
                         rounded-2xl font-bold text-lg
                         hover:border-white/60 hover:bg-white/5
                         transition-all duration-200"
            >
              Already have account? Login
              <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-gray-800
                         py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center
                          justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg
                              flex items-center justify-center">
                <GraduationCap className="text-white" size={16} />
              </div>
              <span className="text-white font-bold">EduManage</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm
                            text-white/40">
              <Link
                to="/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Register
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-white/30 text-sm">
              © 2025 EduManage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;