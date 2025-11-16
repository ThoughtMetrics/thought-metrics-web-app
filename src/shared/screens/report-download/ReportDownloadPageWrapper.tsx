import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import ReportDownloadPage from './ReportDownloadPage';

/**
 * Wrapper component for ReportDownloadPage that provides QueryClientProvider
 * This is needed because Astro's island architecture isolates client components
 */
const ReportDownloadPageWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportDownloadPage />
    </QueryClientProvider>
  );
};

export default ReportDownloadPageWrapper;
