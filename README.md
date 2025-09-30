# Thought Metrics Website

A modern React web application built with Vite, TypeScript, and Tailwind CSS for Thought Metrics - a platform providing research insights and data analytics services.

## 🚀 Tech Stack

- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.11 + SCSS
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack React Query 5.85.5 + Axios
- **Routing**: React Router DOM 7.7.0
- **UI Components**: Custom components with Swiper integration
- **Testing**: Vitest 3.2.4
- **Linting**: ESLint + Prettier
- **Package Manager**: Yarn

## 📁 Project Structure

```
src/
├── core/                    # Core application logic
│   ├── configs/            # API and app configurations
│   ├── constants/          # Application constants
│   ├── hooks/              # Custom React hooks
│   │   ├── mutations/      # TanStack Query mutations
│   │   ├── queries/        # TanStack Query queries
│   │   └── validation/     # Form validation hooks
│   ├── lib/                # Utility libraries
│   ├── stores/             # Zustand state stores
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── pages/                   # Page components
│   ├── home/               # Homepage
│   ├── contact-us/         # Contact page
│   ├── resources/          # Resources section
│   ├── capabilities/       # Capabilities page
│   ├── industries/         # Industries page
│   └── [other-pages]/      # Other application pages
├── shared/                  # Shared components and providers
│   ├── components/         # Reusable components
│   ├── providers/          # React context providers
│   └── ui/                 # Base UI components
├── services/               # API service layers
├── routes/                 # Routing configuration
├── assets/                 # Static assets
└── styles/                 # Global styles and themes
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+ (recommended: use LTS version)
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thought-metrics-web-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Configure the environment variables:
   - `PORT=4200` - Development server port
   - `VITE_BASE_URL` - Backend API base URL
   - `VITE_STRAPI_API_URL` - Strapi CMS API URL
   - `VITE_SITE_URL` - Production site URL

4. **Start development server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:4200`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server on port 4200 |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build |
| `yarn test` | Run test suite with Vitest |
| `yarn lint` | Run ESLint for code quality |
| `yarn serve` | Serve production build locally |
| `yarn build:ssg` | Build with static site generation |

## 🌐 Environment Configuration

The application uses environment variables for configuration:

```env
PORT=4200                                    # Dev server port
NODE_ENV=development                         # Environment
VITE_BASE_URL=http://localhost:3000         # Backend API
VITE_BASE_API_VERSION=v1                    # API version
VITE_STRAPI_API_URL=http://localhost:1337   # Strapi CMS
VITE_SITE_URL=https://thoughtmetrics.com    # Production URL
```

## 🏗️ Architecture & Features

### State Management
- **Zustand** for global state management
- **TanStack React Query** for server state and caching
- Custom hooks for business logic

### Styling
- **Tailwind CSS** with custom configuration
- **SCSS** support for complex styling
- **CSS Modules** with scoped naming
- **SVG** components with SVGR

### Path Aliases
The project uses TypeScript path aliases for cleaner imports:
- `@/` → `src/`
- `@assets/` → `src/assets/`
- `@hooks/` → `src/core/hooks/`
- `@types/` → `src/core/types/`
- `@utils/` → `src/core/utils/`
- `@pages/` → `src/pages/`
- `@services/` → `src/services/`
- `@interfaces/` → `src/core/interfaces/`
- `@ui/` → `src/shared/ui/`
- `@components/` → `src/shared/components/`

## 🐳 Docker Support

The application includes Docker support for containerized deployment:

```bash
# Build image
docker build -t thought-metrics-web .

# Run container
docker run -p 4200:4200 thought-metrics-web
```

The Docker setup uses:
- **Multi-stage build** for optimized image size
- **Node.js 20 Alpine** for building
- **Nginx Alpine** for serving
- **Custom nginx configuration**

## 🚀 Deployment

### Production Build
```bash
yarn build
```

### Azure Pipelines
The project includes Azure Pipelines configuration (`azure-pipelines.yml`) for CI/CD.

### Static Site Generation
```bash
yarn build:ssg
```

## 🧪 Testing

- **Vitest** for unit and integration tests
- **jsdom** environment for DOM testing
- Test files located in `src/__test__/`

Run tests:
```bash
yarn test
```

## 🔧 Development Tools

- **ESLint** with TypeScript support
- **Prettier** for code formatting
- **Vite** with SWC for fast builds
- **Hot Module Replacement** for development
- **Source maps** for debugging

## 📱 Browser Support

- Modern browsers with ES2020+ support
- Mobile-responsive design
- Progressive enhancement approach

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Write tests for new features
3. Run linting before committing: `yarn lint`
4. Ensure builds pass: `yarn build`

## 📄 License

[License information to be added]

---

**Thought Metrics** - Empowering decisions through data insights