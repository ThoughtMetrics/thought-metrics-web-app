// @/services/contact-us.service.ts

import type { ContactFormData } from '@/core/types/contact-us.type';
import type { ApiResponse } from './api.service';
import apiService from './api.service';

export interface ContactUsCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  caseStudyRefNumber?: string;
  subject: string;
  message: string;
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
}

export interface ContactUsResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  caseStudyRefNumber: string;
  subject: string;
  message: string;
  consentCommunication: boolean;
  consentMarketing: boolean;
  consentSubscribe: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactUsSearchParams {
  page?: number;
  limit?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
}

export interface ContactUsSearchResponse {
  data: ContactUsResponse[];
  total: number;
  page: number;
  limit: number;
}

class ContactUsService {
  private readonly endpoint = '/contact-us';

  /**
   * Submit contact us form
   */
  async submitContactForm(
    data: ContactFormData
  ): Promise<ApiResponse<ContactUsResponse>> {
    try {
      // Transform the form data to match backend expectations
      const requestData: ContactUsCreateRequest = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim() || undefined,
        caseStudyRefNumber: data.caseStudyRefNumber.trim() || undefined,
        subject: data.subject.trim(),
        message: data.message.trim(),
        consentCommunication: data.consentCommunication,
        consentMarketing: data.consentMarketing,
        consentSubscribe: data.consentSubscribe,
      };

      return await apiService.post<ContactUsResponse>(
        this.endpoint,
        requestData
      );
    } catch (error) {
      // Re-throw with additional context if needed
      throw error;
    }
  }

  /**
   * Get a specific contact us entry by ID (Admin only)
   */
  async getContactUs(id: string): Promise<ApiResponse<ContactUsResponse>> {
    return await apiService.get<ContactUsResponse>(`${this.endpoint}/${id}`);
  }

  /**
   * Search contact us entries with filters (Admin only)
   */
  async searchContactUs(
    params: ContactUsSearchParams = {}
  ): Promise<ApiResponse<ContactUsSearchResponse>> {
    return await apiService.get<ContactUsSearchResponse>(this.endpoint, params);
  }

  /**
   * Update contact us entry (Admin only)
   */
  async updateContactUs(
    id: string,
    data: Partial<ContactUsCreateRequest>
  ): Promise<ApiResponse<ContactUsResponse>> {
    return await apiService.put<ContactUsResponse>(
      `${this.endpoint}/${id}`,
      data
    );
  }

  /**
   * Delete contact us entry (Admin only)
   */
  async deleteContactUs(id: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>(
      `${this.endpoint}/${id}`
    );
  }

  /**
   * Validate contact form data before submission
   */
  validateContactForm(data: ContactFormData): {
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

    if (!data.subject.trim()) {
      errors.push('Subject is required');
    }

    if (!data.message.trim()) {
      errors.push('Message is required');
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

    if (data.subject.length > 200) {
      errors.push('Subject must be less than 200 characters');
    }

    if (data.message.length > 2000) {
      errors.push('Message must be less than 2000 characters');
    }

    if (data.phone && data.phone.length > 20) {
      errors.push('Phone number must be less than 20 characters');
    }

    if (data.caseStudyRefNumber && data.caseStudyRefNumber.length > 100) {
      errors.push(
        'Case study reference number must be less than 100 characters'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Format contact form data for display
   */
  formatContactFormData(data: ContactFormData): ContactUsCreateRequest {
    return {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim() || '',
      caseStudyRefNumber: data.caseStudyRefNumber.trim() || '',
      subject: data.subject.trim(),
      message: data.message.trim(),
      consentCommunication: data.consentCommunication,
      consentMarketing: data.consentMarketing,
      consentSubscribe: data.consentSubscribe,
    };
  }
}

export default new ContactUsService();
