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
    mutationFn: async (params: SignInParams): Promise<UserProfile> => {
      switch (params.type) {
        case 'email':
          return await authService.signInWithEmail(
            params.email,
            params.password
          );
        case 'google':
          return await authService.signInWithGoogle();
        case 'facebook':
          return await authService.signInWithFacebook();
        default:
          throw new Error('Invalid sign-in type');
      }
    },
    retry: (failureCount, error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
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
      toast.success('Sign in successful!', {
        description: `Welcome back, ${data.profile?.displayName ?? data.profile?.firstName}!`,
      });
    },
    onError: (error: Error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      const errorDetails = getAuthErrorDetails(errorCode);

      if (errorDetails) {
        toast.error(errorDetails.title, {
          description: errorDetails.description,
        });
      } else {
        // User cancelled the popup - log silently
        console.log('Authentication popup was cancelled by user');
      }
    },
  });
};
