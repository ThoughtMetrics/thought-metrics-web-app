// @/services/api/download-report.service.ts

import type { DownloadReportFormData } from '@/core/types/report-download-form.type';
import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface DownloadReportCreateRequest {
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  company: string;
  jobTitle: string;
  countryCode?: string;
  subscribeNewsletter: boolean;
  dataUsageConsent: boolean;
}

export interface DownloadReportResponse {
  id: string;
  firstName: string;
  lastName: string;
  businessEmail: string;
  phone: string;
  countryOrRegion: string;
  company: string;
  jobTitle: string;
  countryCode?: string;
  subscribeNewsletter: boolean;
  dataUsageConsent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadReportSearchParams {
  firstName?: string;
  lastName?: string;
  businessEmail?: string;
  company?: string;
  countryOrRegion?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface DownloadReportSearchResponse {
  data: DownloadReportResponse[];
  total: number;
  page: number;
  limit: number;
}

class DownloadReportService {
  private readonly endpoint = '/forms/download-report';

  /**
   * Submit download report form
   */
  async submitDownloadReportForm(
    data: DownloadReportFormData
  ): Promise<ApiResponse<DownloadReportResponse>> {
    try {
      // Transform the form data to match backend expectations
      const requestData: any = {
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        businessEmail: data.businessEmail?.trim().toLowerCase(),
        phone: data.phone?.trim(),
        countryOrRegion: data.countryOrRegion?.trim(),
        company: data.company?.trim(),
        countryCode: data.countryCode?.trim(),
        subscribeNewsletter: data.subscribeNewsletter,
        dataUsageConsent: data.dataUsageConsent,
      };

      // Add optional fields only if they exist
      if (data.jobTitle?.trim()) {
        requestData.jobTitle = data.jobTitle.trim();
      }

      // Remove any null or undefined values
      Object.keys(requestData).forEach((key) => {
        if (requestData[key] === null || requestData[key] === undefined || requestData[key] === '') {
          delete requestData[key];
        }
      });

      return await apiService.post<DownloadReportResponse>(
        this.endpoint,
        requestData
      );
    } catch (error) {
      // Re-throw with additional context if needed
      throw error;
    }
  }

  /**
   * Get a specific download report entry by ID (Admin only)
   */
  async getDownloadReport(
    id: string
  ): Promise<ApiResponse<DownloadReportResponse>> {
    return await apiService.get<DownloadReportResponse>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Search download report entries with filters (Admin only)
   */
  async searchDownloadReports(
    params: DownloadReportSearchParams = {}
  ): Promise<ApiResponse<DownloadReportSearchResponse>> {
    return await apiService.get<DownloadReportSearchResponse>(
      this.endpoint,
      params
    );
  }

  /**
   * Update download report entry (Admin only)
   */
  async updateDownloadReport(
    id: string,
    data: Partial<DownloadReportCreateRequest>
  ): Promise<ApiResponse<DownloadReportResponse>> {
    return await apiService.put<DownloadReportResponse>(
      `${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * Delete download report entry (Admin only)
   */
  async deleteDownloadReport(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Validate download report form data before submission
   */
  validateDownloadReportForm(data: DownloadReportFormData): {
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

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format download report form data for display
   */
  formatDownloadReportFormData(
    data: DownloadReportFormData
  ): DownloadReportCreateRequest {
    return {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      businessEmail: data.businessEmail.trim().toLowerCase(),
      phone: data.phone.trim(),
      countryOrRegion: data.countryOrRegion.trim(),
      company: data.company.trim(),
      jobTitle: data.jobTitle.trim(),
      countryCode: data.countryCode?.trim(),
      subscribeNewsletter: data.subscribeNewsletter,
      dataUsageConsent: data.dataUsageConsent,
    };
  }
}

export default new DownloadReportService();
