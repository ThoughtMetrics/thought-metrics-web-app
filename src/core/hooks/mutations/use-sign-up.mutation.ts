import type { SignUpData, UserProfile } from '@/core/types/user.type';
import { getAuthErrorDetails } from '@/core/utils/firebase-error-handler';
import authService from '@/services/api/auth.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignUpWithEmailParams {
  type: 'email';
  data: SignUpData;
}

interface SignUpWithGoogleParams {
  type: 'google';
}

interface SignUpWithFacebookParams {
  type: 'facebook';
}

type SignUpParams =
  | SignUpWithEmailParams
  | SignUpWithGoogleParams
  | SignUpWithFacebookParams;

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: async (params: SignUpParams): Promise<UserProfile | void> => {
      switch (params.type) {
        case 'email':
          return await authService.signUpWithEmail(params.data);
        case 'google': {
          // On localhost: returns UserProfile from popup
          // On production: initiates redirect (returns void)
          const result = await authService.signInWithGoogle();
          return result;
        }
        case 'facebook': {
          // On localhost: returns UserProfile from popup
          // On production: initiates redirect (returns void)
          const result = await authService.signInWithFacebook();
          return result;
        }
        default:
          throw new Error('Invalid sign-up type');
      }
    },
    retry: (failureCount, error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      if (
        errorCode === 'auth/email-already-in-use' ||
        errorCode === 'auth/invalid-email'
      ) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    onSuccess: (data) => {
      // Only show success toast for email sign-up (Google/Facebook handled by redirect)
      if (data) {
        toast.success('Account created successfully!', {
          description: `Welcome, ${data.profile?.displayName ?? data.profile?.firstName}!`,
        });
      }
    },
    onError: (error: Error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      const errorDetails = getAuthErrorDetails(errorCode);

      if (errorDetails) {
        toast.error(errorDetails.title, {
          description: errorDetails.description,
        });
      }
    },
  });
};
