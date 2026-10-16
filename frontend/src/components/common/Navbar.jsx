// frontend/src/components/common/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials, getRoleGradient } from '../../utils/helpers';
import {
  Search, Bell, Sun, Moon,
  User, Settings, LogOut,
  ChevronRight, X,
} from 'lucide-react';

// ── Page Title Map ────────────────────────────────────────
const pageTitles = {
  '/admin/dashboard':  { title: 'Dashboard',         sub: 'Overview & Analytics'        },
  '/admin/students':   { title: 'Students',           sub: 'Manage student records'      },
  '/admin/teachers':   { title: 'Teachers',           sub: 'Manage teaching staff'       },
  '/admin/classes':    { title: 'Classes',            sub: 'Class & section management'  },
  '/admin/subjects':   { title: 'Subjects',           sub: 'Subject management'          },
  '/admin/attendance': { title: 'Attendance Reports', sub: 'View attendance analytics'   },
  '/admin/fees':       { title: 'Fee Management',     sub: 'Track payments & dues'       },
  '/admin/notices':    { title: 'Notice Board',       sub: 'School announcements'        },
  '/admin/reports':    { title: 'Analytics',          sub: 'Performance insights'        },
  '/teacher/dashboard':   { title: 'Dashboard',      sub: 'Your classes today'          },
  '/teacher/classes':     { title: 'My Classes',     sub: 'Assigned classes & students' },
  '/teacher/attendance':  { title: 'Attendance',     sub: 'Mark daily attendance'       },
  '/teacher/assignments': { title: 'Assignments',    sub: 'Create & grade assignments'  },
  '/teacher/notices':     { title: 'Notices',        sub: 'Post class notices'          },
  '/student/dashboard':   { title: 'Dashboard',      sub: 'Your academic overview'      },
  '/student/attendance':  { title: 'My Attendance',  sub: 'Attendance records'          },
  '/student/assignments': { title: 'Assignments',    sub: 'View & submit assignments'   },
  '/student/fees':        { title: 'My Fees',        sub: 'Fee payment history'         },
  '/student/notices':     { title: 'Notices',        sub: 'School announcements'        },
  '/parent/dashboard':    { title: 'Dashboard',      sub: "Children's overview"         },
  '/parent/children':     { title: 'My Children',    sub: 'Academic progress'           },
  '/parent/fees':         { title: 'Fees',           sub: 'Fee payment records'         },
  '/parent/notices':      { title: 'Notices',        sub: 'School announcements'        },
  '/profile':             { title: 'My Profile',     sub: 'Account settings'            },
};

