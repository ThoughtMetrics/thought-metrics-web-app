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
      theme="system"
      toastOptions={{
        className: 'toast',
        duration: 4000,
      }}
    />
  );
};
