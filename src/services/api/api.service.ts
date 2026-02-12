// @/services/api.service.ts

import { getAPIConfig } from '@/core/configs/api-config';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

class ApiService {
  private API_CONFIG = getAPIConfig();
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = `${this.API_CONFIG.baseURL}${this.API_CONFIG.apiPath}/${this.API_CONFIG.baseAPIVersion}`;
    this.defaultHeaders = {
      ...this.API_CONFIG.headers,
    };
  }

  /**
   * Handle API response and extract data
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      throw new ApiError({
        message: 'Failed to parse response',
        status: response.status,
        details: error,
      });
    }

    if (!response.ok) {
      throw new ApiError({
        message:
          data?.message || data?.error || `HTTP Error: ${response.status}`,
        status: response.status,
        code: data?.code,
        details: data?.details || data,
      });
    }

    return data;
  }

  /**
   * Handle network and other errors
   */
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error
    if (
      error.name === 'TypeError' &&
      (error.message?.includes('fetch') || error.message?.includes('Failed to fetch'))
    ) {
      throw new ApiError({
        message: 'Network error. Please check your connection.',
        status: 0,
        details: error,
      });
    }

    // Timeout error
    if (error.name === 'AbortError') {
      throw new ApiError({
        message: 'Request timeout. Please try again.',
        status: 408,
        details: error,
      });
    }

    // Generic error
    const message = error?.details?.error?.message
      || error?.message
      || 'An unexpected error occurred';
    throw new ApiError({
      message,
      status: error?.status || 500,
      details: error,
    });
  }

  /**
   * Make HTTP request with common configuration
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.API_CONFIG.timeout
    );

    const config: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      return this.handleError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  /**
   * Upload file with FormData
   * Note: Don't set Content-Type header - browser will set it with boundary
   */
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const url = `${this.baseURL}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.API_CONFIG.timeout
    );

    // Don't include Content-Type header - browser sets it with boundary for FormData
    const { 'Content-Type': _, ...headersWithoutContentType } = this.defaultHeaders;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: headersWithoutContentType,
      });
      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      return this.handleError(error);
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer firebase:${token}`;
  }

  /**
   * Remove authentication token
   */
  removeAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Add custom header
   */
  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

/**
 * Custom ApiError class
 */
class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor({
    message,
    status,
    code,
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: any;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export { ApiError };
export default new ApiService();
