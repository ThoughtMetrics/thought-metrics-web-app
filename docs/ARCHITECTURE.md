# Architecture Documentation

## Overview

The Thought Metrics Web Application follows a modern React architecture with clear separation of concerns, leveraging TypeScript for type safety and Vite for optimal development experience.

## Core Architecture Principles

### 1. Feature-Based Organization
- Pages are organized by business functionality
- Each page contains its own components and logic
- Shared components are centralized in `src/shared/`

### 2. Layered Architecture
```
┌─────────────────┐
│   Presentation  │ ← Pages & Components
├─────────────────┤
│   Business      │ ← Hooks & Stores
├─────────────────┤
│   Data Access   │ ← Services & API
├─────────────────┤
│   Infrastructure│ ← Utils & Config
└─────────────────┘
```

### 3. Unidirectional Data Flow
- State flows down through props
- Actions flow up through callbacks
- Global state managed through Zustand
- Server state handled by TanStack Query

## Directory Structure Details

### `/src/core/` - Core Application Logic

**Purpose**: Contains the business logic and foundational elements of the application.

#### `/configs/`
- API endpoint configurations
- Application-wide settings
- Environment-specific configurations

#### `/constants/`
- SEO constants and metadata
- Application-wide constant values
- Configuration constants

#### `/hooks/`
Organized by functionality:
- **`/mutations/`**: TanStack Query mutation hooks for data modification
- **`/queries/`**: TanStack Query hooks for data fetching
- **`/validation/`**: Form validation logic hooks
- **Root hooks**: Business logic and utility hooks

#### `/lib/`
- Query client configuration
- Query key definitions
- Third-party library configurations

#### `/stores/`
- Zustand store definitions
- Global state management
- Client-side data persistence

#### `/types/`
- TypeScript type definitions
- Interface declarations
- Type utilities

#### `/utils/`
- Utility functions
- Helper methods
- Common algorithms

### `/src/pages/` - Application Pages

Each page directory contains:
- `index.tsx` - Main page component
- `components/` - Page-specific components
- `hooks/` - Page-specific business logic (if any)

**Current Pages:**
- `home/` - Landing page
- `contact-us/` - Contact form and information
- `resources/` - Resource library and blog
- `capabilities/` - Service capabilities
- `industries/` - Industry-specific information
- `auth/` - Authentication pages
- `errors/` - Error handling pages

### `/src/shared/` - Shared Components & Providers

#### `/components/`
- Reusable business components
- Complex component compositions
- Feature-specific shared components

#### `/providers/`
- React Context providers
- Global state providers
- Third-party provider wrappers

#### `/ui/`
- Base UI components
- Design system components
- Primitive components

### `/src/services/` - Data Layer
- API service classes
- HTTP client configurations
- External service integrations

### `/src/routes/` - Routing Configuration
- Route definitions
- Route guards
- Navigation utilities

### `/src/assets/` - Static Assets
- Images and icons
- Fonts
- Static files
- Asset exports

### `/src/styles/` - Styling
- Global CSS/SCSS files
- Theme definitions
- Animation definitions
- Variable declarations

## State Management Strategy

### 1. Local Component State
- Use `useState` for simple component-local state
- Use `useReducer` for complex local state logic

### 2. Global Client State (Zustand)
- User preferences and settings
- UI state that persists across routes
- Application-wide flags and configurations

**Store Structure:**
```typescript
// Example: contact-us.store.ts
interface ContactUsStore {
  formData: ContactFormData;
  isSubmitting: boolean;
  setFormData: (data: Partial<ContactFormData>) => void;
  submitForm: () => Promise<void>;
}
```

### 3. Server State (TanStack Query)
- API data fetching and caching
- Optimistic updates
- Background refetching
- Error handling

**Query Organization:**
```typescript
// Queries: Data fetching
const useContents = () => useQuery({...});
const useBlogContents = () => useQuery({...});

// Mutations: Data modification
const useCreateContent = () => useMutation({...});
const useContactUs = () => useMutation({...});
```

## Data Flow Patterns

### 1. Query Pattern (Read Operations)
```
Component → Query Hook → API Service → External API
    ↑                                        ↓
    └──────── Cached Data ←──── TanStack Query
```

### 2. Mutation Pattern (Write Operations)
```
Component → Mutation Hook → API Service → External API
    ↑                                        ↓
    └──────── Optimistic Update ←─── TanStack Query
```

### 3. Form Handling Pattern
```
Form Component → Validation Hook → Store/Mutation → API
       ↑                                    ↓
       └────────── Form State ←─────────────┘
```

## Component Architecture

### 1. Component Hierarchy
```
Page Component
├── Layout Components
├── Feature Components
│   ├── UI Components
│   └── Business Logic Hooks
└── Shared Components
```

### 2. Component Categories

**Page Components** (`/pages/`)
- Route-level components
- Compose feature components
- Handle page-level state and effects

**Feature Components** (`/shared/components/`)
- Business logic components
- Integrate with stores and APIs
- Contain domain-specific logic

**UI Components** (`/shared/ui/`)
- Presentational components
- No business logic
- Reusable across features

### 3. Props Pattern
```typescript
// Component Props Interface
interface ComponentProps {
  // Data props
  data: DataType;

  // Behavior props
  onAction: (data: ActionData) => void;

  // Configuration props
  variant?: 'primary' | 'secondary';
  disabled?: boolean;

  // Style props (minimal)
  className?: string;
}
```

## API Integration

### 1. Service Layer Structure
```typescript
// Base API configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // ... configuration
});

// Service class pattern
export class ContentService {
  static async getContents(params: GetContentsParams) {
    const response = await apiClient.get('/contents', { params });
    return response.data;
  }
}
```

### 2. Query Integration
```typescript
// Query hook with service integration
export const useContents = (params: GetContentsParams) => {
  return useQuery({
    queryKey: ['contents', params],
    queryFn: () => ContentService.getContents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 3. Error Handling
- Global error boundaries
- Query-specific error handling
- User-friendly error messages
- Retry mechanisms

## Performance Considerations

### 1. Code Splitting
- Route-based splitting via React Router
- Dynamic imports for heavy components
- Bundle analysis with Vite

### 2. Caching Strategy
- TanStack Query for server state caching
- Browser caching for static assets
- Service worker for offline support (if implemented)

### 3. Optimization Techniques
- React.memo for expensive components
- useMemo/useCallback for expensive computations
- Virtual scrolling for large lists (Swiper integration)

## Build and Deployment

### 1. Build Process
```
TypeScript → Vite → Bundled Assets
     ↓           ↓         ↓
Type Check → Tree Shake → Optimize
```

### 2. Docker Strategy
- Multi-stage builds for optimization
- Nginx for serving static files
- Environment variable injection

### 3. CI/CD Integration
- Azure Pipelines for automated deployment
- Build verification and testing
- Environment-specific deployments

## Security Considerations

### 1. Environment Variables
- All sensitive data in environment variables
- No hardcoded secrets in codebase
- Runtime environment variable injection

### 2. API Security
- CORS configuration
- API token handling
- Input validation and sanitization

### 3. Content Security
- XSS prevention
- Safe HTML rendering
- Secure routing patterns

## Development Guidelines

### 1. TypeScript Usage
- Strict type checking enabled
- Interface-first development
- Generic types for reusability

### 2. Testing Strategy
- Unit tests for utility functions
- Integration tests for API interactions
- Component testing with Vitest

### 3. Code Quality
- ESLint for code consistency
- Prettier for formatting
- Pre-commit hooks for quality gates

---

This architecture provides a scalable foundation for the Thought Metrics web application while maintaining developer productivity and code maintainability.