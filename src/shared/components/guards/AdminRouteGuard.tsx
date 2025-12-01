import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { AuthProvider, useAuth } from '@/shared/providers/auth-provider';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

/**
 * AdminRouteGuard - Internal component that checks auth
 */
const AdminRouteGuardInternal: React.FC<AdminRouteGuardProps> = ({
  children,
  requireSuperAdmin = false
}) => {
  const { user, isAuthReady, isAdmin, isSuperAdmin } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('[AdminRouteGuard] Auth state:', {
      isAuthReady,
      hasUser: !!user,
      isAdmin,
      isSuperAdmin,
      requireSuperAdmin
    });

    if (!isAuthReady) {
      console.log('[AdminRouteGuard] Waiting for auth to be ready...');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('[AdminRouteGuard] User not authenticated, redirecting to login');
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // Check if user has required permissions
    const hasAccess = requireSuperAdmin ? isSuperAdmin : isAdmin;

    console.log('[AdminRouteGuard] Access check:', {
      requireSuperAdmin,
      isAdmin,
      isSuperAdmin,
      hasAccess
    });

    if (!hasAccess) {
      console.log('[AdminRouteGuard] User lacks required permissions, redirecting to unauthorized');
      window.location.href = '/unauthorized';
      return;
    }

    console.log('[AdminRouteGuard] Access granted, rendering content');
    setIsChecking(false);
  }, [user, isAuthReady, isAdmin, isSuperAdmin, requireSuperAdmin]);

  // Show loading state while checking auth
  if (!isAuthReady || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

/**
 * AdminRouteGuard - Public component with providers
 *
 * Protects routes that should only be accessible by admins or super admins.
 * Includes its own AuthProvider and QueryClientProvider for isolated usage.
 *
 * @param children - Content to render if user is authorized
 * @param requireSuperAdmin - If true, only super admins can access (default: false)
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  requireSuperAdmin = false
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
