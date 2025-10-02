import type { AuthUser } from '@/services/api/auth.service';
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
    mutationFn: async (params: SignInParams): Promise<AuthUser> => {
      switch (params.type) {
        case 'email':
          return await authService.signInWithEmail(params.email, params.password);
        case 'google':
          return await authService.signInWithGoogle();
        case 'facebook':
          return await authService.signInWithFacebook();
        default:
          throw new Error('Invalid sign-in type');
      }
    },
    onSuccess: (data) => {
      toast.success('Sign in successful!', {
        description: `Welcome back, ${data.displayName ?? data.email}!`,
      });
    },
    onError: (error: Error) => {
      const errorMessage = error.message ?? 'Failed to sign in';
      const errorCode = 'code' in error ? (error.code as string) : '';

      // Handle specific Firebase errors
      if (errorCode === 'auth/user-not-found') {
        toast.error('User not found', {
          description: 'No account found with this email. Please sign up first.',
        });
      } else if (errorCode === 'auth/wrong-password') {
        toast.error('Invalid password', {
          description: 'The password you entered is incorrect.',
        });
      } else if (errorCode === 'auth/invalid-email') {
        toast.error('Invalid email', {
          description: 'Please enter a valid email address.',
        });
      } else if (errorCode === 'auth/user-disabled') {
        toast.error('Account disabled', {
          description: 'This account has been disabled. Please contact support.',
        });
      } else if (errorCode === 'auth/invalid-credential') {
        toast.error('Invalid credentials', {
          description: 'The email or password you entered is incorrect.',
        });
      } else if (errorCode === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled', {
          description: 'The sign-in popup was closed.',
        });
      } else {
        toast.error('Sign-in failed', {
          description: errorMessage,
        });
      }
    },
  });
};