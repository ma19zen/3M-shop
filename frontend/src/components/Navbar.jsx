import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-emerald-600 tracking-tight hover:text-emerald-700 transition-colors duration-200">
            3M Shop
          </Link>

          <div className={`flex items-center gap-2 ${mobileMenuOpen ? 'absolute top-16 left-0 right-0 bg-white border-b border-gray-100 flex-col p-4 shadow-lg' : 'hidden md:flex'}`}>
            <Link to="/products" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <FiShoppingCart className="w-4 h-4" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <FiUser className="w-4 h-4" />
                  {user.name}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX className="w-5 h-5 text-gray-600" /> : <FiMenu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
