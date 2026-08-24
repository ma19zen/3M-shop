# Service Classification

## 1. Frontend Hosting — Vercel → **PaaS (Platform as a Service)**

Vercel provides a complete platform for building and deploying web applications, abstracting away infrastructure management while giving developers control over build configuration, routing, and serverless functions. Developers never provision or manage servers — they push code and Vercel handles builds, CDN distribution, edge caching, and automatic scaling.

## 2. Backend Hosting — Vercel → **PaaS (Platform as a Service)**

Vercel's serverless function platform manages runtime environment, auto-scaling, and deployment pipeline, allowing the backend Express application to run without provisioning or managing any servers. The platform automatically scales from zero to handle traffic spikes and back down when idle, billing only for actual compute time.

## 3. Review Service Hosting — Vercel → **PaaS (Platform as a Service)**

The standalone Review microservice runs as an independent Vercel serverless function, sharing the same PaaS benefits as the backend. It has its own deployment pipeline, can be updated and scaled independently, and requires zero infrastructure management.

## 4. Database — Supabase → **PaaS (Platform as a Service)**

Supabase provides a fully managed PostgreSQL database with built-in authentication, real-time subscriptions, and auto-scaling infrastructure, eliminating the need to manage database servers, backups, or networking. It handles connection pooling, automatic backups, point-in-time recovery, and provides a web dashboard for direct database management.

## 5. Monitoring — UptimeRobot → **SaaS (Software as a Service)**

UptimeRobot is a complete software application consumed as a cloud service. It provides uptime monitoring, SSL monitoring, and alerting without any infrastructure or platform management from our side. We simply configure monitoring endpoints and receive alerts — the entire monitoring stack (servers, dashboards, notification pipelines) is managed by UptimeRobot.

## 6. Infrastructure Layer — Local Development Only → **Not applicable for production**

This project does not use raw IaaS (Infrastructure as a Service) in production. All production infrastructure is abstracted through PaaS providers (Vercel, Supabase). For local development and the Kubernetes simulation exercise, Docker Desktop provides container runtimes, but this is not deployed as production IaaS. In a production scenario requiring IaaS, we would need to provision and manage virtual machines, configure networking, install runtimes, and handle OS-level patching — none of which applies here because our PaaS providers abstract the entire infrastructure layer.

---

## Summary Table

| Component | Service | Category | What We Manage | What Provider Manages |
|-----------|---------|----------|---------------|----------------------|
| Frontend | Vercel | PaaS | Code, build config, routing | Servers, CDN, SSL, scaling |
| Backend API | Vercel | PaaS | Code, routes, middleware | Runtime, scaling, deployment |
| Review Service | Vercel | PaaS | Code, routes, Prisma schema | Runtime, scaling, deployment |
| Database | Supabase | PaaS | Schema, queries, seed data | Server, backups, networking |
| Monitoring | UptimeRobot | SaaS | Monitor URLs, alert contacts | Entire monitoring platform |
