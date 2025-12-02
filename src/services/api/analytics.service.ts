// @/services/api/analytics.service.ts

import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface AnalyticsOverview {
  uniqueVisitors: number;
  totalSessions: number;
  pageViews: number;
  registrations: number;
}

export interface Visitor {
  id: string;
  lastUtmSource: string;
  lastUtmMedium: string;
  city: string;
  country: string;
  isRegistered: boolean;
  firstSeenAt: string;
}

class AnalyticsService {
  private readonly baseEndpoint = '/analytics';

  /**
   * Get analytics overview data
   */
  async getOverview(): Promise<ApiResponse<AnalyticsOverview>> {
    return await apiService.get<AnalyticsOverview>(
      `${this.baseEndpoint}/overview`
    );
  }

  /**
   * Get recent visitors
   */
  async getVisitors(limit?: number): Promise<ApiResponse<Visitor[]>> {
    const params = limit ? { limit } : undefined;
    return await apiService.get<Visitor[]>(
      `${this.baseEndpoint}/visitors`,
      params
    );
  }
}

export default new AnalyticsService();
