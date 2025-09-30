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

export const ContentCategory = {
  QUANTITATIVE_RESEARCH: 'Quantitative Research',
  QUALITATIVE_RESEARCH: 'Qualitative Research',
  FIELDWORK: 'Fieldwork',
  FOCUS_GROUP: 'Focus Group',
  PARTICIPANT_EXPERIENCE: 'Participant Experience',
} as const;

export type ContentCategoryValue =
  (typeof ContentCategory)[keyof typeof ContentCategory];

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
  category: ContentCategoryValue;
  content: string;
  tags: string | null;
  publishedDate: string | null;
  img: StrapiImage;
}

export interface ContentFilters {
  type?: ContentTypeValue | ContentTypeValue[];
  category?: ContentCategoryValue | ContentCategoryValue[];
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
