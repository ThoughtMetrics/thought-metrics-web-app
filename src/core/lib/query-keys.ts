import type { ContentQueryOptions } from '../types/content.type';

export const contentKeys = {
  all: ['contents'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (options?: ContentQueryOptions) =>
    [...contentKeys.lists(), options] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentKeys.details(), id] as const,
  slug: (slug: string) => [...contentKeys.all, 'slug', slug] as const,
  related: (documentId: string) =>
    [...contentKeys.all, 'related', documentId] as const,
  blog: (options?: any) => [...contentKeys.all, 'blog', options] as const,
};
