# Elevator Structure Viewer

## Overview

This is a Korean-language web application for viewing elevator safety standards and inspection requirements. The application displays an interactive elevator structure diagram with clickable hotspots that reveal detailed safety standards for different elevator components (machine room, shaft, car interior, and pit). Built as a full-stack TypeScript application using React with Vite on the frontend and Express with Drizzle ORM on the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React with TypeScript, using Vite as the build tool and development server
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration, using CSS variables for theming

**Design Decisions**
- Uses shadcn/ui "new-york" style variant for consistent component design patterns
- Implements a Korean-first UI with fonts specifically chosen for technical content (Roboto Mono) and UI elements (Inter)
- Component-based architecture with reusable UI primitives from Radix UI
- Animation removed (framer-motion dependency noted as removed in package.json)

**Key Frontend Features**
- Interactive elevator diagram with positioning-based hotspots
- Real-time search and filtering of safety standards
- Responsive design with mobile considerations
- Admin mode for editing standards, categories, and hotspots

### Backend Architecture

**Technology Stack**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for HTTP server
- **Database**: PostgreSQL via Neon serverless with WebSocket support
- **ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas (via drizzle-zod) for request validation

**Design Decisions**
- Separate development and production entry points (`index-dev.ts` and `index-prod.ts`)
- Development mode uses Vite middleware for HMR and serves client-side code
- Production mode serves pre-built static assets from dist/public directory
- RESTful API design with standard CRUD operations
- Storage layer abstraction through IStorage interface for potential future flexibility

**API Structure**
- `/api/categories` - CRUD operations for elevator component categories
- `/api/standards` - CRUD operations for safety standards (filterable by category)
- `/api/hotspots` - CRUD operations for interactive diagram hotspots

### Database Architecture

**Schema Design**
- **users**: User authentication (currently defined but not actively used in routes)
- **categories**: Top-level groupings for elevator components (machine room, shaft, car, pit)
  - Includes key, title, and description fields
  - Uses auto-incrementing serial IDs
- **standards**: Individual safety regulations and inspection requirements
  - References categories via foreign key with cascade delete
  - Stores standard number, title, body text, optional image URL, and date fields
- **hotspots**: Interactive points on the elevator diagram
  - Stores label and CSS positioning (top/left percentages)
  - References categories via foreign key with cascade delete

**Data Seeding**
- Initial data defined in `ELEVATOR_DATA` constant in client code
- Seed script clears existing data and repopulates from hardcoded data structure
- Includes 5 default hotspots with predefined positions

**Architectural Decisions**
- Uses PostgreSQL for relational data with strong consistency requirements
- Cascade deletes ensure referential integrity when categories are removed
- Timestamp tracking on all entities for audit purposes
- Schema generated via Drizzle Kit from TypeScript definitions

### Build and Deployment

**Development Workflow**
- Client runs on Vite dev server (port 5000) with HMR
- Server runs with tsx for TypeScript execution without compilation
- Vite serves client code through Express middleware in development

**Production Build**
- Client builds to `dist/public` using Vite
- Server bundles to `dist/index.js` using esbuild with ESM output
- Static file serving from Express for client assets
- SPA fallback to index.html for client-side routing

**Replit-Specific Features**
- Custom Vite plugin for updating OpenGraph meta tags with Replit deployment URLs
- Development-only Replit plugins (cartographer, dev-banner) for enhanced DX
- Runtime error overlay plugin for better debugging

## External Dependencies

### Database Service
- **Neon Serverless PostgreSQL**: Serverless PostgreSQL with WebSocket connection support
- Requires `DATABASE_URL` environment variable
- Uses connection pooling via `@neondatabase/serverless`

### UI Component Libraries
- **Radix UI**: Headless, accessible component primitives (30+ components including Dialog, Dropdown, Tooltip, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **Vite Plugins**: Custom plugins for Replit integration and meta tag management
- **TypeScript**: Static typing across the entire stack

### Build and Runtime
- **esbuild**: Fast bundler for production server code
- **tsx**: TypeScript execution for development server
- **Wouter**: Minimal client-side routing
- **TanStack Query**: Server state management with caching and optimistic updates