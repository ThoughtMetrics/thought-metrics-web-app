import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { Toaster } from '@/shared/ui/atoms/toaster';
import ResearchForm from './ResearchForm';

/**
 * Wrapper component for ResearchForm that provides QueryClientProvider
 * This is needed because Astro's island architecture isolates client components
 */
const ResearchFormWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ResearchForm />
      <Toaster />
    </QueryClientProvider>
  );
};

export default ResearchFormWrapper;
