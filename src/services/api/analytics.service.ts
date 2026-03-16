// @/services/api/analytics.service.ts

import type { ApiResponse } from './api.service';
import apiService from './api.service';

// Lazy crypto-based UUID (no package dependency)
const randomUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const getOrCreateId = (key: string, storage: Storage): string => {
  let id = storage.getItem(key);
  if (!id) { id = randomUUID(); storage.setItem(key, id); }
  return id;
};

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

  /**
   * Track a page_view event when a visitor arrives via a tracking link.
   * Only call when tm_link_id is present (i.e. via a campaign tracking link).
   */
  async trackPageView(params: {
    tm_link_id: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  }): Promise<void> {
    try {
      const visitorId = getOrCreateId('tm_visitor_id', localStorage);
      const sessionId = getOrCreateId('tm_session_id', sessionStorage);

      await apiService.post(`${this.baseEndpoint}/track`, {
        events: [
          {
            id: randomUUID(),
            visitorId,
            sessionId,
            eventType: 'page_view',
            page: {
              url: window.location.href,
              path: window.location.pathname,
              title: document.title,
              referrer: document.referrer,
            },
            utm: params,
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } catch {
      // Tracking failures are non-fatal — silently ignore
    }
  }
  /**
   * Track a user_registered event. Call after successful signup when tm_link_id
   * is stored in localStorage (user arrived via a tracking link campaign).
   */
  async trackRegistration(params: { userId: string; email?: string }): Promise<void> {
    try {
      const tmLinkId = localStorage.getItem('tm_link_id');
      if (!tmLinkId) return; // Only track if user came via a campaign link
      const visitorId = getOrCreateId('tm_visitor_id', localStorage);
      const sessionId = getOrCreateId('tm_session_id', sessionStorage);

      await apiService.post(`${this.baseEndpoint}/track`, {
        events: [
          {
            id: randomUUID(),
            visitorId,
            sessionId,
            eventType: 'user_registered',
            userId: params.userId,
            email: params.email,
            utm: { tm_link_id: tmLinkId },
            timestamp: new Date().toISOString(),
          },
        ],
      });
    } catch {
      // Non-fatal — silently ignore
    }
  }
}

export default new AnalyticsService();
