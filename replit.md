# Artisan Crafts E-commerce Platform

## Overview

This is a full-stack e-commerce web application built for selling handcrafted artisan products. The system uses a modern React frontend with a Node.js/Express backend, PostgreSQL database with Drizzle ORM, and is configured for deployment on Replit with autoscaling capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: In-memory storage with session-based shopping cart

### UI/UX Design
- **Design System**: Custom artisan-themed color palette with warm browns and beiges
- **Component Library**: Radix UI primitives with custom styling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Client-side validation with Zod schemas

## Key Components

### Database Schema
The application uses a well-structured relational database with the following entities:
- **Categories**: Product categorization with active/inactive status
- **Products**: Main product catalog with pricing, inventory, and images
- **Orders**: Customer order management with status tracking
- **Order Items**: Individual items within orders
- **Cart Items**: Session-based shopping cart functionality

### API Structure
RESTful API endpoints organized by resource:
- `/api/categories` - Category CRUD operations
- `/api/products` - Product management with search and filtering
- `/api/cart` - Shopping cart operations
- `/api/orders` - Order processing and management

### Authentication System
- Simple admin authentication using localStorage
- Session-based cart management for anonymous users
- Separate admin panel with protected routes

### Shopping Cart System
- Session-based cart persistence
- Real-time cart updates with optimistic UI
- Cart state management through React Context

## Data Flow

1. **Product Browsing**: Users can browse products by category, search, and view detailed product information
2. **Cart Management**: Products are added to session-based cart, with real-time updates
3. **Order Processing**: Cart items are converted to orders with customer information
4. **Admin Management**: Separate admin interface for managing products, categories, and orders

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **UI Components**: Comprehensive set of @radix-ui components
- **Styling**: Tailwind CSS with PostCSS processing
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Database Tooling**: Drizzle Kit for schema management and migrations
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Development Server**: Vite dev server with HMR
- **Port Configuration**: Application runs on port 5000

### Production Build
- **Build Process**: Vite builds frontend assets, esbuild bundles server code
- **Static Assets**: Frontend built to `dist/public` directory
- **Server Bundle**: Backend bundled as ESM module to `dist/index.js`
- **Deployment Target**: Replit autoscale deployment

### Database Management
- **Migrations**: Managed through Drizzle Kit
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Connection**: Environment variable based connection string

### File Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express application  
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```