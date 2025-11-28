import { useEffect } from 'react';
import authService from '@/services/api/auth.service';
import { toast } from 'sonner';
import { getAuthErrorDetails } from '@/core/utils/firebase-error-handler';

/**
 * Dedicated component to handle OAuth redirects
 * Must be rendered ONLY on client-side to properly handle redirect results
 */
const AuthRedirectHandler: React.FC = () => {
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await authService.handleRedirectResult();

        if (result) {
          toast.success('Sign in successful!', {
            description: `Welcome back, ${result.profile?.displayName ?? result.profile?.firstName}!`,
          });
        }
      } catch (error: any) {
        console.error('Redirect error:', error);
        const errorCode = 'code' in error ? (error.code as string) : '';
        const errorDetails = getAuthErrorDetails(errorCode);

        if (errorDetails) {
          toast.error(errorDetails.title, {
            description: errorDetails.description,
          });
        } else if (error.message) {
          toast.error('Sign in failed', {
            description: error.message,
          });
        }
      }
    };

    // Call immediately when component mounts
    handleRedirect();
  }, []); // Empty deps - only run once on mount

  return null; // This component doesn't render anything
};

// Default export for Astro
export default AuthRedirectHandler;
