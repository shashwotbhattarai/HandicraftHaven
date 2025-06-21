# Everest Drishti Crafts E-commerce Platform

A full-stack e-commerce web application showcasing handcrafted artisan products and empowering women makers through storytelling.

## Features

- **Product Catalog**: Browse and search handcrafted products by category
- **Maker Stories**: Inspiring stories of women artisans behind the products
- **Shopping Cart**: Session-based cart with real-time updates
- **Admin Panel**: Complete management system for products, categories, orders, and maker stories
- **Responsive Design**: Mobile-first approach with beautiful UI

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and build
- Tailwind CSS + shadcn/ui components
- Wouter for routing
- TanStack Query for state management

### Backend
- Node.js with Express
- TypeScript with ES modules
- Drizzle ORM with PostgreSQL
- Session-based authentication

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd everest-drishti-crafts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with:
DATABASE_URL=your_postgresql_connection_string
```

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── lib/         # Utilities and hooks
├── server/          # Backend Express application
│   ├── index.ts     # Server entry point
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Data layer
│   └── db.ts        # Database connection
├── shared/          # Shared TypeScript types and schemas
└── migrations/      # Database migration files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking
- `npm run db:push` - Push database schema changes

## Key Features

### Maker Stories
The platform features a dedicated section showcasing the inspiring stories of women artisans, including:
- Personal backgrounds and craft specialties
- Family information and impact statements
- Beautiful photo galleries
- Admin management for story creation and editing

### Admin Dashboard
Comprehensive admin panel with:
- Product and category management
- Order tracking and status updates
- Maker story management
- Real-time analytics (coming soon)

## Database Schema

The application uses PostgreSQL with the following main entities:
- Categories - Product categorization
- Products - Main product catalog
- Orders & Order Items - Order management
- Cart Items - Shopping cart functionality
- Maker Stories - Artisan story showcase
- Hero Images - Homepage carousel

## Deployment

The application is configured for deployment on Replit with autoscaling support. For other platforms:

1. Build the application:
```bash
npm run build
```

2. Set environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

3. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built to support and showcase the incredible work of women artisans
- Inspired by traditional Nepalese crafts and cultural heritage
- Designed with accessibility and mobile-first principles