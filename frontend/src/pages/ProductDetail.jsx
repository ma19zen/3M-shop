import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addReview } from '../api/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data.data);
      } catch (error) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    try {
      await addReview(id, reviewForm);
      const res = await getProductById(id);
      setProduct(res.data.data);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add review');
    }
  };

  if (loading) return <Loader />;
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <img src={product.images?.[0] || 'https://via.placeholder.com/500'} alt={product.name} className="w-full h-[500px] object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
              ))}
              <span className="text-sm text-gray-500 ml-2">{product.numReviews} reviews</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-6">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg">Brand: {product.brand || 'N/A'}</span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg">Category: {product.category}</span>
              <span className={`px-3 py-1.5 text-sm rounded-lg font-medium ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-all duration-200 active:scale-90">
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 active:scale-90">
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                  <FiShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Reviews ({product.reviews?.length || 0})</h2>
          {user && (
            <form onSubmit={handleReview} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Write a Review</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                  <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200">
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment</label>
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 resize-none" />
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                Submit Review
              </button>
            </form>
          )}
          <div className="space-y-4">
            {product.reviews?.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <strong className="text-gray-900">{review.name}</strong>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
