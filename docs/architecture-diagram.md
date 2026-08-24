# ShopSphere Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER'S BROWSER                                │
│                              (HTTPS Request)                                │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL EDGE NETWORK                           │
│                                                                             │
│  ┌───────────────────────┐          ┌──────────────────────────────────┐    │
│  │    FRONTEND (React)   │  /api/*  │       BACKEND (Express)          │    │
│  │    Vercel Hosting     │────────▶│       Vercel Serverless           │    │
│  │    Static SPA + CDN   │  rewrite │       Node.js Function           │    │
│  └───────────────────────┘          └──────────┬───────────────────────┘    │
│                                                │                           │
└────────────────────────────────────────────────┼───────────────────────────┘
                                                 │
                                                 │  REST API Call
                                                 ▼
                          ┌──────────────────────────────────────────┐
                          │         REVIEW SERVICE (Express)         │
                          │         Vercel Serverless Function       │
                          │         Standalone Microservice          │
                          └──────────────────┬───────────────────────┘
                                             │
                                             │
┌────────────────────────────────────────────┼────────────────────────────────┐
│                        SUPABASE (Managed PostgreSQL)                        │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Users     │  │   Products   │  │    Orders    │  │   Reviews    │   │
│  │   (Prisma)   │  │   (Prisma)   │  │   (Prisma)   │  │   (Prisma)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────┐
                              │   UPTIMEROBOT        │
                              │   Health Monitor      │
                              │   GET /api/health     │
                              └─────────────────────┘
```

## Traffic Flow

1. **User** sends HTTPS request to Vercel
2. **Vercel Edge** routes static assets to Frontend service, `/api/*` to Backend
3. **Backend** processes business logic, queries Supabase PostgreSQL via Prisma
4. **Backend** fetches reviews from **Review Service** via internal REST call
5. **Review Service** queries the same Supabase PostgreSQL (reviews table)
6. **UptimeRobot** polls `/api/health` every 5 minutes for uptime monitoring

## Components

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend | React 19 + Vite + Tailwind CSS | Vercel (Static/CDN) |
| Backend | Express 5 + Prisma | Vercel (Serverless) |
| Review Service | Express 5 + Prisma | Vercel (Serverless) |
| Database | PostgreSQL 15 | Supabase (Managed) |
| Monitoring | HTTP Health Check | UptimeRobot |
