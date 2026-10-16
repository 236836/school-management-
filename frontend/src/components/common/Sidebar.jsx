// frontend/src/components/common/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { getInitials, getRoleGradient } from '../../utils/helpers';
import {
  LayoutDashboard, Users, BookOpen, Calendar,
  Bell, DollarSign, ClipboardList, LogOut,
  Menu, X, GraduationCap, ChevronRight,
  Sun, Moon, UserCheck, BarChart3, FileText,
  User, Shield, TrendingUp, Award,
  ChevronDown, Settings,
} from 'lucide-react';

// ── Navigation Structure ──────────────────────────────────
const NAV_GROUPS = {
  admin: [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      ],
    },
    {
      label: 'Academics',
      items: [
        { label: 'Students',   icon: GraduationCap, path: '/admin/students'   },
        { label: 'Teachers',   icon: UserCheck,     path: '/admin/teachers'   },
        { label: 'Classes',    icon: BookOpen,      path: '/admin/classes'    },
        { label: 'Subjects',   icon: FileText,      path: '/admin/subjects'   },
        { label: 'Attendance', icon: Calendar,      path: '/admin/attendance' },
      ],
    },
    {
      label: 'Finance',
      items: [
        { label: 'Fees', icon: DollarSign, path: '/admin/fees' },
      ],
    },
    {
      label: 'Communication',
      items: [
        { label: 'Notices', icon: Bell, path: '/admin/notices' },
      ],
    },
    {
      label: 'Reports',
      items: [
        { label: 'Analytics', icon: BarChart3, path: '/admin/reports' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'My Profile', icon: User, path: '/profile' },
      ],
    },
  ],

  teacher: [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/teacher/dashboard' },
      ],
    },
    {
      label: 'Academics',
      items: [
        { label: 'My Classes',   icon: BookOpen,      path: '/teacher/classes'     },
        { label: 'Attendance',   icon: Calendar,      path: '/teacher/attendance'  },
        { label: 'Assignments',  icon: ClipboardList, path: '/teacher/assignments' },
      ],
    },
    {
      label: 'Communication',
      items: [
        { label: 'Notices', icon: Bell, path: '/teacher/notices' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'My Profile', icon: User, path: '/profile' },
      ],
    },
  ],

  student: [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
      ],
    },
    {
      label: 'Academics',
      items: [
        { label: 'Attendance',   icon: Calendar,      path: '/student/attendance'  },
        { label: 'Assignments',  icon: ClipboardList, path: '/student/assignments' },
      ],
    },
    {
      label: 'Finance',
      items: [
        { label: 'My Fees', icon: DollarSign, path: '/student/fees' },
      ],
    },
    {
      label: 'Communication',
      items: [
        { label: 'Notices', icon: Bell, path: '/student/notices' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'My Profile', icon: User, path: '/profile' },
      ],
    },
  ],

  parent: [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/parent/dashboard' },
      ],
    },
    {
      label: 'Children',
      items: [
        { label: 'My Children', icon: Users,       path: '/parent/children' },
        { label: 'Fees',        icon: DollarSign,  path: '/parent/fees'     },
      ],
    },
    {
      label: 'Communication',
      items: [
        { label: 'Notices', icon: Bell, path: '/parent/notices' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'My Profile', icon: User, path: '/profile' },
      ],
    },
  ],
};

