// frontend/src/components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center
                  bg-neutral-50 dark:bg-neutral-950">
    <div className="text-center space-y-4">
      <div className="w-14 h-14 border-4 border-primary-200
                      border-t-primary-600 rounded-full
                      animate-spin mx-auto" />
      <p className="text-sm font-medium text-neutral-500
                    dark:text-neutral-400">
        Loading...
      </p>
    </div>
  </div>
);

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth
  if (loading) return <Spinner />;

  // Not authenticated → go to role selection
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Wrong role → unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;