// ── Profile Dropdown ──────────────────────────────────────
const ProfileDropdown = ({ user, gradient, onLogout, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1    }}
    exit={{    opacity: 0, y: 8, scale: 0.96 }}
    transition={{ duration: 0.15 }}
    className="absolute right-0 top-full mt-2 w-64
               bg-white dark:bg-neutral-800 rounded-2xl
               border border-neutral-200 dark:border-neutral-700
               shadow-dropdown overflow-hidden z-50"
    onClick={e => e.stopPropagation()}
  >
    {/* User Info */}
    <div className={`p-4 bg-gradient-to-r ${gradient}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20
                        flex items-center justify-center flex-shrink-0">
          {user?.profilePhoto?.url ? (
            <img
              src={user.profilePhoto.url}
              className="w-full h-full object-cover rounded-xl"
              alt={user?.name}
            />
          ) : (
            <span className="text-white font-bold text-sm">
              {getInitials(user?.name)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm truncate">
            {user?.name}
          </p>
          <p className="text-white/70 text-xs truncate">
            {user?.email}
          </p>
        </div>
      </div>
    </div>

    {/* Menu Items */}
    <div className="p-2">
      {[
        { to: '/profile', icon: User,     label: 'My Profile'  },
      ].map(item => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                     text-sm text-neutral-700 dark:text-neutral-300
                     hover:bg-neutral-100 dark:hover:bg-neutral-700
                     transition-colors font-medium"
        >
          <item.icon size={16} className="text-neutral-500" />
          {item.label}
          <ChevronRight size={14} className="ml-auto text-neutral-400" />
        </Link>
      ))}
    </div>

    <div className="divider mx-2" />

    {/* Logout */}
    <div className="p-2">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 w-full px-3 py-2.5
                   rounded-xl text-sm font-medium
                   text-danger-600 dark:text-danger-400
                   hover:bg-danger-50 dark:hover:bg-danger-900/20
                   transition-colors"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  </motion.div>
);

// ── Main Navbar ───────────────────────────────────────────
const Navbar = () => {
  const { user, logout }        = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location                = useLocation();

  const [showProfile,  setShowProfile]  = useState(false);
  const [showSearch,   setShowSearch]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState('');

  const profileRef = useRef(null);
  const searchRef  = useRef(null);
  const gradient   = getRoleGradient(user?.role);

  const pageInfo = pageTitles[location.pathname] || {
    title: 'EduManage',
    sub:   'School Management',
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Navbar */}
      <header
        className="fixed top-0 right-0 z-20
                   bg-white/90 dark:bg-neutral-900/90
                   backdrop-blur-md
                   border-b border-neutral-200 dark:border-neutral-800
                   flex items-center gap-4 px-4 sm:px-6"
        style={{
          left:   'var(--sidebar-width)',
          height: 'var(--navbar-height)',
        }}
      >
        {/* Left — Page Title */}
        <div className="flex-1 min-w-0 ml-10 lg:ml-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1,  y: 0  }}
              exit={{    opacity: 0,  y: 6  }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-base font-bold text-neutral-900
                             dark:text-neutral-100 truncate">
                {pageInfo.title}
              </h2>
              <p className="text-xs text-neutral-400 hidden sm:block">
                {pageInfo.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-1.5">

          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="btn-icon hidden sm:flex"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-icon"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark
              ? <Sun size={18} className="text-amber-500" />
              : <Moon size={18} className="text-indigo-500" />
            }
          </button>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(p => !p)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5
                         rounded-xl hover:bg-neutral-100
                         dark:hover:bg-neutral-800
                         transition-colors duration-200"
            >
              <div className={`avatar avatar-sm bg-gradient-to-br ${gradient}`}>
                {user?.profilePhoto?.url ? (
                  <img
                    src={user.profilePhoto.url}
                    className="w-full h-full object-cover rounded-lg"
                    alt={user?.name}
                  />
                ) : (
                  <span className="text-white font-bold text-xs">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-neutral-900
                               dark:text-neutral-100 leading-tight">
                  {user?.name?.split(' ')[0]}
                </p>
                <p className="text-[10px] text-neutral-400 capitalize">
                  {user?.role}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <ProfileDropdown
                  user={user}
                  gradient={gradient}
                  onLogout={handleLogout}
                  onClose={() => setShowProfile(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-900/50
                       backdrop-blur-sm flex items-start
                       justify-center pt-20 px-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1,  y: 0,  scale: 1    }}
              exit={{    opacity: 0,  y: -20, scale: 0.96 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl
                         w-full max-w-xl shadow-modal overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4
                              border-b border-neutral-200
                              dark:border-neutral-700">
                <Search size={20} className="text-neutral-400 flex-shrink-0" />
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  placeholder="Search students, teachers, classes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-neutral-900
                             dark:text-neutral-100 text-base
                             placeholder-neutral-400
                             focus:outline-none"
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="btn-icon-sm flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Hint */}
              <div className="p-6 text-center">
                <Search size={32} className="mx-auto text-neutral-300
                                             dark:text-neutral-600 mb-3" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {searchQuery
                    ? `Searching for "${searchQuery}"...`
                    : 'Type to search across the system'
                  }
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Press ESC to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;