import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { QueryKeys } from '@/core/lib/query-keys';
import authService, { type UserProfile } from '@/services/api/auth.service';

export const useUserProfileQuery = (
  queryOptions?: Omit<UseQueryOptions<UserProfile, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QueryKeys.auth.userProfile(),
    queryFn: () => authService.getUserProfile(),
    enabled: !!authService.getCurrentUser(),
    retry: 1,
    ...queryOptions,
  });
};
