// src/hooks/queries/use-infinite-blog-contents.query.ts

import { QueryKeys } from '@/core/lib/query-keys';
import type {
  ContentTypeValue,
  ContentCategoryValue,
} from '@/core/types/content.type';
import { ROUTES } from '@/routes/routeConfig';
import { contentService } from '@/services/strapi-api/content.service';
import {
  useInfiniteQuery,
  type UseInfiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';

export interface InfiniteBlogContentOptions {
  type?: ContentTypeValue[];
  category?: ContentCategoryValue[];
  pageSize?: number;
  tags?: string[];
}

export interface BlogItem {
  id: number;
  type: string;
  category: string;
  label: string;
  description: string;
  link: string;
  src: string;
  publishedDate?: string | null;
}

export const useInfiniteBlogContentsQuery = (
  options?: InfiniteBlogContentOptions,
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      BlogItem[],
      Error,
      InfiniteData<BlogItem[], number>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
  >
) => {
  const pageSize = options?.pageSize ?? 12;

  return useInfiniteQuery<
    BlogItem[],
    Error,
    InfiniteData<BlogItem[], number>,
    readonly unknown[],
    number
  >({
    queryKey: QueryKeys.contentKeys.infiniteBlog(options),
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const response = await contentService.getContents({
        filters: {
          type: options?.type,
          category: options?.category,
          tags: options?.tags,
        },
        limit: pageSize,
        page: pageParam,
      });

      // Transform to BlogItem format
      return response.data.map((content) => ({
        id: content.id,
        type: content.type,
        category: content.category,
        label: content.label,
        description: content.description,
        link: `${ROUTES.RESOURCES}/${content.slug}`,
        src:
          content.img?.formats?.medium?.url ??
          content.img?.formats?.small?.url ??
          content.img?.formats?.thumbnail?.url ??
          (content.img?.url || ''),
        publishedDate: content.publishedDate,
      }));
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      // If the last page has fewer items than pageSize, we've reached the end
      if (lastPage.length < pageSize) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    ...queryOptions,
  });
};
