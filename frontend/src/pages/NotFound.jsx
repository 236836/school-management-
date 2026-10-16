// frontend/src/pages/NotFound.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center
                  bg-gray-50 dark:bg-gray-950 p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1  }}
      className="text-center max-w-md"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-8xl mb-6"
      >
        🏫
      </motion.div>
      <h1 className="text-7xl font-black text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800
                     dark:text-gray-200 mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/"
          className="btn-primary flex items-center gap-2">
          <Home size={18} /> Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFound;