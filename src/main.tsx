//main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import './styles/variables.css'; // Theme variables first
import './styles/index.css'; // Global styles
import './styles/animations.css'; // Animations

import { register } from 'swiper/element/bundle';
import { ErrorBoundary } from './shared/ui/organisms/error-boundary/index.tsx';
import { AppProvider } from './shared/providers/app-provider.tsx';
import { Toaster } from './shared/ui/atoms/toaster/index.tsx';

register();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
        <Toaster />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>
);
