// src/hooks/queries/useContentBySlugQuery.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { Content } from '@/core/types/content.type';
import { contentService } from '@/services/strapi-api/content.service';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useContentBySlugQuery = (
  slug: string,
  queryOptions?: Omit<
    UseQueryOptions<Content | null, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: QueryKeys.contentKeys.slug(slug),
    queryFn: () => contentService.getContentBySlug(slug),
    enabled: !!slug,
    ...queryOptions,
  });
};
