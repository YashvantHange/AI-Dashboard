# ADmyBRAND Insights - Digital Marketing Analytics Dashboard

## Overview

This is a modern AI-powered analytics dashboard designed for digital marketing agencies. The application features a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database. It provides comprehensive analytics for marketing campaigns, user tracking, conversion optimization, and platform integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot module replacement with Vite integration
- **Storage**: In-memory storage with interface for easy database migration

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **Connection**: Neon Database serverless connection
- **Schema**: Defined in shared TypeScript files with Drizzle
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Database Schema
The application uses four main entities:
- **Campaigns**: Marketing campaign information including budgets, channels, and performance data
- **Tasks**: Scheduled campaign optimization and management tasks
- **Metrics**: Performance tracking data including revenue, user count, conversion rates, and growth metrics
- **API Integrations**: External service connections for marketing platforms, analytics tools, and automation services

### Frontend Pages
- **Dashboard**: Overview with key metrics cards (Revenue, Users, Conversions, Growth %), interactive charts, and recent activity
- **Campaigns**: Marketing campaign management with CRUD operations and performance tracking
- **Audience**: Task management for campaign optimization and audience engagement
- **Analytics**: Detailed performance analysis with interactive charts and data visualization
- **Integrations**: Configuration for external marketing platform connections

### Shared Components
- **Layout**: Main layout with responsive sidebar navigation
- **UI Components**: Comprehensive design system using shadcn/ui
- **Charts**: Data visualization using Recharts library
- **Forms**: Validated forms with consistent styling and error handling

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express.js backend handles routing and validation
3. Drizzle ORM manages database operations
4. Zod schemas ensure type safety across the stack

### State Management
- Server state managed by TanStack Query with caching
- UI state handled by React's built-in state management
- Form state managed by React Hook Form
- Theme state persisted in localStorage

### Error Handling
- Centralized error handling in Express middleware
- Client-side error boundaries and toast notifications
- Validation errors displayed inline on forms

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-kit for database operations
- **Validation**: zod for schema validation
- **UI**: @radix-ui components for accessibility
- **Charts**: recharts for data visualization
- **Date Handling**: date-fns for date manipulation
- **HTTP Client**: Built-in fetch with custom wrapper

### Development Tools
- **Build**: Vite with React plugin
- **TypeScript**: Full type safety across the stack
- **ESLint/Prettier**: Code quality and formatting
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

### Build Process
1. Frontend builds to `dist/public` directory
2. Backend bundles to `dist/index.js` using esbuild
3. Static files served by Express in production
4. Environment variables manage database connections

### Environment Configuration
- **Development**: Uses Vite dev server with HMR
- **Production**: Express serves built React app
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Database Management
- Schema changes managed through Drizzle migrations
- `db:push` script for development schema updates
- Production migrations handled through Drizzle Kit

## Recent Changes (Jan 30, 2025)

- **Rebranded Application**: Transformed from financial advisor CRM to "ADmyBRAND Insights" digital marketing analytics dashboard
- **Updated Navigation**: Changed menu items to reflect marketing focus (Campaigns, Audience, Integrations)
- **Enhanced Dashboard Components**: Created revenue trends chart, campaign distribution chart, recent campaigns widget, and platform integrations panel
- **Marketing-Focused Data**: Updated sample data to reflect marketing campaigns, budgets, and performance metrics
- **UI Improvements**: Added modern animations, enhanced color scheme, and improved responsive design
- **Fixed LSP Diagnostics**: Resolved all TypeScript errors and form validation issues

The application is designed with scalability in mind, using a modular architecture that allows for easy expansion of marketing features and integration with additional advertising platforms and analytics tools.