import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider } from '@/shared/providers/auth-provider';
import TrackingLinkForm from './TrackingLinkForm';

/**
 * Wrapper component for TrackingLinkForm that provides QueryClientProvider and AuthProvider
 * This is needed because Astro's island architecture isolates client components
 */
const TrackingLinkFormWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TrackingLinkForm />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default TrackingLinkFormWrapper;
