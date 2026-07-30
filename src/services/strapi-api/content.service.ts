// src/services/content/content.service.ts
//
// Reads CMS content directly from Azure Table Storage (table `content`,
// PartitionKey = type, RowKey = slug) via a long-lived, read-only SAS URL —
// no backend round-trip, replacing the old Strapi REST client. Writes are
// admin-only and go through thought-metrics-web-api's /v1/content routes
// (see content-admin.service.ts), never through this read-only client.
//
// Table Storage has no server-side "contains" filter, and this collection is
// tiny (~40 rows today), so filtering/sorting/pagination happen in memory
// against a full listing rather than building OData filter strings.
import { TableClient, type TableEntityResult } from '@azure/data-tables';
import { getAPIConfig } from '@/core/configs/api-config';
import type {
  Content,
  ContentQueryOptions,
  ContentFilters,
  ContentTypeValue,
  ContentCategoryValue,
} from '@/core/types/content.type';
import type {
  StrapiResponse,
  StrapiSingleResponse,
} from '@/core/types/strapi.type';
import { ROUTES } from '@/routes/routeConfig';

interface ContentTableRow {
  partitionKey: string;
  rowKey: string;
  label: string;
  description: string;
  type: string;
  content: string;
  imgUrl: string;
  tags: string;
  publishedDate?: string;
  category?: string;
  published: boolean;
  timestamp?: string;
}

export class ContentService {
  private readonly endpoint = '/contents';
  private tableClient: TableClient | null = null;
  private cache: { rows: ContentTableRow[]; fetchedAt: number } | null = null;
  private readonly CACHE_TTL_MS = 60_000; // public marketing content — a minute of staleness is fine

  private getClient(): TableClient {
    if (this.tableClient) return this.tableClient;
    const sasUrl = getAPIConfig().contentTableSasUrl;
    if (!sasUrl) {
      throw new Error(
        'PUBLIC_CONTENT_TABLE_SAS_URL is not configured — content reads will fail'
      );
    }
    this.tableClient = new TableClient(sasUrl, 'content');
    return this.tableClient;
  }

  private async listAllPublished(): Promise<ContentTableRow[]> {
    const now = Date.now();
    if (this.cache && now - this.cache.fetchedAt < this.CACHE_TTL_MS) {
      return this.cache.rows;
    }

    const client = this.getClient();
    const rows: ContentTableRow[] = [];
    for await (const entity of client.listEntities<
      TableEntityResult<ContentTableRow>
    >()) {
      if (entity.published) {
        rows.push(entity as unknown as ContentTableRow);
      }
    }

    this.cache = { rows, fetchedAt: now };
    return rows;
  }

  /**
   * Admin-only: lists every record regardless of published state, in the
   * raw Table Storage row shape (not the public Content type) — used by the
   * Content Management admin screen, never by public-facing pages.
   */
  async getAllForAdmin(): Promise<ContentTableRow[]> {
    const client = this.getClient();
    const rows: ContentTableRow[] = [];
    for await (const entity of client.listEntities<
      TableEntityResult<ContentTableRow>
    >()) {
      rows.push(entity as unknown as ContentTableRow);
    }
    return rows;
  }

  private toContent(row: ContentTableRow): Content {
    return {
      id: hashToInt(row.rowKey),
      documentId: row.rowKey,
      label: row.label,
      description: row.description,
      slug: row.rowKey,
      createdAt: row.timestamp ?? '',
      updatedAt: row.timestamp ?? '',
      publishedAt: row.timestamp ?? '',
      type: row.type as ContentTypeValue,
      category: row.category as ContentCategoryValue,
      content: row.content,
      tags: row.tags ?? null,
      publishedDate: row.publishedDate ?? null,
      img: { url: row.imgUrl },
    };
  }

  /**
   * Applies the same filter surface the old Strapi query builder exposed,
   * in memory against the full published set.
   */
  private applyFilters(
    contents: Content[],
    filters: ContentFilters = {}
  ): Content[] {
    let result = contents;

    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      if (types.length > 0) {
        result = result.filter((c) => types.includes(c.type));
      }
    }

