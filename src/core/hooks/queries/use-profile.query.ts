import ApiService from '@/services/api/api.service';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/core/lib/query-keys';
import { useAuth } from '@/shared/providers/auth-provider';

export interface UserProfile {
  _id: string;
  firebaseUid: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
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
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export const useProfileQuery = () => {
  const { user, isAuthReady } = useAuth();

  return useQuery({
    queryKey: QueryKeys.user.profile(),
    queryFn: async (): Promise<UserProfile> => {
      const response = await ApiService.get('/users/profile');
      return response.data as UserProfile;
    },
    enabled: isAuthReady && !!user, // Only run when auth is ready and user is logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};
