import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

/**
 * AdminRouteGuard - Internal component that checks auth
 */
const AdminRouteGuardInternal: React.FC<AdminRouteGuardProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  const { user, isAuthReady, isAdmin, isSuperAdmin, isFieldIncharge } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Check if running on localhost (development mode)
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('192.168.'));

  useEffect(() => {
    // Always wait for Firebase auth to restore the session
    if (!isAuthReady) {
      console.debug('[AdminRouteGuard] Waiting for auth to be ready...');
      return;
    }

    // In local development, skip role enforcement but still need auth ready
    if (isLocalhost) {
      setIsChecking(false);
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.debug(
        '[AdminRouteGuard] User not authenticated, redirecting to login'
      );
      window.location.href =
        '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // Check if user has required permissions
    const hasAccess = requireSuperAdmin ? isSuperAdmin : (isAdmin || isFieldIncharge);

    if (!hasAccess) {
      console.debug(
        '[AdminRouteGuard] User lacks required permissions, redirecting to unauthorized'
      );
      window.location.href = '/unauthorized';
      return;
    }

    console.debug('[AdminRouteGuard] Access granted, rendering content');
    setIsChecking(false);
  }, [user, isAuthReady, isAdmin, isSuperAdmin, isFieldIncharge, requireSuperAdmin, isLocalhost]);

  // Show loading state while checking auth
  if (!isAuthReady || isChecking) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <LoaderUI message="Verifying access..." />
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

/**
 * AdminRouteGuard - Public component with providers (Astro Island)
 *
 * Protects routes that should only be accessible by admins or super admins.
 * IMPORTANT: Includes its own AuthProvider because it's a separate Astro island.
 * Each client:only="react" component in Astro is isolated and cannot share React context.
 *
 * @param children - Content to render if user is authorized
 * @param requireSuperAdmin - If true, only super admins can access (default: false)
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  requireSuperAdmin = false,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminRouteGuardInternal requireSuperAdmin={requireSuperAdmin}>
          {children}
        </AdminRouteGuardInternal>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AdminRouteGuard;
