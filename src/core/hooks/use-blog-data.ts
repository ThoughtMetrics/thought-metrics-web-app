// src/hooks/useBlogData.ts

import type { ContentCategoryValue, ContentTypeValue } from '../types/content.type';
import {
  useBlogContentsQuery,
  type BlogItem,
} from './queries/use-blog-contents.query';

interface UseBlogDataOptions {
  title: string;
  type?: ContentTypeValue[];
  category?: ContentCategoryValue[];
  limit?: number;
  tags?: string[];
}

interface BlogData {
  title: string;
  items: BlogItem[];
}

export const useBlogData = (options: UseBlogDataOptions) => {
  const {
    data: items = [],
    isLoading,
    error,
  } = useBlogContentsQuery({
    type: options.type,
    category: options.category,
    limit: options.limit,
    tags: options.tags,
  });

  return {
    blogData: {
      title: options.title,
      items,
    } as BlogData,
    loading: isLoading,
    error,
  };
};
