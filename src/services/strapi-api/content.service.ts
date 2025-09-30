// src/services/content/content.service.ts
import type { Content, ContentQueryOptions, ContentTypeValue, ContentCategoryValue } from "@/core/types/content.type";
import { StrapiService } from "./strapi.service";
import type { StrapiResponse, StrapiSingleResponse } from "@/core/types/strapi.type";

export class ContentService extends StrapiService {
  private readonly endpoint = '/contents';

  /**
   * Build Strapi query parameters for content filtering
   */
  private buildContentQuery(options: ContentQueryOptions = {}): any {
    const {
      filters = {},
      limit = 25,
      page = 1,
      sort = ['publishedDate:desc', 'createdAt:desc'],
      populate = 'img',
    } = options;

    const query: any = {
      populate,
      sort,
      pagination: {
        page,
        pageSize: limit,
      },
    };

    // Build filters
    const strapiFilters: any = {};

    // Type filter
    if (filters.type) {
      if (Array.isArray(filters.type)) {
        strapiFilters.type = { $in: filters.type };
      } else {
        strapiFilters.type = { $eq: filters.type };
      }
    }

    // Category filter
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        strapiFilters.category = { $in: filters.category };
      } else {
        strapiFilters.category = { $eq: filters.category };
      }
    }

    // Tags filter (supports partial matching)
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      strapiFilters.$or = tags.map((tag) => ({
        tags: { $containsi: tag },
      }));
    }

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      strapiFilters.publishedDate = {};

      if (filters.dateFrom) {
        const fromDate =
          filters.dateFrom instanceof Date
            ? filters.dateFrom.toISOString().split('T')[0]
            : filters.dateFrom;
        strapiFilters.publishedDate.$gte = fromDate;
      }

      if (filters.dateTo) {
        const toDate =
          filters.dateTo instanceof Date
            ? filters.dateTo.toISOString().split('T')[0]
            : filters.dateTo;
        strapiFilters.publishedDate.$lte = toDate;
      }
    }

    // Search filter
    if (filters.search) {
      strapiFilters.$or = [
        { label: { $containsi: filters.search } },
        { description: { $containsi: filters.search } },
        { content: { $containsi: filters.search } },
      ];
    }

    // Slug filter
    if (filters.slug) {
      strapiFilters.slug = { $eq: filters.slug };
    }

    if (Object.keys(strapiFilters).length > 0) {
      query.filters = strapiFilters;
    }

    return query;
  }

  /**
   * Get all contents with filtering options
   */
  async getContents(
    options?: ContentQueryOptions
  ): Promise<StrapiResponse<Content[]>> {
    const params = this.buildContentQuery(options);
    return this.get<StrapiResponse<Content[]>>(this.endpoint, params);
  }

  /**
   * Get content by document ID
   */
  async getContentById(
    documentId: string
  ): Promise<StrapiSingleResponse<Content>> {
    return this.get<StrapiSingleResponse<Content>>(
      `${this.endpoint}/${documentId}`,
      { populate: 'img' }
    );
  }

  /**
   * Get content by slug
   */
  async getContentBySlug(slug: string): Promise<Content | null> {
    const response = await this.getContents({
      filters: { slug },
      limit: 1,
    });

    return response.data?.[0] || null;
  }

  /**
   * Get contents by type
   */
  async getContentsByType(
    type: ContentTypeValue | ContentTypeValue[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({
      filters: { type },
      limit,
    });
  }

  /**
   * Get contents by category
   */
  async getContentsByCategory(
    category: ContentCategoryValue | ContentCategoryValue[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({
      filters: { category },
      limit,
    });
  }

  /**
   * Get contents by tags
   */
  async getContentsByTags(
    tags: string | string[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({
      filters: { tags },
      limit,
    });
  }

  /**
   * Get related contents (same type, category, or tags)
   */
  async getRelatedContents(
    content: Content,
    limit: number = 4
  ): Promise<Content[]> {
    // Get contents with matching tags or same type/category
    const tags =
      content.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const response = await this.getContents({
      filters: {
        tags: tags.length > 0 ? tags : undefined,
        type: tags.length === 0 ? content.type : undefined,
        category: tags.length === 0 ? content.category : undefined,
      },
      limit: limit + 1, // Get one extra to exclude current
    });

    // Filter out the current content
    return response.data
      .filter((c) => c.documentId !== content.documentId)
      .slice(0, limit);
  }

  /**
   * Search contents
   */
  async searchContents(
    query: string,
    options?: Omit<ContentQueryOptions, 'filters'>
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({
      ...options,
      filters: { search: query },
    });
  }

  /**
   * Get contents for blog section with specific formatting
   */
  async getBlogContents(options?: {
    type?: ContentTypeValue[];
    category?: ContentCategoryValue[];
    limit?: number;
    tags?: string[];
  }): Promise<
    Array<{
      id: number;
      type: string;
      category: string;
      label: string;
      description: string;
      link: string;
      src: string;
    }>
  > {
    const response = await this.getContents({
      filters: {
        type: options?.type,
        category: options?.category,
        tags: options?.tags,
      },
      limit: options?.limit || 8,
    });

    return response.data.map((content) => ({
      id: content.id,
      type: content.type,
      category: content.category,
      label: content.label,
      description: content.description,
      link: `/resources/${content.slug}`,
      src: this.getOptimalImageUrl(content),
    }));
  }

  /**
   * Helper to get optimal image URL based on available formats
   */
  private getOptimalImageUrl(content: Content): string {
    const img = content.img;
    if (!img) return '';

    // Priority: medium > small > thumbnail > original
    if (img.formats?.medium) return img.formats.medium.url;
    if (img.formats?.small) return img.formats.small.url;
    if (img.formats?.thumbnail) return img.formats.thumbnail.url;
    return img.url;
  }
}

export const contentService = new ContentService();
