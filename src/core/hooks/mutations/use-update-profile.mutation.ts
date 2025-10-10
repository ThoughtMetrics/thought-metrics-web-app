import ApiService from '@/services/api/api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QueryKeys } from '@/core/lib/query-keys';
import type { UpdateProfileData } from '@/core/types/user.type';

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await ApiService.patch('/users/profile/patch', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user profile query to refetch updated data
      void queryClient.invalidateQueries({ queryKey: QueryKeys.user.profile() });

      toast.success('Profile updated successfully!', {
        description: 'Your changes have been saved.',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message ?? 'Failed to update profile';

      toast.error('Update failed', {
        description: errorMessage,
      });
    },
  });
};
