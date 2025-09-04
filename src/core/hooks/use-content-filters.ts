// src/hooks/useContentWithFilters.ts
import { useContentStore } from '../stores/content.store';
import type { ContentQueryOptions } from '../types/content.type';
import { useContentsQuery } from './queries/use-contents.query';

export const useContentWithFilters = (
  additionalOptions?: Partial<ContentQueryOptions>
) => {
  const { contentFilters, viewMode } = useContentStore();

  const queryOptions: ContentQueryOptions = {
    filters: contentFilters,
    ...additionalOptions,
  };

  const query = useContentsQuery(queryOptions);

  return {
    ...query,
    viewMode,
    filters: contentFilters,
  };
};
