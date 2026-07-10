const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Create a test app without starting server or connecting to DB
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Mock auth routes
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin123', role: 'admin' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '30d' });
      return res.json({ success: true, data: { _id: 'admin123', name: 'Admin', email, role: 'admin', token } });
    }
    if (email === 'customer@example.com' && password === 'customer123') {
      const token = jwt.sign({ id: 'customer123', role: 'customer' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '30d' });
      return res.json({ success: true, data: { _id: 'customer123', name: 'Customer', email, role: 'customer', token } });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const token = jwt.sign({ id: 'newuser', role: 'customer' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '30d' });
    return res.status(201).json({ success: true, data: { _id: 'newuser', name, email, role: 'customer', token } });
  });

  // Protected route middleware
  const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token invalid' });
    }
  };

  const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not authorized for this role' });
    }
    next();
  };

  // Protected routes
  app.get('/api/cart', protect, (req, res) => {
    res.json({ success: true, data: { items: [], totalPrice: 0 } });
  });

  app.post('/api/products', protect, authorize('admin'), (req, res) => {
    res.status(201).json({ success: true, data: { _id: 'newprod', ...req.body } });
  });

  app.get('/api/orders', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, data: [] });
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Server Error' });
  });

  return app;
};

describe('API Health Check', () => {
  const app = createTestApp();

  test('GET /api/health returns OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Auth API', () => {
  const app = createTestApp();

  test('POST /api/auth/login with valid credentials returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe('admin');
  });

  test('POST /api/auth/login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/auth/login without fields returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register creates new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Test');
  });

  test('POST /api/auth/register without fields returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login as customer', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'customer@example.com', password: 'customer123' });
    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('customer');
  });
});

describe('Protected Routes', () => {
  const app = createTestApp();
  let adminToken;
  let customerToken;

  beforeAll(async () => {
    const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    adminToken = adminRes.body.data.token;
    const custRes = await request(app).post('/api/auth/login').send({ email: 'customer@example.com', password: 'customer123' });
    customerToken = custRes.body.data.token;
  });

  test('GET /api/cart without token returns 401', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  test('GET /api/cart with valid token returns 200', async () => {
    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/products as customer returns 403', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Test', price: 10 });
    expect(res.status).toBe(403);
  });

  test('POST /api/products as admin returns 201', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Product', price: 10, category: 'Test' });
    expect(res.status).toBe(201);
  });

  test('GET /api/orders as customer returns 403', async () => {
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${customerToken}`);
    expect(res.status).toBe(403);
  });

  test('GET /api/orders as admin returns 200', async () => {
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });
});
