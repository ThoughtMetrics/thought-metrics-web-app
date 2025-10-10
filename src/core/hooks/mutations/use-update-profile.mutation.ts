import ApiService from '@/services/api/api.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { QueryKeys } from '@/core/lib/query-keys';

export interface UpdateProfileData {
  profile?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    dateOfBirth?: Date;
    gender?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
      timezone?: string;
    };
    company?: string;
    position?: string;
    industry?: string;
  };
  respondentInfo?: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    countryOrRegion?: string;
    zipCode?: string;
    dateOfBirth?: {
      month: string;
      day: string;
      year: string;
    };
    participationPreferences?: string[];
  };
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      researchInvites?: boolean;
      newsletters?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'clients-only';
      showEmail?: boolean;
      showPhone?: boolean;
      dataSharing?: boolean;
    };
    preferences?: {
      language?: string;
      theme?: 'light' | 'dark' | 'auto';
      currency?: string;
      dateFormat?: string;
    };
  };
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await ApiService.patch('/users/profile', data);
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
