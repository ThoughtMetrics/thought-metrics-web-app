import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';

interface UserRouteGuardProps {
  children: React.ReactNode;
}

/**
 * UserRouteGuard
 *
 * Protects routes that require authentication (any logged-in user).
 * Redirects unauthenticated users to the login page.
 *
 * @param children - Content to render if user is authenticated
 */
export const UserRouteGuard: React.FC<UserRouteGuardProps> = ({ children }) => {
  const { user, isAuthReady } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log('[UserRouteGuard] Auth state:', {
      isAuthReady,
      hasUser: !!user,
    });

    if (!isAuthReady) {
      console.log('[UserRouteGuard] Waiting for auth to be ready...');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.log('[UserRouteGuard] User not authenticated, redirecting to login');
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    console.log('[UserRouteGuard] User authenticated:', user.email);
    setIsChecking(false);
  }, [user, isAuthReady]);

  // Show loading state while checking auth
  if (!isAuthReady || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default UserRouteGuard;
