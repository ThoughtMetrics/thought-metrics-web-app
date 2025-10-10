import type { UserProfile } from '@/services/api/auth.service';
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

/**
 * Helper function to get error details based on Firebase error code
 * Returns null for user-initiated cancellations (no toast should be shown)
 */
export const getSignInErrorDetails = (
  errorCode: string
): { title: string; description: string } | null => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return {
        title: 'User not found',
        description: 'No account found with this email. Please sign up first.',
      };
    case 'auth/wrong-password':
      return {
        title: 'Invalid password',
        description: 'The password you entered is incorrect.',
      };
    case 'auth/invalid-email':
      return {
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
      };
    case 'auth/user-disabled':
      return {
        title: 'Account disabled',
        description: 'This account has been disabled. Please contact support.',
      };
    case 'auth/invalid-credential':
      return {
        title: 'Invalid credentials',
        description: 'The email or password you entered is incorrect.',
      };
    case 'auth/too-many-requests':
      return {
        title: 'Too many attempts',
        description:
          'Too many failed login attempts. Please try again later or reset your password.',
      };
    case 'auth/network-request-failed':
      return {
        title: 'Network error',
        description: 'Please check your internet connection and try again.',
      };
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      // Don't show toast for user-initiated cancellation
      return null;
    default:
      return {
        title: 'Sign-in failed',
        description: 'An error occurred during sign-in. Please try again.',
      };
  }
};

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
    retry: (failureCount, error: any) => {
      // Don't retry on popup cancellation or user errors
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/invalid-credential'
      ) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    onSuccess: (data) => {
      const username = data.profile?.displayName ?? data.profile?.firstName ?? data.email;
      toast.success('Sign in successful!', {
        description: `Welcome back, ${username}!`,
      });
    },
    onError: (error: Error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';
      const errorDetails = getSignInErrorDetails(errorCode);

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
