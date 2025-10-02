import type { AuthUser, SignUpData } from '@/services/api/auth.service';
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
    mutationFn: async (params: SignUpParams): Promise<AuthUser> => {
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
    onSuccess: (data) => {
      toast.success('Account created successfully!', {
        description: `Welcome, ${data.displayName ?? data.email}!`,
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
      } else if (errorCode === 'auth/popup-closed-by-user') {
        toast.error('Sign-up cancelled', {
          description: 'The sign-up popup was closed.',
        });
      } else {
        toast.error('Sign-up failed', {
          description: errorMessage,
        });
      }
    },
  });
};
