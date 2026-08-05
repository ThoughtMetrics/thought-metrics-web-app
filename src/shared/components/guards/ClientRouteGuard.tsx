import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

interface ClientRouteGuardProps {
  children: React.ReactNode;
}

const ClientRouteGuardInternal: React.FC<ClientRouteGuardProps> = ({ children }) => {
  const { user, isAuthReady, isRoleReady, isClient } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('192.168.'));

  useEffect(() => {
    if (!isAuthReady) return;

    if (isLocalhost) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // isClient comes from an async custom-claims fetch that resolves
    // separately from (and later than) isAuthReady — wait for isRoleReady
    // too, or a real client gets bounced to /unauthorized because that
    // flag just hasn't been fetched yet.
    if (!isRoleReady) return;

    if (!isClient) {
      window.location.href = '/unauthorized';
      return;
    }

    setIsChecking(false);
  }, [user, isAuthReady, isRoleReady, isClient, isLocalhost]);

  if (!isAuthReady || (!isLocalhost && !isRoleReady) || isChecking) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <LoaderUI message="Verifying access..." />
      </div>
    );
  }

  return <>{children}</>;
};

export const ClientRouteGuard: React.FC<ClientRouteGuardProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ClientRouteGuardInternal>
          {children}
        </ClientRouteGuardInternal>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ClientRouteGuard;
