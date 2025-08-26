// src/types/content.types.ts

import type { StrapiImage } from './strapi.type';

export const ContentType = {
  INSIGHT: 'Insight',
  REPORT: 'Report',
  WHITEPAPER: 'Whitepaper',
  BLOG: 'Blog',
  ARTICLE: 'Article',
} as const;

export type ContentTypeValue = (typeof ContentType)[keyof typeof ContentType];

export interface Content {
  id: number;
  documentId: string;
  label: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  type: ContentTypeValue;
  content: string;
  tags: string | null;
  publishedDate: string | null;
  img: StrapiImage;
}

export interface ContentFilters {
  type?: ContentTypeValue | ContentTypeValue[];
  tags?: string | string[];
  dateFrom?: string | Date;
  dateTo?: string | Date;
  search?: string;
  slug?: string;
}

export interface ContentQueryOptions {
  filters?: ContentFilters;
  limit?: number;
  page?: number;
  sort?: string | string[];
  populate?: string | string[] | object;
}
