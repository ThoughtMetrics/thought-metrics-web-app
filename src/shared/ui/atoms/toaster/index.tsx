import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toast notification component using Sonner
 * Add this to your main App component
 */
export const Toaster: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'white',
          border: '1px solid #e2e8f0',
          color: '#1f2937',
        },
        className: 'toast',
        duration: 4000,
      }}
    />
  );
};
