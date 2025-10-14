import ApiService from '@/services/api/api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QueryKeys } from '@/core/lib/query-keys';
import type { UpdateProfileData } from '@/core/types/user.type';
import { getFirebaseErrorDetails } from '@/core/utils/firebase-error-handler';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await ApiService.patch('/users/profile/patch', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile query to refetch updated data
      void queryClient.invalidateQueries({
        queryKey: QueryKeys.user.profile(),
      });

      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });
    },
    onError: (error) => {
      const errorCode = 'code' in error ? (error.code as string) : '';

      // Check if it's a Firebase error (auth/, storage/, or Firestore error)
      if (
        errorCode &&
        (errorCode.startsWith('auth/') ||
          errorCode.startsWith('storage/') ||
          errorCode.includes('-'))
      ) {
        const errorDetails = getFirebaseErrorDetails(errorCode);

        if (errorDetails) {
          toast.error(errorDetails.title, {
            description: errorDetails.description,
          });
          return;
        }
      }

      // Generic error handling for non-Firebase errors
      const errorMessage = error?.message ?? 'Failed to update profile';
      toast.error('Update failed', {
        description: errorMessage,
      });
    },
  });
};
