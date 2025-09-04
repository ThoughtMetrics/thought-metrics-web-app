// src/hooks/queries/useContentBySlugQuery.ts

import { contentKeys } from '@/core/lib/query-keys';
import type { Content } from '@/core/types/content.type';
import { contentService } from '@/services/api/content.service';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useContentBySlugQuery = (
  slug: string,
  queryOptions?: Omit<
    UseQueryOptions<Content | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: contentKeys.slug(slug),
    queryFn: () => contentService.getContentBySlug(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};
