// src/components/AppWrapper.tsx
import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { ErrorBoundary } from '@/shared/ui/organisms/error-boundary';
import { Toaster } from '@/shared/ui/atoms/toaster';
import { DevToolsGuard } from '@/shared/components/devtools-guard';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          <DevToolsGuard />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default AppWrapper;
