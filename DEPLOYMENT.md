# Deployment Guide

## Environment Variables Required

```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

## Quick Deploy Options

### 1. Replit (Recommended)
- Already configured with `.replit` file
- Automatic dependency installation
- Built-in PostgreSQL database
- One-click deployment

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway deploy
```

### 4. Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
git push heroku main
```

## Database Setup

1. Create PostgreSQL database
2. Set DATABASE_URL environment variable
3. Run schema migration:
```bash
npm run db:push
```

## Build Process

The application uses a two-step build:
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles server to `dist/index.js`

## Port Configuration

- Development: Port 5000
- Production: Uses PORT environment variable or defaults to 5000
- Always binds to 0.0.0.0 for container compatibility

## Health Checks

The server responds to all routes - use `/api/categories` for health checks.