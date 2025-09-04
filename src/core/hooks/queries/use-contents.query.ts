// src/hooks/queries/useContentsQuery.ts

import { contentKeys } from '@/core/lib/query-keys';
import type { Content, ContentQueryOptions } from '@/core/types/content.type';
import type { StrapiResponse } from '@/core/types/strapi.type';
import { contentService } from '@/services/api/content.service';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useContentsQuery = (
  options?: ContentQueryOptions,
  queryOptions?: Omit<
    UseQueryOptions<StrapiResponse<Content[]>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: contentKeys.list(options),
    queryFn: () => contentService.getContents(options),
    ...queryOptions,
  });
};
