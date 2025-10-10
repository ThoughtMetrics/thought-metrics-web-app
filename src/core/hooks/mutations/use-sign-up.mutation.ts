import type { SignUpData, UserProfile } from '@/core/types/user.type';
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
    mutationFn: async (params: SignUpParams): Promise<UserProfile> => {
      switch (params.type) {
        case 'email':
          return await authService.signUpWithEmail(params.data);
        case 'google':
          return await authService.signInWithGoogle();
        case 'facebook':
          return await authService.signInWithFacebook();
        default:
          throw new Error('Invalid sign-up type');
      }
    },
    retry: (failureCount, error: any) => {
      // Don't retry on popup cancellation or user errors
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/email-already-in-use' ||
        error.code === 'auth/invalid-email'
      ) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    onSuccess: (data) => {
      toast.success('Account created successfully!', {
        description: `Welcome, ${data.profile?.username}!`,
      });
    },
    onError: (error: Error) => {
      const errorMessage = error.message ?? 'Failed to create account';
      const errorCode = 'code' in error ? (error.code as string) : '';

      // Handle specific Firebase errors
      if (errorCode === 'auth/email-already-in-use') {
        toast.error('Email already in use', {
          description:
            'This email is already registered. Please sign in instead.',
        });
      } else if (errorCode === 'auth/weak-password') {
        toast.error('Weak password', {
          description: 'Password should be at least 6 characters.',
        });
      } else if (errorCode === 'auth/invalid-email') {
        toast.error('Invalid email', {
          description: 'Please enter a valid email address.',
        });
      } else if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request'
      ) {
        // Don't show error toast for user-initiated cancellation
        // This is expected behavior when user closes the popup
        console.log('Authentication popup was cancelled by user');
      } else {
        toast.error('Sign-up failed', {
          description: errorMessage,
        });
      }
    },
  });
};
