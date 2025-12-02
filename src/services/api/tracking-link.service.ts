// @/services/api/tracking-link.service.ts

import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface CreateTrackingLinkData {
  name: string;
  destinationUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  postSignupRedirect?: string;
  redirectToSignup?: boolean;
}

export interface TrackingLink {
  id: string;
  name: string;
  shortCode: string;
  fullTrackingUrl: string;
  destinationUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  isActive: boolean;
  stats?: {
    uniqueVisitors?: number;
    registrations?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

class TrackingLinkService {
  private readonly endpoint = '/analytics/links';

  /**
   * Get all tracking links
   */
  async getTrackingLinks(): Promise<ApiResponse<TrackingLink[]>> {
    return await apiService.get<TrackingLink[]>(this.endpoint);
  }

  /**
   * Get tracking link by ID
   */
  async getTrackingLinkById(id: string): Promise<ApiResponse<TrackingLink>> {
    return await apiService.get<TrackingLink>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new tracking link
   */
  async createTrackingLink(
    data: CreateTrackingLinkData
  ): Promise<ApiResponse<TrackingLink>> {
    try {
      // Clean up the data
      const requestData: any = {
        name: data.name?.trim(),
        destinationUrl: data.destinationUrl?.trim(),
        redirectToSignup: data.redirectToSignup ?? true,
      };

      // Add optional fields only if they exist
      if (data.utmSource?.trim()) {
        requestData.utmSource = data.utmSource.trim();
      }
      if (data.utmMedium?.trim()) {
        requestData.utmMedium = data.utmMedium.trim();
      }
      if (data.utmCampaign?.trim()) {
        requestData.utmCampaign = data.utmCampaign.trim();
      }
      if (data.utmTerm?.trim()) {
        requestData.utmTerm = data.utmTerm.trim();
      }
      if (data.utmContent?.trim()) {
        requestData.utmContent = data.utmContent.trim();
      }
      if (data.postSignupRedirect?.trim()) {
        requestData.postSignupRedirect = data.postSignupRedirect.trim();
      }

      // Remove any null or undefined values
      Object.keys(requestData).forEach((key) => {
        if (
          requestData[key] === null ||
          requestData[key] === undefined ||
          requestData[key] === ''
        ) {
          delete requestData[key];
        }
      });

      return await apiService.post<TrackingLink>(this.endpoint, requestData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update tracking link
   */
  async updateTrackingLink(
    id: string,
    data: Partial<CreateTrackingLinkData>
  ): Promise<ApiResponse<TrackingLink>> {
    return await apiService.put<TrackingLink>(`${this.endpoint}/${id}`, data);
  }

  /**
   * Delete tracking link
   */
  async deleteTrackingLink(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }
}

export default new TrackingLinkService();
