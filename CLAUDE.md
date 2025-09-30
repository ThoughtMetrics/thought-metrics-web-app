# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
```bash
# Start development server (runs on http://localhost:4200)
yarn dev

# Build for production
yarn build

# Run tests with verbose output
yarn test

# Lint code
yarn lint

# Preview production build locally
yarn preview

# Serve production build
yarn serve

# Build with static site generation
yarn build:ssg
```

### Docker Commands
```bash
# Build Docker image
yarn docker:build

# Run Docker container (uses .env.docker)
yarn docker:run
```

## Architecture Overview

### Project Structure

**Core Directory (`src/core/`)**
- `configs/` - Runtime API configuration with dual support for build-time env vars and runtime `window.__APP_CONFIG__`
- `hooks/` - React hooks organized by purpose:
  - `queries/` - TanStack Query hooks for data fetching
  - `mutations/` - TanStack Query hooks for data mutations
  - `validation/` - Form validation hooks
- `lib/` - Core libraries including query client and query key factory
- `stores/` - Zustand stores for global state management
- `types/` - TypeScript type definitions
- `utils/` - Utility functions

**Services Layer (`src/services/`)**
Two separate service architectures:
- `api/` - Custom API service using native `fetch` API (for backend at `VITE_BASE_URL`)
- `strapi-api/` - Strapi CMS service using Axios (for CMS at `VITE_STRAPI_API_URL`)

**Pages (`src/pages/`)**
- Each page directory contains page components and sub-pages
- Nested routes use React Router's outlet pattern
- Major sections: home, industries, capabilities, research-methods, resources, contact-us, landing pages

**Shared (`src/shared/`)**
- `components/` - Reusable components including Layout, LandingLayout, InteractionLayout
- `providers/` - React context providers (AppProvider wraps app with QueryClientProvider)
- `ui/` - Base UI components organized by atomic design pattern

### Routing Architecture

Routes are defined in `src/routes/index.tsx` using `createBrowserRouter`:
- Main layout routes (`<Layout />`) - Standard pages with header/footer
- Landing layout routes (`<LandingLayout />`) - Special landing pages (respondent_landing, advocate_landing)
- Interaction layout routes (`<InteractionLayout />`) - Auth-related pages
- Nested routes use React Router DOM 7.7.0 with outlets

### API Architecture

**Dual API System:**

1. **Backend API** (`ApiService` in `src/services/api/api.service.ts`):
   - Uses native Fetch API
   - Base URL: `{VITE_BASE_URL}/api/{VITE_BASE_API_VERSION}`
   - Custom error handling with `ApiError` class
   - Used for contact-us and other backend operations

2. **Strapi CMS API** (`StrapiService` in `src/services/strapi-api/strapi.service.ts`):
   - Uses Axios with interceptors
   - Base URL: `{VITE_STRAPI_API_URL}/api`
   - Handles authentication tokens from localStorage or env
   - Query string building with `qs` library
   - Used for content management (blogs, resources)

**Content Service** (`ContentService` extends `StrapiService`):
- Comprehensive filtering: type, category, tags, date ranges, search
- Blog content transformation for UI consumption
- Optimal image format selection (medium > small > thumbnail > original)
- Related content discovery based on tags/type/category

### State Management

**TanStack Query (React Query)**:
- Primary data fetching and server state management
- Query keys organized in `src/core/lib/query-keys.ts` using factory pattern
- DevTools enabled in development mode
- Example query key structure: `['contents', 'list', { filters }]`

**Zustand Stores**:
- Used for client-side global state
- Located in `src/core/stores/`
- Examples: content.store.ts, contact-us.store.ts

### Path Aliases (Configured in vite.config.ts and tsconfig)
```
@/ → src/
@assets → src/assets/
@hooks → src/core/hooks/
@types → src/core/types/
@utils → src/core/utils/
@pages → src/pages/
@services → src/services/
@interfaces → src/core/interfaces/
@ui → src/shared/ui/
@components → src/shared/components/
```

### Environment Configuration

**Runtime Configuration:**
The app supports runtime environment variable injection via `window.__APP_CONFIG__` (see `src/core/configs/api-config.ts`). This allows environment variables to be set at container startup via Docker's `entrypoint.sh`.

**Required Environment Variables:**
```env
PORT=4200                                    # Dev server port
NODE_ENV=development                         # Environment
VITE_BASE_URL=http://localhost:3000         # Backend API URL
VITE_BASE_API_VERSION=v1                    # API version
VITE_STRAPI_API_URL=http://localhost:1337   # Strapi CMS URL
VITE_SITE_URL=https://thoughtmetrics.com    # Production site URL
```

### Styling System

- **Tailwind CSS 4.1.11** - Primary styling framework with Vite plugin
- **SCSS** - Preprocessor with global imports (variables.css, animations.css)
- **CSS Modules** - Scoped styling with `[local]__[hash:base64:5]` naming
- **SVG Components** - SVGR plugin transforms SVGs to React components (removes dimensions and fill/stroke attrs)

### Testing

- **Vitest** with jsdom environment
- Setup file: `src/__tests__/setup.ts`
- Test files: `src/__test__/` directory
- Run with `yarn test` for verbose output

### Build Configuration

**Vite Build:**
- Output directory: `dist/`
- Source maps enabled for debugging
- Manual chunking strategy:
  - `vendor` chunk: react, react-dom
  - `router` chunk: react-router-dom

**Docker Multi-stage Build:**
1. Builder stage: Node 20 Alpine, installs deps with `yarn install --frozen-lockfile`, builds app
2. Production stage: Nginx Alpine, copies built assets and config, runs entrypoint.sh for runtime env injection

### Important Implementation Details

**Content Fetching Pattern:**
When fetching blog/resource content, use the `useBlogContentsQuery` hook which returns pre-formatted data with:
- Transformed image URLs (optimal format selection)
- Resource links (`/resources/{slug}`)
- Structured blog items ready for UI rendering

**API Configuration Pattern:**
`getAPIConfig()` checks both `import.meta.env` and `window.__APP_CONFIG__` to support both build-time and runtime configuration. This enables the same Docker image to run in multiple environments.

**Query Key Factory Pattern:**
Always use `QueryKeys` from `src/core/lib/query-keys.ts` for consistent cache keys. This ensures proper cache invalidation and data synchronization.

## Development Guidelines

### When Adding New API Endpoints:
1. Determine if it belongs to backend API or Strapi CMS
2. Extend appropriate service class (ApiService or StrapiService)
3. Create corresponding query hooks in `src/core/hooks/queries/`
4. Add query keys to `QueryKeys` factory

### When Adding New Routes:
1. Create page component in `src/pages/`
2. Add route definition in `src/routes/index.tsx`
3. Choose appropriate layout (Layout, LandingLayout, or InteractionLayout)

### When Adding New Global State:
1. Use TanStack Query for server state
2. Use Zustand stores (in `src/core/stores/`) for client-side state
3. Avoid prop drilling by leveraging React Query's cache

### Package Manager:
Always use **Yarn** for package management (not npm). Lock file: `yarn.lock`