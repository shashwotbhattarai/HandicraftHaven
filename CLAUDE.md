# Claude AI Assistant Guidelines for Everest Drishti Crafts E-commerce Platform

## Project Overview
This is a full-stack e-commerce application for selling handcrafted artisan products built with React/TypeScript frontend, Node.js/Express backend, PostgreSQL with Drizzle ORM.

## Key Development Commands
- **Start development**: `npm run dev` (runs both client and server)
- **Build**: `npm run build` 
- **Test**: Check for existing test scripts in package.json
- **Lint**: Check for npm run lint/eslint commands
- **Typecheck**: Check for npm run typecheck/tsc commands

## Project Structure
```
├── client/          # React frontend (Vite + TypeScript)
├── server/          # Express backend (TypeScript)
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Technical Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Deployment**: Replit with autoscaling
- **Port**: Application runs on port 4000 (recently changed from 5000)

## Key Database Entities
- Categories (product categorization)
- Products (main catalog with pricing/inventory)
- Orders (customer order management)
- Order Items (individual order items)
- Cart Items (session-based cart)

## API Structure
- `/api/categories` - Category CRUD
- `/api/products` - Product management with search/filtering
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order processing

## Authentication
- Simple admin auth using localStorage
- Session-based cart for anonymous users
- Admin panel with protected routes

## Recent Changes
- Branding updated from "Artisan Crafts" to "Everest Drishti Craft"
- Server port changed from 5000 to 4000
- Added carousel/slideshow functionality to homepage
- Admin can manage homepage pictures

## Development Notes
- Use existing UI components from shadcn/ui
- Follow TypeScript strict mode
- Use Drizzle ORM for all database operations
- Maintain responsive design with mobile-first approach
- Session-based cart with real-time updates

## Files to Check Before Making Changes
- Check package.json for available scripts
- Review shared/schema.ts for database schema
- Look at existing components in client/src/components
- Check server/storage.ts for backend logic