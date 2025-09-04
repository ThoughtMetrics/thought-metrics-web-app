// src/services/base/strapi.service.ts
import API_CONFIG from '@/core/configs/api-config';
import axios, { AxiosError, type AxiosInstance } from 'axios';
import qs from 'qs';

export class StrapiService {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.strapiURL}${API_CONFIG.apiPath}`,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  protected getAuthToken(): string | null {
    return (
      localStorage.getItem('authToken') ||
      import.meta.env.STRAPI_API_TOKEN ||
      null
    );
  }

  protected setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  protected removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  private handleUnauthorized(): void {
    this.removeAuthToken();
    // Optionally redirect to login
    // window.location.href = '/login';
  }

  protected buildQueryString(params: any): string {
    return qs.stringify(params, {
      encodeValuesOnly: true,
    });
  }

  protected async get<T>(endpoint: string, params?: any): Promise<T> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.client.get(url);
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.client.post(endpoint, data);
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.client.put(endpoint, data);
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.client.delete(endpoint);
  }
}
