// frontend/src/layouts/DashboardLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import Navbar  from '../components/common/Navbar';

const pageVariants = {
  initial: { opacity: 0, y: 8  },
  animate: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -8 },
};

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className="pt-16 transition-all duration-300 ease-in-out"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-64px)]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardLayout;