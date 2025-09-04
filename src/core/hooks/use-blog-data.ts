// src/hooks/useBlogData.ts

import type { ContentTypeValue } from '../types/content.type';
import { useBlogContentsQuery, type BlogItem } from './queries/use-blog-contents.query';

interface UseBlogDataOptions {
  title: string;
  type?: ContentTypeValue[];
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
