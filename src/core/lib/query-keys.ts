import type { ContentQueryOptions } from '../types/content.type';

export const QueryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'] as const,
    userProfile: () => [...QueryKeys.auth.all, 'profile'] as const,
  },
  // Contact Us related queries
  contactUs: {
    all: ['contact-us'] as const,
    lists: () => [...QueryKeys.contactUs.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...QueryKeys.contactUs.lists(), filters] as const,
    details: () => [...QueryKeys.contactUs.all, 'detail'] as const,
    detail: (id: string) => [...QueryKeys.contactUs.details(), id] as const,
  },
  contentKeys: {
    all: ['contents'] as const,
    lists: () => [...QueryKeys.contentKeys.all, 'list'] as const,
    list: (options?: ContentQueryOptions) =>
      [...QueryKeys.contentKeys.lists(), options] as const,
    details: () => [...QueryKeys.contentKeys.all, 'detail'] as const,
    detail: (id: string) => [...QueryKeys.contentKeys.details(), id] as const,
    slug: (slug: string) =>
      [...QueryKeys.contentKeys.all, 'slug', slug] as const,
    related: (documentId: string) =>
      [...QueryKeys.contentKeys.all, 'related', documentId] as const,
    blog: (options?: any) =>
      [...QueryKeys.contentKeys.all, 'blog', options] as const,
  },
} as const;

export type QueryKey = typeof QueryKeys;
