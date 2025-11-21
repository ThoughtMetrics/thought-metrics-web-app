import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { useHashScroll } from '@/core/hooks/use-hash-scroll';
import AdvocateLandingPage from './AdvocateLandingPage';

/**
 * Wrapper component for AdvocateLandingPage that provides QueryClientProvider
 * This is needed because Astro's island architecture isolates client components
 * The page includes PartnershipForm which uses React Query mutations
 * Also handles auto-scroll to hash anchors (e.g., #advocate-forms)
 */
const AdvocateLandingPageWrapper: React.FC = () => {
  // Enable auto-scroll to hash anchor on page load
  useHashScroll();

  return (
    <QueryClientProvider client={queryClient}>
      <AdvocateLandingPage />
    </QueryClientProvider>
  );
};

export default AdvocateLandingPageWrapper;
