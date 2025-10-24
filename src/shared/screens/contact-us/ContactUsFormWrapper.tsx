import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { Toaster } from '@/shared/ui/atoms/toaster';
import ContactUsForm from './ContactUsForm';

/**
 * Wrapper component for ContactUsForm that provides QueryClientProvider
 * This is needed because Astro's island architecture isolates client components
 */
const ContactUsFormWrapper: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContactUsForm />
      <Toaster />
    </QueryClientProvider>
  );
};

export default ContactUsFormWrapper;
