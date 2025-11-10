// @/services/api/partnership.service.ts

import type { PartnershipFormData } from '@/core/types/partnership-form.type';
import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface PartnershipCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode?: string;
  instagramHandle?: string;
  instagramFollowers?: string;
  xHandle?: string;
  xFollowers?: string;
  linkedinUrl?: string;
  linkedinConnections?: string;
  youtubeChannel?: string;
  youtubeFollowers?: string;
  supportGroups?: string;
  audienceDescription?: string;
  partnershipReason?: string;
}

export interface PartnershipResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode?: string;
  instagramHandle?: string;
  instagramFollowers?: string;
  xHandle?: string;
  xFollowers?: string;
  linkedinUrl?: string;
  linkedinConnections?: string;
  youtubeChannel?: string;
  youtubeFollowers?: string;
  supportGroups?: string;
  audienceDescription?: string;
  partnershipReason?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnershipSearchParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  instagramHandle?: string;
  xHandle?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface PartnershipSearchResponse {
  data: PartnershipResponse[];
  total: number;
  page: number;
  limit: number;
}

class PartnershipService {
  private readonly endpoint = '/forms/partnership';

  /**
   * Submit partnership form
   */
  async submitPartnershipForm(
    data: PartnershipFormData
  ): Promise<ApiResponse<PartnershipResponse>> {
    try {
      // Transform the form data to match backend expectations
      const requestData: any = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        email: data.email?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        countryCode: data.countryCode?.trim(),
      };

      // Add optional fields only if they exist
      if (data.instagramHandle?.trim()) {
        requestData.instagramHandle = data.instagramHandle.trim();
      }
      if (data.instagramFollowers?.trim()) {
        requestData.instagramFollowers = data.instagramFollowers.trim();
      }
      if (data.xHandle?.trim()) {
        requestData.xHandle = data.xHandle.trim();
      }
      if (data.xFollowers?.trim()) {
        requestData.xFollowers = data.xFollowers.trim();
      }
      if (data.linkedinUrl?.trim()) {
        requestData.linkedinUrl = data.linkedinUrl.trim();
      }
      if (data.linkedinConnections?.trim()) {
        requestData.linkedinConnections = data.linkedinConnections.trim();
      }
      if (data.youtubeChannel?.trim()) {
        requestData.youtubeChannel = data.youtubeChannel.trim();
      }
      if (data.youtubeFollowers?.trim()) {
        requestData.youtubeFollowers = data.youtubeFollowers.trim();
      }
      if (data.supportGroups?.trim()) {
        requestData.supportGroups = data.supportGroups.trim();
      }
      if (data.audienceDescription?.trim()) {
        requestData.audienceDescription = data.audienceDescription.trim();
      }
      if (data.partnershipReason?.trim()) {
        requestData.partnershipReason = data.partnershipReason.trim();
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

      return await apiService.post<PartnershipResponse>(
        this.endpoint,
        requestData
      );
    } catch (error) {
      // Re-throw with additional context if needed
      throw error;
    }
  }

  /**
   * Get a specific partnership entry by ID (Admin only)
   */
  async getPartnership(id: string): Promise<ApiResponse<PartnershipResponse>> {
    return await apiService.get<PartnershipResponse>(`${this.endpoint}/${id}`);
  }

  /**
   * Search partnership entries with filters (Admin only)
   */
  async searchPartnerships(
    params: PartnershipSearchParams = {}
  ): Promise<ApiResponse<PartnershipSearchResponse>> {
    return await apiService.get<PartnershipSearchResponse>(
      this.endpoint,
      params
    );
  }

  /**
   * Update partnership entry (Admin only)
   */
  async updatePartnership(
    id: string,
    data: Partial<PartnershipCreateRequest>
  ): Promise<ApiResponse<PartnershipResponse>> {
    return await apiService.put<PartnershipResponse>(
      `${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * Delete partnership entry (Admin only)
   */
  async deletePartnership(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Validate partnership form data before submission
   */
  validatePartnershipForm(data: PartnershipFormData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required field validation
    if (!data.firstName.trim()) {
      errors.push('First name is required');
    }

    if (!data.lastName.trim()) {
      errors.push('Last name is required');
    }

    if (!data.email.trim()) {
      errors.push('Email is required');
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errors.push('Email format is invalid');
      }
    }

    if (!data.phone.trim()) {
      errors.push('Phone number is required');
    }

    // Optional field length validation
    if (data.firstName.length > 100) {
      errors.push('First name must be less than 100 characters');
    }

    if (data.lastName.length > 100) {
      errors.push('Last name must be less than 100 characters');
    }

    if (data.email.length > 255) {
      errors.push('Email must be less than 255 characters');
    }

    if (data.phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    if (data.instagramHandle && data.instagramHandle.length > 100) {
      errors.push('Instagram handle must be less than 100 characters');
    }

    if (data.xHandle && data.xHandle.length > 100) {
      errors.push('X handle must be less than 100 characters');
    }

    if (data.linkedinUrl && data.linkedinUrl.length > 500) {
      errors.push('LinkedIn URL must be less than 500 characters');
    }

    if (data.youtubeChannel && data.youtubeChannel.length > 200) {
      errors.push('YouTube channel must be less than 200 characters');
    }

    if (data.audienceDescription && data.audienceDescription.length > 1000) {
      errors.push('Audience description must be less than 1000 characters');
    }

    if (data.partnershipReason && data.partnershipReason.length > 1000) {
      errors.push('Partnership reason must be less than 1000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new PartnershipService();
