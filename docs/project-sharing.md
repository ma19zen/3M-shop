# Project Sharing Document

## ShopSphere — Live URLs

| Component | URL | Description |
|-----------|-----|-------------|
| **Main Application (Frontend)** | https://frontend-two-virid-40.vercel.app | React SPA — product browsing, cart, checkout, admin dashboard |
| **Backend API** | https://backend-beta-three-13.vercel.app/api | Express API — auth, products, orders, carts, health check |
| **Review Service** | https://review-service-nu.vercel.app/api/reviews | Standalone microservice — review CRUD operations |
| **Health Check** | https://backend-beta-three-13.vercel.app/api/health | Monitoring endpoint (registered with UptimeRobot) |
| **Source Code Repository** | https://github.com/mazen19/3M-shop | Full source code on GitHub |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | customer@example.com | customer123 |

## Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (DB connectivity verified) |
| GET | `/api/products` | List products (12 seeded, paginated) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Get product with reviews |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/products/:id/reviews` | Add review (auth required) |
| POST | `/api/notifications/send` | Send notification (serverless) |
| GET | `/api/reviews/product/:productId` | Get reviews for product |
| GET | `/api/reviews/health` | Review service health check |

## Service URLs

| Service | Production URL | Environment |
|---------|---------------|-------------|
| Frontend | https://frontend-two-virid-40.vercel.app | Production |
| Backend | https://backend-beta-three-13.vercel.app | Production |
| Review Service | https://review-service-nu.vercel.app | Production |
| Database | Supabase PostgreSQL (eu-west-1) | Production |
