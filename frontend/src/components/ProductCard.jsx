import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiStar } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative h-56 overflow-hidden bg-gray-50">
          <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {product.featured && (
            <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
              Featured
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.numReviews})</span>
          </div>
        </div>
      </Link>
      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="text-xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
        <button onClick={handleAddToCart} className="flex items-center gap-2 bg-gray-900 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
          <FiShoppingCart className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
