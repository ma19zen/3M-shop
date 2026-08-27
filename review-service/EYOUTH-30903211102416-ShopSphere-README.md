# EYOUTH-30903211102416-ShopSphere — Review Service

## Overview

The Review Service is a standalone microservice extracted from the main ShopSphere backend. It handles all review-related operations independently.

## Deployment

| Property | Value |
|----------|-------|
| **URL** | https://review-service-nu.vercel.app |
| **Platform** | Vercel (Serverless Function) |
| **Runtime** | Node.js 20 |
| **Database** | Supabase PostgreSQL (same instance as backend) |
| **API Base** | /api/reviews |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews/health` | Health check with DB connectivity |
| GET | `/api/reviews/product/:productId` | Get all reviews for a product |
| POST | `/api/reviews` | Create a review (requires productId, userId, name, rating, comment) |
| DELETE | `/api/reviews/:id` | Delete a review by ID |

## How the Main App Communicates

The backend fetches reviews from this service via REST calls:

```
Backend → fetch(REVIEW_SERVICE_URL/api/reviews/product/{id}) → Review Service
```

This is configured via the `REVIEW_SERVICE_URL` environment variable.

## Tech Stack

- Express 5 web framework
- Prisma ORM (Review model only)
- Helmet (security headers)
- CORS (origin-restricted)
- Rate limiting (200 req/15min)
- Morgan (HTTP request logging)
