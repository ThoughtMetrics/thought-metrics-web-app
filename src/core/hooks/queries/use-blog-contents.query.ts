// src/hooks/queries/useBlogContentsQuery.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type { ContentTypeValue } from '@/core/types/content.type';
import { contentService } from '@/services/strapi-api/content.service';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export interface BlogContentOptions {
  type?: ContentTypeValue[];
  limit?: number;
  tags?: string[];
}

export interface BlogItem {
  id: number;
  type: string;
  label: string;
  description: string;
  link: string;
  src: string;
}

export const useBlogContentsQuery = (
  options?: BlogContentOptions,
  queryOptions?: Omit<
    UseQueryOptions<BlogItem[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: QueryKeys.contentKeys.blog(options),
    queryFn: () => contentService.getBlogContents(options),
    ...queryOptions,
  });
};
