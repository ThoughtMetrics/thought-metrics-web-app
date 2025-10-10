import ApiService from '@/services/api/api.service';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/core/lib/query-keys';
import { useAuth } from '@/shared/providers/auth-provider';
import type { UserProfile } from '@/core/types/user.type';

export const useProfileQuery = () => {
  const { user, isAuthReady } = useAuth();

  return useQuery({
    queryKey: QueryKeys.user.profile(),
    queryFn: async (): Promise<UserProfile> => {
      const response = await ApiService.get('/users/profile/get');
      return response.data as UserProfile;
    },
    enabled: isAuthReady && !!user, // Only run when auth is ready and user is logged in
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};
