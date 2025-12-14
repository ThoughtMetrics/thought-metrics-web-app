import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';

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

  // Check if running on localhost (development mode)
  const isLocalhost = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('192.168.'));

  useEffect(() => {
    // Bypass authentication in local development
    if (isLocalhost) {
      console.debug('[UserRouteGuard] Local development detected - bypassing auth checks');
      setIsChecking(false);
      return;
    }

    console.debug('[UserRouteGuard] Auth state:', {
      isAuthReady,
      hasUser: !!user,
    });

    if (!isAuthReady) {
      console.debug('[UserRouteGuard] Waiting for auth to be ready...');
      return;
    }

    // Check if user is authenticated
    if (!user) {
      console.debug('[UserRouteGuard] User not authenticated, redirecting to login');
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    setIsChecking(false);
  }, [user, isAuthReady, isLocalhost]);

  // Show loading state while checking auth (skip in local development)
  if (!isLocalhost && (!isAuthReady || isChecking)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoaderUI message="Loading..." />
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default UserRouteGuard;
