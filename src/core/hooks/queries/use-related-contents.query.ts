// src/hooks/queries/useRelatedContentsQuery.ts

import { contentKeys } from "@/core/lib/query-keys";
import type { Content } from "@/core/types/content.type";
import { contentService } from "@/services/api/content.service";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useRelatedContentsQuery = (
  content: Content | null,
  limit?: number,
  queryOptions?: Omit<UseQueryOptions<Content[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: content ? contentKeys.related(content.documentId) : ['empty'],
    queryFn: () =>
      content ? contentService.getRelatedContents(content, limit) : [],
    enabled: !!content,
    ...queryOptions,
  });
};
