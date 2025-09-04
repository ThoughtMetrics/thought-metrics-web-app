// src/hooks/useInfiniteContents.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ContentQueryOptions } from '../types/content.type';
import { contentKeys } from '../lib/query-keys';
import { contentService } from '@/services/api/content.service';

export const useInfiniteContents = (
  options?: Omit<ContentQueryOptions, 'page'>
) => {
  return useInfiniteQuery({
    queryKey: [...contentKeys.list(options), 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      contentService.getContents({
        ...options,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const { page, pageCount } = lastPage.meta.pagination;
      return page < pageCount ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
