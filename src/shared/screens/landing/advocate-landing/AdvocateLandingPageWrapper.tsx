import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import AdvocateLandingPage from './AdvocateLandingPage';

/**
 * Wrapper component for AdvocateLandingPage that provides QueryClientProvider
 * This is needed because Astro's island architecture isolates client components
 * The page includes PartnershipForm which uses React Query mutations
 */
const AdvocateLandingPageWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdvocateLandingPage />
    </QueryClientProvider>
  );
};

export default AdvocateLandingPageWrapper;
