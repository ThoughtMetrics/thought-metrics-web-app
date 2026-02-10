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
   * @param params - Query parameters including language and type
   */
  async listPublicSurveys(params?: {
    status?: string;
    visibility?: string;
    type?: string; // Survey type: 'respondent' or 'agent'
    page?: number;
    limit?: number;
    search?: string;
    lang?: string; // Language parameter (e.g., 'en', 'ta')
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
   * @param lang - Language code (e.g., 'en', 'ta')
   */
  async getSurveyDetails(
    surveyId: string,
    lang?: string
  ): Promise<ApiResponse<ISurveyDetails>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    // Endpoint merged: /survey/:surveyId now returns survey + template + userResponse
    const params = lang ? { lang } : undefined;
    return apiService.get<ISurveyDetails>(`${this.basePath}/${surveyId}`, params);
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

  /**
   * Upload survey file to Azure Blob Storage
   * @param file - The file to upload
   * @param surveyId - The survey ID
   * @param questionId - The question ID
   */
  async uploadFile(
    file: File,
    surveyId: string,
    questionId: string
  ): Promise<ApiResponse<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.uploadFile(
      `${this.basePath}/upload`,
      file,
      { surveyId, questionId }
    );
  }

  /**
   * Upload identity document to Azure Blob Storage
   * @param file - The file to upload
   * @param surveyId - The survey ID
   * @param questionId - The question ID
   */
  async uploadIdentityDocument(
    file: File,
    surveyId: string,
    questionId: string
  ): Promise<ApiResponse<{
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.uploadFile(
      `${this.basePath}/upload/identity`,
      file,
      { surveyId, questionId }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                           ANALYTICS ENDPOINTS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Get analytics summary for a survey (Admin endpoint)
   * Includes total, today, zonal breakdown, and top users
   */
  async getSurveyAnalytics(surveyId: string): Promise<ApiResponse<{
    surveyId: string;
    totalSubmissions: number;
    todaySubmissions: number;
    zonalBreakdown: Array<{ zone: string; count: number }>;
    topUsers: Array<{ userId: string; total: number; zone: string; todayCount: number }>;
  }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics`);
  }

  /**
   * Get daily breakdown for a survey (Admin endpoint)
   * Returns submissions per day for the last N days
   */
  async getDailyBreakdown(
    surveyId: string,
    limit: number = 30
  ): Promise<ApiResponse<Array<{ date: string; count: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/daily`, { limit });
  }

  /**
   * Get zonal breakdown for a survey (Admin endpoint)
   * Returns submissions per zone
   */
  async getZonalBreakdown(
    surveyId: string
  ): Promise<ApiResponse<Array<{ zone: string; count: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/zonal`);
  }

  /**
   * Get top users for a survey (Admin endpoint)
   * Returns users with most submissions
   */
  async getTopUsers(
    surveyId: string,
    limit: number = 10
  ): Promise<ApiResponse<Array<{ userId: string; total: number; zone: string; todayCount: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/users`, { limit });
  }

  /**
   * Get user-specific statistics for a survey (Admin/Self endpoint)
   */
  async getUserAnalytics(
    surveyId: string,
    userId: string
  ): Promise<ApiResponse<{ userId: string; total: number; zone: string; todayCount: number }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/users/${userId}`);
  }
}

export default new SurveyService();
