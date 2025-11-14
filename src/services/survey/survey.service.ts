// src/services/survey/survey.service.ts

import apiService, { type ApiResponse } from '@/services/api/api.service';
import type {
  ISurvey,
  ISurveyDetails,
  ISurveySubmission,
  ISurveyResponse,
  ISurveyTemplate
} from '@/core/types/survey.type';

class SurveyService {
  private readonly basePath = '/surveys';

  /**
   * List all published surveys (Public endpoint)
   */
  async listPublicSurveys(params?: {
    status?: string;
    visibility?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<ISurvey[]>> {
    return apiService.get<ISurvey[]>(this.basePath, params);
  }

  /**
   * Get survey details with template (Public endpoint)
   */
  async getSurveyDetails(surveyId: string): Promise<ApiResponse<ISurveyDetails>> {
    return apiService.get<ISurveyDetails>(`${this.basePath}/${surveyId}/details`);
  }

  /**
   * Check if survey is available for responses (Public endpoint)
   */
  async checkAvailability(surveyId: string): Promise<ApiResponse<{ available: boolean }>> {
    return apiService.get<{ available: boolean }>(`${this.basePath}/${surveyId}/availability`);
  }

  /**
   * Submit survey response (Public endpoint)
   */
  async submitResponse(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ApiResponse<ISurveyResponse>> {
    return apiService.post<ISurveyResponse>(
      `${this.basePath}/${surveyId}/submit`,
      submission
    );
  }

  /**
   * Save survey response as draft (Authenticated endpoint)
   */
  async saveDraft(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ApiResponse<ISurveyResponse>> {
    return apiService.post<ISurveyResponse>(
      `${this.basePath}/${surveyId}/draft`,
      submission
    );
  }

  /**
   * Get user's saved drafts (Authenticated endpoint)
   */
  async getUserDrafts(): Promise<ApiResponse<ISurveyResponse[]>> {
    return apiService.get<ISurveyResponse[]>(`${this.basePath}/responses/drafts`);
  }

  /**
   * Get user's survey responses (Authenticated endpoint)
   * Returns all responses (both draft and submitted) for the current user
   */
  async getUserResponses(): Promise<ApiResponse<ISurveyResponse[]>> {
    return apiService.get<ISurveyResponse[]>(`${this.basePath}/responses/my-responses`);
  }

  /**
   * List survey templates (Admin endpoint)
   */
  async listTemplates(filters?: {
    userId?: string;
    isDefault?: boolean;
  }): Promise<ApiResponse<ISurveyTemplate[]>> {
    return apiService.get<ISurveyTemplate[]>(`${this.basePath}/templates`, filters);
  }

  /**
   * Get survey statistics (Admin endpoint)
   */
  async getSurveyStatistics(surveyId: string): Promise<ApiResponse<{
    total: number;
    submitted: number;
    approved: number;
    declined: number;
    draft: number;
  }>> {
    return apiService.get(`${this.basePath}/${surveyId}/statistics`);
  }
}

export default new SurveyService();
