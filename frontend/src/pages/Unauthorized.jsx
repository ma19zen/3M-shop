import { Link } from 'react-router-dom';
import { FiLock, FiHome, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiLock className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {user ? 'Access Denied' : 'Sign In Required'}
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {user
            ? "You don't have permission to access this page. This area is restricted to administrators only."
            : 'You need to be signed in to access this page. Create an account or sign in to continue.'
          }
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm">
            <FiHome className="w-4 h-4" />
            Back to Home
          </Link>
          {!user ? (
            <>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                <FiLogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all duration-200">
                <FiUserPlus className="w-4 h-4" />
                Create Account
              </Link>
            </>
          ) : (
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
              Browse Products
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
