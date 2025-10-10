import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/core/lib/query-keys';
import authService from '@/services/api/auth.service';
import { useAuth } from '@/shared/providers/auth-provider';
import type { UserProfile } from '@/core/types/user.type';

export const useUserProfileQuery = (
  queryOptions?: Omit<
    UseQueryOptions<UserProfile, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const { user, isAuthReady } = useAuth();

  return useQuery({
    queryKey: QueryKeys.auth.userProfile(),
    queryFn: () => authService.getUserProfile(),
    enabled: isAuthReady && !!user,
    retry: 1,
    ...queryOptions,
  });
};
