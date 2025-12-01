import type { UserRole } from '@/core/types/user.type';

/**
 * Check if a role is an admin role (admin or super-admin)
 */
export const isAdminRole = (role: UserRole | null | undefined): boolean => {
  return role === 'admin' || role === 'super-admin';
};

/**
 * Check if a role is a super admin role
 */
export const isSuperAdminRole = (role: UserRole | null | undefined): boolean => {
  return role === 'super-admin';
};

/**
 * Get user role from Firebase ID token
 */
export const getUserRoleFromToken = async (
  user: any
): Promise<UserRole | null> => {
  if (!user) return null;

  try {
    const idTokenResult = await user.getIdTokenResult();
    return (idTokenResult.claims.role as UserRole) || 'respondent';
  } catch (error) {
    console.error('Failed to get user role from token:', error);
    return null;
  }
};

/**
 * Check if current page is an admin route
 */
export const isAdminRoute = (pathname?: string): boolean => {
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  return path.startsWith('/admin');
};
