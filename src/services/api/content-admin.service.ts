// Admin-only CRUD over the CMS `content` Table Storage records, via
// thought-metrics-web-api's authenticated /v1/content routes. Reads for the
// public site never go through this service — see content.service.ts, which
// talks directly to Table Storage with a read-only SAS token.
import ApiService from './api.service';
import type { ApiResponse } from './api.service';
import authService from './auth.service';
import type {
  ContentTypeValue,
  ContentCategoryValue,
} from '@/core/types/content.type';

export interface AdminContentRecord {
  partitionKey: string;
  rowKey: string;
  label: string;
  description: string;
  type: ContentTypeValue;
  content: string;
  imgUrl: string;
  tags: string;
  publishedDate?: string;
  category?: ContentCategoryValue;
  published: boolean;
}

export interface ContentCreatePayload {
  label: string;
  description: string;
  slug: string;
  type: ContentTypeValue;
  content: string;
  imgUrl: string;
  tags: string;
  publishedDate?: string;
  category?: ContentCategoryValue;
  published?: boolean;
}

export type ContentUpdatePayload = Partial<Omit<ContentCreatePayload, 'slug'>>;

class ContentAdminService {
  private async ensureAuth() {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    ApiService.setAuthToken(token);
  }

  async create(payload: ContentCreatePayload): Promise<ApiResponse<AdminContentRecord>> {
    await this.ensureAuth();
    return ApiService.post<AdminContentRecord>('/content', payload);
  }

  async update(
    partitionKey: string,
    rowKey: string,
    payload: ContentUpdatePayload
  ): Promise<ApiResponse<AdminContentRecord>> {
    await this.ensureAuth();
    return ApiService.put<AdminContentRecord>(
      `/content/${encodeURIComponent(partitionKey)}/${encodeURIComponent(rowKey)}`,
      payload
    );
  }

  async setPublished(
    partitionKey: string,
    rowKey: string,
    published: boolean
  ): Promise<ApiResponse<AdminContentRecord>> {
    await this.ensureAuth();
    return ApiService.patch<AdminContentRecord>(
      `/content/${encodeURIComponent(partitionKey)}/${encodeURIComponent(rowKey)}/publish`,
      { published }
    );
  }

  async delete(partitionKey: string, rowKey: string): Promise<ApiResponse<void>> {
    await this.ensureAuth();
    return ApiService.delete<void>(
      `/content/${encodeURIComponent(partitionKey)}/${encodeURIComponent(rowKey)}`
    );
  }

  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    await this.ensureAuth();
    return ApiService.uploadFile<{ url: string }>('/content/upload-image', file);
  }
}

export default new ContentAdminService();
