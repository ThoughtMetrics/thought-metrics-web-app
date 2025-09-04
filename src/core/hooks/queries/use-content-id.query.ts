import { contentKeys } from '@/core/lib/query-keys';
import type { Content } from '@/core/types/content.type';
import type { StrapiSingleResponse } from '@/core/types/strapi.type';
import { contentService } from '@/services/api/content.service';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export const useContentByIdQuery = (
  documentId: string,
  queryOptions?: Omit<
    UseQueryOptions<StrapiSingleResponse<Content>, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: contentKeys.detail(documentId),
    queryFn: () => contentService.getContentById(documentId),
    enabled: !!documentId,
    ...queryOptions,
  });
};
