// src/types/content.types.ts

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
  DATA_SECURITY: 'Data Security',
} as const;

export type ContentCategoryValue =
  (typeof ContentCategory)[keyof typeof ContentCategory];

// Minimal image shape backed by Azure Table Storage's flat `imgUrl` field —
// only `url` is ever populated; `formats` stays undefined so the responsive
// srcset fallback chains already written against Strapi's shape degrade
// gracefully to the single original-size URL.
export interface ContentImage {
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

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
  img: ContentImage;
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
