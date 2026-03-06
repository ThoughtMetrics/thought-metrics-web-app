import type { ContentQueryOptions } from '../types/content.type';

export const QueryKeys = {
  // Auth related queries
  auth: {
    all: ['auth'] as const,
    userProfile: () => [...QueryKeys.auth.all, 'profile'] as const,
  },
  // User related queries
  user: {
    all: ['user'] as const,
    profile: () => [...QueryKeys.user.all, 'profile'] as const,
    byFirebaseUid: (uid: string) => [...QueryKeys.user.all, 'firebaseUid', uid] as const,
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
  // Download Report related queries
  downloadReport: {
    all: ['download-report'] as const,
    lists: () => [...QueryKeys.downloadReport.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...QueryKeys.downloadReport.lists(), filters] as const,
    details: () => [...QueryKeys.downloadReport.all, 'detail'] as const,
    detail: (id: string) =>
      [...QueryKeys.downloadReport.details(), id] as const,
  },
  // Partnership related queries
  partnership: {
    all: ['partnership'] as const,
    lists: () => [...QueryKeys.partnership.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...QueryKeys.partnership.lists(), filters] as const,
    details: () => [...QueryKeys.partnership.all, 'detail'] as const,
    detail: (id: string) => [...QueryKeys.partnership.details(), id] as const,
  },
  // Research related queries
  research: {
    all: ['research'] as const,
    lists: () => [...QueryKeys.research.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...QueryKeys.research.lists(), filters] as const,
    details: () => [...QueryKeys.research.all, 'detail'] as const,
    detail: (id: string) => [...QueryKeys.research.details(), id] as const,
  },
  // Analytics related queries
  analytics: {
    all: ['analytics'] as const,
    overview: () => [...QueryKeys.analytics.all, 'overview'] as const,
    links: () => [...QueryKeys.analytics.all, 'links'] as const,
    linkDetail: (id: string) => [...QueryKeys.analytics.all, 'link', id] as const,
    visitors: () => [...QueryKeys.analytics.all, 'visitors'] as const,
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
    infiniteBlog: (options?: any) =>
      [...QueryKeys.contentKeys.all, 'infiniteBlog', options] as const,
  },
  surveyTemplates: {
    all: ['survey-templates'] as const,
    lists: () => [...QueryKeys.surveyTemplates.all, 'list'] as const,
    list: (f?: Record<string, any>) => [...QueryKeys.surveyTemplates.lists(), f ?? {}] as const,
    details: () => [...QueryKeys.surveyTemplates.all, 'detail'] as const,
    detail: (id: string) => [...QueryKeys.surveyTemplates.details(), id] as const,
  },
  surveysAdmin: {
    all: ['surveys-admin'] as const,
    lists: () => [...QueryKeys.surveysAdmin.all, 'list'] as const,
    list: (f?: Record<string, any>) => [...QueryKeys.surveysAdmin.lists(), f ?? {}] as const,
  },
} as const;

export type QueryKey = typeof QueryKeys;
