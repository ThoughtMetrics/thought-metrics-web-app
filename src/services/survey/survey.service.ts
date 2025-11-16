// src/services/survey/survey.service.ts

import apiService, { type ApiResponse } from '@services/api/api.service';
import type {
  ISurvey,
  ISurveyDetails,
  ISurveySubmission,
  ISurveyResponse,
  ISurveyTemplate,
} from '@/core/types/survey.type';
import authService from '@services/api/auth.service';

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
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurvey[]>(this.basePath, params);
  }

  /**
   * Get survey details with template (Public endpoint)
   * Merged endpoint - returns survey + template + userResponse in single call
   * @param surveyId - The survey ID in TM-xxx format (e.g., TM-AD001)
   */
  async getSurveyDetails(
    surveyId: string
  ): Promise<ApiResponse<ISurveyDetails>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    // Endpoint merged: /surveys/:surveyId now returns survey + template + userResponse
    return apiService.get<ISurveyDetails>(`${this.basePath}/${surveyId}`);
  }

  /**
   * Check if survey is available for responses (Public endpoint)
   */
  async checkAvailability(
    surveyId: string
  ): Promise<ApiResponse<{ available: boolean }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<{ available: boolean }>(
      `${this.basePath}/${surveyId}/availability`
    );
  }

  /**
   * Submit survey response (Public endpoint)
   */
  async submitResponse(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ApiResponse<ISurveyResponse>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
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
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.post<ISurveyResponse>(
      `${this.basePath}/${surveyId}/draft`,
      submission
    );
  }

  /**
   * Get user's saved drafts (Authenticated endpoint)
   */
  async getUserDrafts(): Promise<ApiResponse<ISurveyResponse[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurveyResponse[]>(
      `${this.basePath}/responses/drafts`
    );
  }

  /**
   * Get user's survey responses (Authenticated endpoint)
   * NOTE: This endpoint is deprecated. User response status is now included
   * in the survey list response (listPublicSurveys) via the userResponse field.
   * @deprecated Use listPublicSurveys instead - it includes userResponse status
   */
  async getUserResponses(): Promise<ApiResponse<ISurveyResponse[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurveyResponse[]>(
      `${this.basePath}/responses/my-responses`
    );
  }

  /**
   * List survey templates (Admin endpoint)
   */
  async listTemplates(filters?: {
    userId?: string;
    isDefault?: boolean;
  }): Promise<ApiResponse<ISurveyTemplate[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurveyTemplate[]>(
      `${this.basePath}/templates`,
      filters
    );
  }

  /**
   * Get survey statistics (Admin endpoint)
   */
  async getSurveyStatistics(surveyId: string): Promise<
    ApiResponse<{
      total: number;
      submitted: number;
      approved: number;
      declined: number;
      draft: number;
    }>
  > {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/statistics`);
  }
}

export default new SurveyService();
