import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!loading && !user && !toastShown.current) {
      toastShown.current = true;
      toast.error('Please sign in to access this page');
    }
    if (!loading && user && adminOnly && user.role !== 'admin' && !toastShown.current) {
      toastShown.current = true;
      toast.error('Admin access required');
    }
  }, [loading, user, adminOnly]);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
