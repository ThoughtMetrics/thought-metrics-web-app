import { useEffect } from 'react';
import authService from '@/services/api/auth.service';
import { toast } from 'sonner';
import { getAuthErrorDetails } from '@/core/utils/firebase-error-handler';
import { ROUTES } from '@/routes/routeConfig';

/**
 * Dedicated component to handle OAuth redirects
 * Must be rendered ONLY on client-side to properly handle redirect results
 */
const AuthRedirectHandler: React.FC = () => {
  useEffect(() => {
    const handleRedirect = async () => {
      console.log('[AuthRedirectHandler] Starting redirect handling...');

      try {
        console.log('[AuthRedirectHandler] Calling authService.handleRedirectResult()...');
        const result = await authService.handleRedirectResult();

        console.log('[AuthRedirectHandler] Redirect result:', result);

        if (result) {
          console.log('[AuthRedirectHandler] ✅ User authenticated successfully:', {
            email: result.email,
            displayName: result.profile?.displayName || result.profile?.firstName,
            firebaseUid: result.firebaseUid,
          });

          toast.success('Sign in successful!', {
            description: `Welcome back, ${result.profile?.displayName ?? result.profile?.firstName}!`,
          });

          // Redirect to survey boards after successful authentication
          console.log('[AuthRedirectHandler] Redirecting to survey-boards in 800ms...');
          setTimeout(() => {
            console.log('[AuthRedirectHandler] Redirecting now to:', ROUTES.SURVEY_BOARDS);
            window.location.href = ROUTES.SURVEY_BOARDS;
          }, 800);
        } else {
          console.log('[AuthRedirectHandler] ℹ️ No redirect result (user did not just complete OAuth flow)');
        }
      } catch (error: any) {
        console.error('[AuthRedirectHandler] ❌ Redirect error:', error);
        console.error('[AuthRedirectHandler] Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack,
        });

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