// ── Role Badge Colors ─────────────────────────────────────
const roleBadge = {
  admin:   'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  teacher: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  parent:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

// ── Single Nav Item ───────────────────────────────────────
const NavItem = ({ item, onClose, delay = 0 }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon     = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0   }}
      transition={{ delay, duration: 0.2 }}
    >
      <Link
        to={item.path}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-xl
          text-sm font-medium transition-all duration-200
          ${isActive
            ? 'bg-primary-600 text-white shadow-sm'
            : `text-neutral-600 dark:text-neutral-400
               hover:bg-neutral-100 dark:hover:bg-neutral-800
               hover:text-neutral-900 dark:hover:text-neutral-100`
          }
        `}
      >
        <Icon
          size={17}
          className={isActive
            ? 'text-white'
            : 'text-neutral-500 dark:text-neutral-400'
          }
        />
        <span className="flex-1 truncate">{item.label}</span>
        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        )}
      </Link>
    </motion.div>
  );
};

// ── Sidebar Content ───────────────────────────────────────
const SidebarContent = ({ onClose }) => {
  const { user, logout }        = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate                = useNavigate();

  const navGroups = NAV_GROUPS[user?.role] || [];
  const gradient  = getRoleGradient(user?.role);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  let itemIndex = 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900">

      {/* ── Logo ────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-5
                      border-b border-neutral-100 dark:border-neutral-800
                      flex-shrink-0">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br
                        ${gradient} flex items-center
                        justify-center flex-shrink-0 shadow-sm`}>
          <GraduationCap size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-neutral-900 dark:text-neutral-100
                         text-base leading-tight truncate">
            EduManage
          </h1>
          <p className="text-xs text-neutral-400 truncate">
            School Management
          </p>
        </div>
      </div>

      {/* ── User Profile Card ────────────────────────── */}
      <div className="px-3 py-3 border-b border-neutral-100
                      dark:border-neutral-800 flex-shrink-0">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 p-2.5 rounded-xl
                     hover:bg-neutral-50 dark:hover:bg-neutral-800
                     transition-colors duration-200 group"
        >
          {/* Avatar */}
          <div className={`avatar avatar-md bg-gradient-to-br ${gradient}
                          flex-shrink-0`}>
            {user?.profilePhoto?.url ? (
              <img
                src={user.profilePhoto.url}
                alt={user?.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-white font-bold text-sm">
                {getInitials(user?.name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-neutral-900
                          dark:text-neutral-100 truncate group-hover:text-primary-600
                          dark:group-hover:text-primary-400 transition-colors">
              {user?.name}
            </p>
            <span className={`badge text-[10px] py-0.5 mt-0.5
                             ${roleBadge[user?.role]}`}>
              {user?.role}
            </span>
          </div>

          <ChevronRight
            size={14}
            className="text-neutral-400 group-hover:text-primary-500
                       transition-colors flex-shrink-0"
          />
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="sidebar-group-label">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const delay = itemIndex++ * 0.03;
                return (
                  <NavItem
                    key={item.path}
                    item={item}
                    onClose={onClose}
                    delay={delay}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom Actions ───────────────────────────── */}
      <div className="px-3 py-3 border-t border-neutral-100
                      dark:border-neutral-800 space-y-1 flex-shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2.5
                     rounded-xl text-sm font-medium
                     text-neutral-600 dark:text-neutral-400
                     hover:bg-neutral-100 dark:hover:bg-neutral-800
                     hover:text-neutral-900 dark:hover:text-neutral-100
                     transition-all duration-200"
        >
          {isDark
            ? <Sun size={17} className="text-amber-500" />
            : <Moon size={17} className="text-indigo-500" />
          }
          <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5
                     rounded-xl text-sm font-medium
                     text-danger-600 dark:text-danger-400
                     hover:bg-danger-50 dark:hover:bg-danger-900/20
                     transition-all duration-200"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// ── Main Sidebar Component ────────────────────────────────
const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50
                   btn-icon bg-white dark:bg-neutral-800
                   shadow-md border border-neutral-200
                   dark:border-neutral-700"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 z-40
                       bg-neutral-900/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{    x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="lg:hidden fixed left-0 top-0 h-full z-50
                       shadow-xl overflow-hidden"
            style={{ width: 'var(--sidebar-width)' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 z-10
                         btn-icon-sm bg-neutral-100
                         dark:bg-neutral-800"
            >
              <X size={15} />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen
                   border-r border-neutral-200 dark:border-neutral-800
                   shadow-sidebar z-30 overflow-hidden"
        style={{ width: 'var(--sidebar-width)' }}
      >
        <SidebarContent onClose={() => {}} />
      </div>
    </>
  );
};

export default Sidebar;