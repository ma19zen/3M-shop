================================================================================
                     3M SHOP - Full-Stack E-Commerce Platform
================================================================================

Project Overview
----------------
This is a complete Full-Stack E-Commerce Platform built as a 1st term Project.
for DECI Eyouth platform
It covers: development environment setup, frontend & backend development,
database connections, project structure organization, authentication & role
management (Customer & Admin), product & shopping features (search, filtering,
sorting, pagination, cart, image upload), frontend pages connected to real APIs
with proper state management & error handling, database design, additional
services, testing, and professional project delivery.

================================================================================
🚀 Project Access & Preview
================================================================================

You can explore the source code, project structure, and the live application through the following links:

🌐 Live Preview: [Insert your deployed project URL here]

📂 GitHub Repository: [Insert your repository link here]

💡 Quick Guide for Evaluators
Deployment: The project is fully containerized with Docker. You can run it locally using docker-compose up --build.

Test Credentials: To explore the Admin features (e.g., Product Management, Dashboard), please use the credentials provided in the Credentials section below.

================================================================================
TECHNOLOGIES USED
================================================================================

Frontend:
  - React 19 with Vite (build tool)
  - React Router v7 (client-side routing)
  - Tailwind CSS v4 (utility-first styling)
  - Axios (HTTP client)
  - React Hot Toast (toast notifications)
  - React Icons (icon library)
  - React Testing Library + Vitest (component testing)
  - MSW - Mock Service Worker (API mocking in tests)

Backend:
  - Node.js + Express (REST API server)
  - MongoDB + Mongoose (users, products, carts)
  - PostgreSQL + pg (orders, order items)
  - JWT Authentication (bcryptjs, jsonwebtoken)
  - Multer (file upload handling)
  - Jest + Supertest (unit & integration testing)

DevOps:
  - Docker + Docker Compose (containerization)
  - Nginx (reverse proxy / static file serving for production)

================================================================================
PROJECT STRUCTURE
================================================================================

ecommerce/
  backend/
    src/
      config/           - Database configuration (MongoDB & PostgreSQL)
      controllers/      - Route handlers (auth, cart, order, product, user)
      middleware/        - Auth, error handling, file upload middleware
      models/           - MongoDB models (User, Product, Cart) & PostgreSQL (Order)
      routes/           - API route definitions
      tests/            - Jest/Supertest integration tests (43 tests)
      utils/            - Helpers, AppError class, seed script
    uploads/            - Uploaded product images
    Dockerfile
    package.json
  frontend/
    src/
      api/              - Axios API layer (auth, cart, orders, products, users)
      components/       - Reusable UI (Navbar, Footer, ProductCard, Loader, Pagination, ProtectedRoute)
      context/          - Auth & Cart context providers (state management)
      mocks/            - MSW handlers & server for test API mocking
      pages/            - Page components (Home, Products, ProductDetail, Login, Register, Cart, Checkout, Profile, AdminDashboard)
      __tests__/        - React component tests with MSW (18 tests)
      setupTests.js     - Test setup (MSW server, localStorage polyfill)
    public/
      favicon.svg       - "M" letter favicon
    Dockerfile
    nginx.conf
    package.json
  docker-compose.yml
  README.txt

================================================================================
HOW TO RUN
================================================================================

Prerequisites:
  - Node.js 20+
  - Docker & Docker Compose (recommended)
  - OR: MongoDB + PostgreSQL installed locally

Option 1: Using Docker (Recommended)
-------------------------------------
  docker-compose up --build

  This starts all 4 services:
    - Frontend (React):  http://localhost
    - Backend API:       http://localhost:5000/api
    - MongoDB:           localhost:27017
    - PostgreSQL:        localhost:5432

Option 2: Manual Setup
-----------------------
  Backend:
    cd backend
    cp .env.example .env     (update with your database credentials)
    npm install
    npm run seed              (seed database with 12 products & 2 test accounts)
    npm run dev               (starts on port 5000)

  Frontend:
    cd frontend
    npm install
    npm run dev               (starts on port 5173)

Running Tests:
--------------
  Backend (43 tests - Jest + Supertest):
    cd backend
    npm test

  Frontend (18 tests - Vitest + React Testing Library + MSW):
    cd frontend
    npm test

================================================================================
API ENDPOINTS
================================================================================

Auth:
  POST   /api/auth/register       - Register new user          (Public)
  POST   /api/auth/login          - Login                      (Public)
  GET    /api/auth/me             - Get current user           (Authenticated)
  PUT    /api/auth/profile        - Update profile             (Authenticated)
  PUT    /api/auth/change-password - Change password           (Authenticated)

