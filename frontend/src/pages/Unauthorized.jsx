// frontend/src/pages/Unauthorized.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const { user } = useAuth();

  const homePath = user?.role
    ? `/${user.role}/dashboard`
    : '/login';

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1   }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{
            repeat:   Infinity,
            duration: 4,
            ease:     'easeInOut',
          }}
          className="inline-flex items-center justify-center
                     w-24 h-24 bg-red-100 dark:bg-red-900/30
                     rounded-3xl mb-6"
        >
          <ShieldX size={48} className="text-red-500" />
        </motion.div>

        <h1 className="text-7xl font-black text-red-500 mb-3">403</h1>
        <h2 className="text-2xl font-bold text-gray-800
                       dark:text-gray-200 mb-3">
          Access Denied!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">
          You don't have permission to access this page.
        </p>
        {user && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Your role:{' '}
            <span className="font-bold text-primary-600 capitalize">
              {user.role}
            </span>
          </p>
        )}

        <div className="bg-orange-50 dark:bg-orange-900/20
                        border border-orange-200 dark:border-orange-800
                        rounded-xl p-4 mb-8 text-left">
          <p className="text-sm font-semibold text-orange-700
                        dark:text-orange-400 mb-2">
            ⚠️ Why am I seeing this?
          </p>
          <ul className="text-xs text-orange-600 dark:text-orange-300
                         space-y-1">
            <li>• You tried to access a restricted page</li>
            <li>• Your role doesn't have permission</li>
            <li>• Login with a different account</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center
                        justify-center gap-3">
          <Link
            to={homePath}
            className="btn-primary flex items-center gap-2
                       w-full sm:w-auto justify-center"
          >
            <Home size={18} /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2
                       w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized;