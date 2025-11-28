import type { UserProfile } from '@/core/types/user.type';
import { getAuthErrorDetails } from '@/core/utils/firebase-error-handler';
import authService from '@/services/api/auth.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignInWithEmailParams {
  type: 'email';
  email: string;
  password: string;
}

interface SignInWithGoogleParams {
  type: 'google';
}

interface SignInWithFacebookParams {
  type: 'facebook';
}

type SignInParams =
  | SignInWithEmailParams
  | SignInWithGoogleParams
  | SignInWithFacebookParams;

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (params: SignInParams): Promise<UserProfile | void> => {
      switch (params.type) {
        case 'email':
          return await authService.signInWithEmail(
            params.email,
            params.password
          );
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
          throw new Error('Invalid sign-in type');
      }
    },
    retry: (failureCount, error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      if (
        errorCode === 'auth/user-not-found' ||
        errorCode === 'auth/wrong-password' ||
        errorCode === 'auth/invalid-email' ||
        errorCode === 'auth/invalid-credential'
      ) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    onSuccess: (data) => {
      // Only show success toast for email sign-in (Google/Facebook handled by redirect)
      if (data) {
        toast.success('Sign in successful!', {
          description: `Welcome back, ${data.profile?.displayName ?? data.profile?.firstName}!`,
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
