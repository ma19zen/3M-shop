import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useState } from 'react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, clearAll } = useCart();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(null);

  const handleUpdateQuantity = async (itemId, qty) => {
    setUpdating(itemId);
    try {
      await updateQuantity(itemId, qty);
    } catch (error) {
      toast.error('Failed to update cart');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdating(itemId);
    try {
      await removeItem(itemId);
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (loading) return <Loader />;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="w-9 h-9 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Add some products to get started!</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const itemId = item.product?._id || item.product;
              const isUpdating = updating === itemId;
              return (
                <div key={itemId} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5 transition-all duration-200 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
                  <img src={item.image || item.product?.images?.[0] || 'https://via.placeholder.com/100'} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${itemId}`} className="text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors duration-200 line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-emerald-600 font-bold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                    <div className="flex items-center gap-1 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button disabled={isUpdating} onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200 active:scale-90 disabled:opacity-40">
                          <FiMinus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button disabled={isUpdating} onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 active:scale-90 disabled:opacity-40">
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button disabled={isUpdating} onClick={() => handleRemove(itemId)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-90 disabled:opacity-40">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
            <div className="flex items-center gap-3 pt-2">
              <Link to="/products" className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
                Continue Shopping
              </Link>
              <button onClick={() => { clearAll(); toast.success('Cart cleared'); }} className="px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200">
                Clear Cart
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Items</span>
                  <span className="font-medium text-gray-700">{cart.items.reduce((acc, item) => acc + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax (8%)</span>
                  <span className="font-medium text-gray-700">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-700">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-emerald-500">Free shipping on orders over $100</p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-emerald-600 text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
