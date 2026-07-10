import { http, HttpResponse } from 'msw';

const mockProducts = [
  {
    _id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    price: 149.99,
    category: 'Electronics',
    brand: 'AudioTech',
    images: ['https://via.placeholder.com/300'],
    stock: 25,
    rating: 4.5,
    numReviews: 120,
    featured: true,
    reviews: [],
  },
  {
    _id: '2',
    name: 'Running Shoes',
    description: 'Lightweight running shoes',
    price: 89.99,
    category: 'Sports',
    brand: 'RunFast',
    images: ['https://via.placeholder.com/300'],
    stock: 50,
    rating: 4.2,
    numReviews: 85,
    featured: false,
    reviews: [],
  },
];

const mockUser = {
  _id: 'user1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'customer',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const mockCart = {
  user: 'user1',
  items: [],
  totalPrice: 0,
};

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({
      success: true,
      count: mockProducts.length,
      total: mockProducts.length,
      totalPages: 1,
      currentPage: 1,
      data: mockProducts,
    });
  }),

  http.get('/api/products/featured', () => {
    return HttpResponse.json({
      success: true,
      data: mockProducts.filter((p) => p.featured),
    });
  }),

  http.get('/api/products/categories', () => {
    return HttpResponse.json({
      success: true,
      data: ['Electronics', 'Sports', 'Clothing', 'Home'],
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p._id === params.id);
    if (!product) {
      return HttpResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return HttpResponse.json({ success: true, data: product });
  }),

  http.get('/api/cart', () => {
    return HttpResponse.json({ success: true, data: mockCart });
  }),

  http.post('/api/cart', async ({ request }) => {
    const body = await request.json();
    const product = mockProducts.find((p) => p._id === body.productId);
    if (!product) {
      return HttpResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    mockCart.items.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: body.quantity || 1,
    });
    mockCart.totalPrice = mockCart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return HttpResponse.json({ success: true, data: mockCart });
  }),

  http.put('/api/cart/:itemId', async ({ request }) => {
    const body = await request.json();
    const item = mockCart.items.find((i) => i.product === params?.itemId || i.product?._id === params?.itemId);
    if (item) {
      item.quantity = body.quantity;
    }
    mockCart.totalPrice = mockCart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return HttpResponse.json({ success: true, data: mockCart });
  }),

  http.delete('/api/cart/:itemId', ({ params }) => {
    mockCart.items = mockCart.items.filter((i) => i.product !== params.itemId);
    mockCart.totalPrice = 0;
    return HttpResponse.json({ success: true, data: mockCart });
  }),

  http.delete('/api/cart', () => {
    mockCart.items = [];
    mockCart.totalPrice = 0;
    return HttpResponse.json({ success: true, data: mockCart });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        success: true,
        data: { user: mockUser, token: 'mock-jwt-token' },
      });
    }
    return HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { user: { ...mockUser, name: body.name, email: body.email }, token: 'mock-jwt-token' },
    });
  }),

  http.get('/api/auth/me', () => {
    const authHeader = 'mock-jwt-token';
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  http.get('/api/orders/my-orders', () => {
    return HttpResponse.json({ success: true, count: 0, data: [] });
  }),

  http.get('/api/orders', () => {
    return HttpResponse.json({ success: true, count: 0, data: [] });
  }),

  http.get('/api/users', () => {
    return HttpResponse.json({ success: true, count: 1, data: [mockUser] });
  }),
];
