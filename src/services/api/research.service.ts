// @/services/api/research.service.ts

import type { ResearchFormData } from '@/core/types/start-research-item.type';
import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface ResearchCreateRequest {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  countryCode?: string;
  company: string;
  jobTitle: string;
  researchTopic: string;
  projectDetails: string;
  helpOptions?: string[];
  researchType?: string[];
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
}

export interface ResearchResponse {
  id: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  countryCode?: string;
  company: string;
  jobTitle: string;
  researchTopic: string;
  projectDetails: string;
  helpOptions?: string[];
  researchType?: string[];
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSearchParams {
  firstName?: string;
  lastName?: string;
  businessEmail?: string;
  company?: string;
  countryOrRegion?: string;
  researchTopic?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface ResearchSearchResponse {
  data: ResearchResponse[];
  total: number;
  page: number;
  limit: number;
}

class ResearchService {
  private readonly endpoint = '/research';

  /**
   * Submit research form
   */
  async submitResearchForm(
    data: ResearchFormData
  ): Promise<ApiResponse<ResearchResponse>> {
    try {
      // Transform the form data to match backend expectations
      const requestData: any = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        businessEmail: data.businessEmail?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        countryOrRegion: data.countryOrRegion?.trim(),
        company: data.company?.trim(),
        jobTitle: data.jobTitle?.trim(),
        researchTopic: data.researchTopic?.trim(),
        projectDetails: data.projectDetails?.trim(),
        consentCommunication: data.consentCommunication,
        consentMarketing: data.consentMarketing,
        consentSubscribe: data.consentSubscribe,
      };

      // Add optional fields only if they exist
      if (data.countryCode?.trim()) {
        requestData.countryCode = data.countryCode.trim();
      }
      if (data.helpOptions && data.helpOptions.length > 0) {
        requestData.helpOptions = data.helpOptions;
      }
      if (data.researchType && data.researchType.length > 0) {
        requestData.researchType = data.researchType;
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

      return await apiService.post<ResearchResponse>(
        this.endpoint,
        requestData
      );
    } catch (error) {
      // Re-throw with additional context if needed
      throw error;
    }
  }

  /**
   * Get a specific research entry by ID (Admin only)
   */
  async getResearch(id: string): Promise<ApiResponse<ResearchResponse>> {
    return await apiService.get<ResearchResponse>(`${this.endpoint}/${id}`);
  }

  /**
   * Search research entries with filters (Admin only)
   */
  async searchResearch(
    params: ResearchSearchParams = {}
  ): Promise<ApiResponse<ResearchSearchResponse>> {
    return await apiService.get<ResearchSearchResponse>(this.endpoint, params);
  }

  /**
   * Update research entry (Admin only)
   */
  async updateResearch(
    id: string,
    data: Partial<ResearchCreateRequest>
  ): Promise<ApiResponse<ResearchResponse>> {
    return await apiService.put<ResearchResponse>(
      `${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * Delete research entry (Admin only)
   */
  async deleteResearch(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Validate research form data before submission
   */
  validateResearchForm(data: ResearchFormData): {
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

    if (!data.businessEmail.trim()) {
      errors.push('Business email is required');
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.businessEmail.trim())) {
        errors.push('Email format is invalid');
      }
    }

    if (!data.phone.trim()) {
      errors.push('Phone number is required');
    }

    if (!data.countryOrRegion.trim()) {
      errors.push('Country or region is required');
    }

    if (!data.company.trim()) {
      errors.push('Company is required');
    }

    if (!data.jobTitle.trim()) {
      errors.push('Job title is required');
    }

    if (!data.researchTopic.trim()) {
      errors.push('Research topic is required');
    }

    if (!data.projectDetails.trim()) {
      errors.push('Project details are required');
    }

    if (!data.consentCommunication) {
      errors.push('Communication consent is required');
    }

    // Optional field length validation
    if (data.firstName.length > 100) {
      errors.push('First name must be less than 100 characters');
    }

    if (data.lastName.length > 100) {
      errors.push('Last name must be less than 100 characters');
    }

    if (data.businessEmail.length > 255) {
      errors.push('Email must be less than 255 characters');
    }

    if (data.phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    if (data.company.length > 200) {
      errors.push('Company must be less than 200 characters');
    }

    if (data.jobTitle.length > 200) {
      errors.push('Job title must be less than 200 characters');
    }

    if (data.researchTopic.length > 500) {
      errors.push('Research topic must be less than 500 characters');
    }

    if (data.projectDetails.length > 2000) {
      errors.push('Project details must be less than 2000 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new ResearchService();
