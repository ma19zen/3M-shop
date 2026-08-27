# EYOUTH-30903211102416-ShopSphere

## Live Application URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://frontend-two-virid-40.vercel.app |
| **Backend API** | https://backend-beta-three-13.vercel.app/api |
| **Review Service** | https://review-service-nu.vercel.app/api/reviews |
| **Health Check** | https://backend-beta-three-13.vercel.app/api/health |
| **Source Code** | https://github.com/ma19zen/3M-shop |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | customer@example.com | customer123 |

## Production Environment Details

- **Frontend**: React 19 + Vite, hosted on Vercel (CDN + Edge Network)
- **Backend**: Express 5 + Prisma, deployed as Vercel Serverless Function
- **Review Service**: Standalone microservice, deployed as Vercel Serverless Function
- **Database**: Supabase PostgreSQL (region: eu-west-1), accessed via Prisma connection pooler
- **Monitoring**: UptimeRobot polling /api/health every 5 minutes

## Repository

- GitHub: https://github.com/ma19zen/3M-shop
- Branch: main (protected — CI/CD must pass before merge)