    if (filters.category) {
      const categories = Array.isArray(filters.category)
        ? filters.category
        : [filters.category];
      if (categories.length > 0) {
        result = result.filter((c) => categories.includes(c.category));
      }
    }

    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      if (tags.length > 0) {
        const lowerTags = tags.map((t) => t.toLowerCase());
        result = result.filter((c) =>
          lowerTags.some((tag) => (c.tags ?? '').toLowerCase().includes(tag))
        );
      }
    }

    if (filters.dateFrom || filters.dateTo) {
      const fromDate = filters.dateFrom
        ? new Date(filters.dateFrom).getTime()
        : undefined;
      const toDate = filters.dateTo
        ? new Date(filters.dateTo).getTime()
        : undefined;
      result = result.filter((c) => {
        if (!c.publishedDate) return false;
        const d = new Date(c.publishedDate).getTime();
        if (fromDate !== undefined && d < fromDate) return false;
        if (toDate !== undefined && d > toDate) return false;
        return true;
      });
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q)
      );
    }

    if (filters.slug) {
      result = result.filter((c) => c.slug === filters.slug);
    }

    return result;
  }

  private sortContents(contents: Content[], sort?: string | string[]): Content[] {
    const sortRules = (Array.isArray(sort) ? sort : sort ? [sort] : [
      'publishedDate:desc',
    ]) as string[];

    return [...contents].sort((a, b) => {
      for (const rule of sortRules) {
        const [field, dir] = rule.split(':');
        const av = (a as any)[field] ?? '';
        const bv = (b as any)[field] ?? '';
        if (av === bv) continue;
        const cmp = av > bv ? 1 : -1;
        return dir === 'desc' ? -cmp : cmp;
      }
      return 0;
    });
  }

  /**
   * Get all contents with filtering options
   */
  async getContents(
    options: ContentQueryOptions = {}
  ): Promise<StrapiResponse<Content[]>> {
    const { limit = 25, page = 1, sort } = options;

    const rows = await this.listAllPublished();
    const all = rows.map((r) => this.toContent(r));
    const filtered = this.applyFilters(all, options.filters);
    const sorted = this.sortContents(filtered, sort);

    const total = sorted.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = sorted.slice(start, start + limit);

    return {
      data,
      meta: {
        pagination: { page, pageSize: limit, pageCount, total },
      },
    };
  }

  /**
   * Get content by documentId (== slug in the Table Storage model)
   */
  async getContentById(
    documentId: string
  ): Promise<StrapiSingleResponse<Content>> {
    const rows = await this.listAllPublished();
    const row = rows.find((r) => r.rowKey === documentId);
    if (!row) {
      throw new Error(`Content not found: ${documentId}`);
    }
    return { data: this.toContent(row), meta: {} };
  }

  /**
   * Get content by slug
   */
  async getContentBySlug(slug: string): Promise<Content | null> {
    const rows = await this.listAllPublished();
    const row = rows.find((r) => r.rowKey === slug);
    return row ? this.toContent(row) : null;
  }

  /**
   * Get contents by type
   */
  async getContentsByType(
    type: ContentTypeValue | ContentTypeValue[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({ filters: { type }, limit });
  }

  /**
   * Get contents by category
   */
  async getContentsByCategory(
    category: ContentCategoryValue | ContentCategoryValue[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({ filters: { category }, limit });
  }

  /**
   * Get contents by tags
   */
  async getContentsByTags(
    tags: string | string[],
    limit?: number
  ): Promise<StrapiResponse<Content[]>> {
    return this.getContents({ filters: { tags }, limit });
  }

  /**
   * Get related contents (same type, category, or tags)
   */
  async getRelatedContents(content: Content, limit = 4): Promise<Content[]> {
    const tags =
      content.tags
        ?.split(',')
        .map((t) => t.trim())
        .filter(Boolean) ?? [];

    const response = await this.getContents({
      filters: {
        tags: tags.length > 0 ? tags : undefined,
        type: tags.length === 0 ? content.type : undefined,
        category: tags.length === 0 ? content.category : undefined,
      },
      limit: limit + 1,
    });

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
    {
      id: number;
      type: string;
      category: string;
      label: string;
      description: string;
      link: string;
      src: string;
    }[]
  > {
    const response = await this.getContents({
      filters: {
        type: options?.type,
        category: options?.category,
        tags: options?.tags,
      },
      limit: options?.limit ?? 8,
    });

    return response.data.map((content) => ({
      id: content.id,
      type: content.type,
      category: content.category,
      label: content.label,
      description: content.description,
      link: `${ROUTES.RESOURCES}/${content.slug}`,
      src: content.img?.url ?? '',
    }));
  }
}

/** Deterministic string->positive-int hash — only used for React list keys / the legacy numeric `id` field, never for lookups. */
function hashToInt(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const contentService = new ContentService();
