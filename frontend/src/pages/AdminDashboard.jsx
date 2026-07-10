import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '../api/users';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit, FiX, FiImage } from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: '', brand: '', stock: '', featured: false,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        getAllOrders(), getAllUsers(), getProducts({ limit: 100 }),
      ]);
      setOrders(ordersRes.data.data);
      setUsers(usersRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, { status });
      toast.success(`Order #${orderId} ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await updateOrderStatus(orderId, { status: 'cancelled' });
      toast.success(`Order #${orderId} cancelled`);
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const handleRoleUpdate = async (userId, role) => {
    try {
      await updateUserRole(userId, { role });
      toast.success('User role updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(userId);
      toast.success('User deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    try {
      new URL(imageUrl);
    } catch {
      toast.error('Invalid URL');
      return;
    }
    setProductImages([...productImages, imageUrl.trim()]);
    setImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      formData.append('brand', productForm.brand);
      formData.append('stock', productForm.stock);
      formData.append('featured', productForm.featured);
      if (productImages.length > 0) {
        formData.append('imageUrls', JSON.stringify(productImages));
      }

      if (editProduct) {
        await updateProduct(editProduct._id, formData);
        toast.success('Product updated');
      } else {
        await createProduct(formData);
        toast.success('Product created');
      }
      setShowProductForm(false);
      setEditProduct(null);
      setProductForm({ name: '', description: '', price: '', category: '', brand: '', stock: '', featured: false });
      setProductImages([]);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setProductForm({
      name: product.name, description: product.description, price: product.price,
      category: product.category, brand: product.brand || '', stock: product.stock, featured: product.featured,
    });
    setProductImages(product.images || []);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-600 border-amber-200',
      processing: 'bg-blue-50 text-blue-600 border-blue-200',
      shipped: 'bg-purple-50 text-purple-600 border-purple-200',
      delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      cancelled: 'bg-red-50 text-red-600 border-red-200',
    };
    return colors[status] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200";
  const selectClass = "px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 capitalize";

  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          {[
            { key: 'orders', label: `Orders (${orders.length})` },
            { key: 'users', label: `Users (${users.length})` },
            { key: 'products', label: `Products (${products.length})` },
          ].map((tab) => (
            <button key={tab.key} className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Order</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Customer</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Items</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Total</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.user_name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{order.user_email || ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">${Number(order.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)} className={selectClass}>
                          {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button onClick={() => handleCancelOrder(order.id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Name</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Email</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Role</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Joined</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4">
                        <select value={u.role} onChange={(e) => handleRoleUpdate(u._id, e.target.value)} className={selectClass}>
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" title="Delete user">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            <div className="mb-6">
              <button className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95" onClick={() => {
                setShowProductForm(!showProductForm);
                setEditProduct(null);
                setProductForm({ name: '', description: '', price: '', category: '', brand: '', stock: '', featured: false });
                setProductImages([]);
              }}>
                <FiPlus className="w-4 h-4" />
                {showProductForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>

            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label><input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label><input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className={inputClass} /></div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows="3" className={inputClass + " resize-none"} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($)</label><input type="number" step="0.01" min="0" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label><input type="text" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required className={inputClass} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label><input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required className={inputClass} /></div>
                </div>

                {/* Image URL Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
                  <div className="flex gap-2">
                    <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste image URL and press Add" className={inputClass + " flex-1"} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }} />
                    <button type="button" onClick={handleAddImageUrl} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5">
                      <FiPlus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {productImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {productImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                          <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {productImages.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1"><FiImage className="w-3 h-3" /> No images added — product will show a placeholder</p>
                  )}
                </div>

                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
                  {editProduct ? 'Update Product' : 'Create Product'}
                </button>
              </form>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Image</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Category</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Price</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Stock</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Featured</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/48'} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[200px] truncate">{p.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-emerald-600">${p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{p.stock}</td>
                        <td className="px-6 py-4">
                          {p.featured ? <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full">Yes</span> : <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">No</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditProduct(p)} className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all duration-200" title="Edit product">
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200" title="Delete product">
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400">No products yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
