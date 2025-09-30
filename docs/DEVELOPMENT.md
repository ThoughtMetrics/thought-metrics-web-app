# Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- Yarn package manager
- Git
- VS Code (recommended)

### Initial Setup
1. Clone the repository
2. Install dependencies: `yarn install`
3. Copy environment file: `cp .env.example .env`
4. Configure environment variables
5. Start development server: `yarn dev`

## Development Workflow

### 1. Branch Strategy
- `main` - Production-ready code
- `develop` - Development integration branch
- `feature/[name]` - Feature development
- `bugfix/[name]` - Bug fixes
- `hotfix/[name]` - Production hotfixes

### 2. Commit Convention
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(contact): add contact form validation
fix(api): resolve timeout issues in content fetching
docs(readme): update installation instructions
```

### 3. Code Review Process
1. Create feature branch from `develop`
2. Implement changes with tests
3. Run quality checks: `yarn lint` and `yarn test`
4. Submit pull request to `develop`
5. Address review feedback
6. Merge after approval

## Code Standards

### TypeScript Guidelines

#### 1. Type Definitions
```typescript
// Use interfaces for object shapes
interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

// Use types for unions and primitives
type Status = 'loading' | 'success' | 'error';
type UserId = string;
```

#### 2. Component Props
```typescript
// Always define props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick: (event: React.MouseEvent) => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
}) => {
  // Component implementation
};
```

#### 3. API Types
```typescript
// Define API response types
interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

// Use generics for reusable types
interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
```

### React Patterns

#### 1. Component Structure
```typescript
// Component file structure
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// Types
interface ComponentProps {
  // Props definition
}

// Component implementation
export const Component: React.FC<ComponentProps> = (props) => {
  // Hooks
  const queryResult = useQuery({...});

  // Event handlers
  const handleClick = () => {
    // Handler logic
  };

  // Early returns
  if (queryResult.isLoading) {
    return <LoadingSpinner />;
  }

  // Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

#### 2. Custom Hooks
```typescript
// Custom hook for business logic
export const useContentData = (contentId: string) => {
  const [localState, setLocalState] = useState();

  const query = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => ContentService.getContent(contentId),
  });

  const processedData = useMemo(() => {
    return query.data ? processContent(query.data) : null;
  }, [query.data]);

  return {
    data: processedData,
    isLoading: query.isLoading,
    error: query.error,
    // ... other derived state
  };
};
```

#### 3. Context Pattern
```typescript
// Context definition
interface AppContextType {
  user: User | null;
  theme: Theme;
  updateTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  const value = {
    user,
    theme,
    updateTheme: setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook for consuming context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

### Styling Guidelines

#### 1. Tailwind CSS Usage
```typescript
// Use Tailwind classes with clsx for conditional styling
import { clsx } from 'clsx';

const Button = ({ variant, disabled, className, ...props }) => {
  return (
    <button
      className={clsx(
        // Base styles
        'px-4 py-2 rounded-md font-medium transition-colors',
        // Variant styles
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
        },
        // State styles
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        // Additional classes
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
};
```

#### 2. CSS Modules (when needed)
```scss
// component.module.scss
.container {
  @apply flex flex-col gap-4;

  &--loading {
    @apply opacity-50;
  }
}

.title {
  @apply text-2xl font-bold;
  color: var(--primary-color);
}
```

## Testing Strategy

### 1. Test Structure
```
src/
├── __tests__/          # Test setup and utilities
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx
└── hooks/
    └── useContent/
        ├── useContent.ts
        └── useContent.test.ts
```

### 2. Unit Testing with Vitest
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

### 3. Integration Testing
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { ContentList } from './ContentList';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('ContentList Integration', () => {
  it('loads and displays content items', async () => {
    renderWithProviders(<ContentList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Content Item 1')).toBeInTheDocument();
    });
  });
});
```

## API Development

### 1. Service Layer Pattern
```typescript
// services/content.service.ts
import { apiClient } from '@/core/configs/api-config';

export class ContentService {
  static async getContents(params: GetContentsParams): Promise<Content[]> {
    try {
      const response = await apiClient.get<ApiResponse<Content[]>>('/contents', {
        params,
      });
      return response.data.data;
    } catch (error) {
      throw new ApiError('Failed to fetch contents', error);
    }
  }

  static async createContent(data: CreateContentData): Promise<Content> {
    try {
      const response = await apiClient.post<ApiResponse<Content>>('/contents', data);
      return response.data.data;
    } catch (error) {
      throw new ApiError('Failed to create content', error);
    }
  }
}
```

### 2. Query Hook Pattern
```typescript
// hooks/queries/use-contents.query.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ContentService } from '@/services/content.service';
import { queryKeys } from '@/core/lib/query-keys';

export const useContents = (
  params: GetContentsParams,
  options?: UseQueryOptions<Content[], Error>
) => {
  return useQuery({
    queryKey: queryKeys.contents.list(params),
    queryFn: () => ContentService.getContents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
```

### 3. Mutation Hook Pattern
```typescript
// hooks/mutations/use-content.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContentService } from '@/services/content.service';
import { queryKeys } from '@/core/lib/query-keys';

export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ContentService.createContent,
    onSuccess: (newContent) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.all });

      // Optimistic update
      queryClient.setQueryData(
        queryKeys.contents.detail(newContent.id),
        newContent
      );
    },
    onError: (error) => {
      console.error('Failed to create content:', error);
    },
  });
};
```

## Performance Optimization

### 1. Component Optimization
```typescript
import React, { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo<Props>(({ data, onAction }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  // Memoize callbacks
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} data={item} onClick={handleClick} />
      ))}
    </div>
  );
});
```

### 2. Bundle Optimization
```typescript
// Lazy loading for route components
const HomePage = lazy(() => import('@/pages/home'));
const ContactPage = lazy(() => import('@/pages/contact-us'));

// Code splitting for heavy libraries
const HeavyChart = lazy(() =>
  import('./HeavyChart').then(module => ({ default: module.HeavyChart }))
);
```

### 3. Query Optimization
```typescript
// Prefetch related data
const usePrefetchRelatedContent = (contentId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.contents.related(contentId),
      queryFn: () => ContentService.getRelatedContent(contentId),
      staleTime: 10 * 60 * 1000,
    });
  }, [contentId, queryClient]);
};
```

## Debugging and Development Tools

### 1. Browser Extensions
- React Developer Tools
- TanStack Query Devtools
- Redux DevTools (if using Redux)

### 2. VS Code Extensions
- TypeScript Importer
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag

### 3. Development Scripts
```json
{
  "scripts": {
    "dev": "vite --host --port 4200",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## Troubleshooting Common Issues

### 1. Build Issues
- Clear node_modules and yarn.lock, reinstall
- Check TypeScript errors with `yarn type-check`
- Verify environment variables are set

### 2. Runtime Issues
- Check browser console for errors
- Verify API endpoints are accessible
- Check network requests in DevTools

### 3. Performance Issues
- Use React Profiler to identify slow components
- Check bundle size with `yarn build --analyze`
- Optimize images and assets

---

Happy coding! 🚀