Products:
  GET    /api/products            - Get all (search/filter/sort/paginate) (Public)
  GET    /api/products/featured   - Get featured products       (Public)
  GET    /api/products/categories - Get all categories          (Public)
  GET    /api/products/:id        - Get single product          (Public)
  POST   /api/products            - Create product              (Admin)
  PUT    /api/products/:id        - Update product              (Admin)
  DELETE /api/products/:id        - Delete product              (Admin)
  POST   /api/products/:id/reviews - Add review                (Authenticated)

Cart:
  GET    /api/cart                - Get user cart               (Authenticated)
  POST   /api/cart                - Add item to cart            (Authenticated)
  PUT    /api/cart/:itemId        - Update item quantity        (Authenticated)
  DELETE /api/cart/:itemId        - Remove item from cart       (Authenticated)
  DELETE /api/cart                - Clear entire cart           (Authenticated)

Orders:
  POST   /api/orders              - Create order from cart      (Authenticated)
  GET    /api/orders/my-orders    - Get user's orders           (Authenticated)
  GET    /api/orders/:id          - Get order by ID             (Authenticated)
  GET    /api/orders              - Get all orders              (Admin)
  PUT    /api/orders/:id/status   - Update order status         (Admin)

Users (Admin):
  GET    /api/users               - Get all users               (Admin)
  GET    /api/users/:id           - Get user by ID              (Admin)
  PUT    /api/users/:id/role      - Update user role            (Admin)
  DELETE /api/users/:id           - Delete user                 (Admin)

================================================================================
PROJECT URLs
================================================================================

  With Docker:
    Frontend:    http://localhost
    Backend API: http://localhost:5000/api

  Without Docker (Development):
    Frontend:    http://localhost:5173
    Backend API: http://localhost:5000/api

  API Health Check: http://localhost:5000/api/health

================================================================================
TEST ACCOUNT CREDENTIALS
================================================================================

  Admin Account:
    Email:    admin@example.com
    Password: admin123

  Customer Account:
    Email:    customer@example.com
    Password: customer123

================================================================================
DATABASE DESIGN
================================================================================

  MongoDB Collections:
    - users      - User accounts with roles (customer/admin)
    - products   - Product catalog with embedded reviews
    - carts      - Shopping carts per user with items & total

  PostgreSQL Tables:
    - orders      - Order records with shipping address, payment method, status
    - order_items - Individual items within each order (product, price, quantity)

  Why both databases?
    MongoDB:  Flexible schema for frequently changing data (products, carts, users)
    PostgreSQL: ACID transactions for critical order/payment data

================================================================================
FEATURES
================================================================================

  Customer Features:
    - User registration & login with JWT
    - Browse products with search, category filter, sort, pagination
    - View product details with reviews
    - Add/remove items from shopping cart
    - Adjust cart quantities with real-time total updates
    - Checkout with shipping address & payment method selection
    - Tax (8%) and shipping calculations (free over $100)
    - View order history
    - Update profile

  Admin Features:
    - Admin dashboard with orders, users, and products tabs
    - View all orders with customer info and status management
    - Cancel orders
    - Manage users (change roles, delete accounts)
    - Manage products (create, edit, delete)
    - Add product images via URL or file upload
    - Mark products as featured

  Technical Features:
    - Responsive design (mobile, tablet, desktop)
    - Optimistic UI updates for cart operations
    - API error handling with toast notifications
    - Input validation on forms
    - Protected routes with role-based access
    - Docker containerization for all services

================================================================================
TESTING SUMMARY
================================================================================

  Backend Tests (Jest + Supertest): 43 tests
    - auth.test.js      - Registration, login, token validation
    - product.test.js   - CRUD operations, search, filter, pagination
    - order.test.js     - Order creation, status updates
    - api.test.js       - API integration & error handling

  Frontend Tests (Vitest + React Testing Library + MSW): 18 tests
    - App.test.jsx       - Navigation, brand name, footer rendering
    - ProductCard.test.jsx - Product display, links, badges
    - Pagination.test.jsx  - Page navigation, button states

  MSW (Mock Service Worker):
    - Mocks all API endpoints during frontend tests
    - Provides realistic mock data for products, cart, auth, orders
    - Server setup in src/mocks/server.js
    - Handlers in src/mocks/handlers.js

================================================================================
NOTES
================================================================================

  - Update .env with your own secrets before deploying to production
  - The seed script creates 12 sample products and 2 test accounts
  - Uploaded images are stored in backend/uploads/
  - MongoDB is used for frequently changing data (products, carts, users)
  - PostgreSQL is used for transactional data (orders, order items)
  - The frontend uses Vite's proxy to forward /api requests to the backend
  - All Docker containers use Node 20 Alpine for small image sizes
  - Nginx serves the built frontend and proxies API calls to the backend
