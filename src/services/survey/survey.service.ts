// src/services/survey/survey.service.ts

import apiService, { type ApiResponse } from '@services/api/api.service';
import type {
  ISurvey,
  ISurveyDetails,
  ISurveySubmission,
  ISurveyResponse,
  ISurveyTemplate,
} from '@/core/types/survey.type';
import type {
  ISurveyTemplateCreateRequest,
  ISurveyTemplateUpdateRequest,
  ISurveyPublishRequest,
  ISurveyUpdateRequest,
} from '@/core/types/survey-builder.type';
import authService from '@services/api/auth.service';
import { getAPIConfig } from '@/core/configs/api-config';

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
   * Submit survey response.
   *
   * Tries the queue microservice first (`PUBLIC_QUEUE_URL`) for higher
   * throughput under load. On any failure (network, 4xx, 5xx, timeout)
   * falls back to the direct main API endpoint transparently.
   *
   * Queue → 202 { success, data: { messageId, queuedAt } }
   * Direct → 201 { success, data: ISurveyResponse }
   *
   * Both resolve to the same ApiResponse<ISurveyResponse> shape so callers
   * do not need to change.
   */
  async submitResponse(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ApiResponse<ISurveyResponse>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();

    const queueURL = getAPIConfig().queueURL;

    // ── Try queue service first ──────────────────────────────────────────────
    if (queueURL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const queueRes = await fetch(
          `${queueURL}/queue/surveys/${surveyId}/submit`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer firebase:${token}`,
            },
            body: JSON.stringify(submission),
          }
        );
        clearTimeout(timeoutId);

        if (queueRes.ok) {
          const body = await queueRes.json() as {
            success: boolean;
            data: { messageId: string; queuedAt: string };
            message: string;
          };

          // Normalise 202 queue response into the ISurveyResponse shape
          // so downstream components don't need to be aware of the difference.
          return {
            success: true,
            data: {
              id: body.data.messageId,
              surveyId,
              status: 'submitted',
              submittedAt: body.data.queuedAt,
            } as unknown as ISurveyResponse,
            message: body.message,
          };
        }
        // Non-2xx from queue — fall through to direct API
      } catch {
        // Network error / timeout — fall through to direct API
      }
    }

    // ── Fallback: direct main API ────────────────────────────────────────────
    apiService.setAuthToken(token);
    return apiService.post<ISurveyResponse>(
      `${this.basePath}/${surveyId}/submit`,
      submission
    );
  }

  /**
   * Edit user's own submitted response (Authenticated endpoint)
   * PATCH /surveys/:surveyId/my-response
   */
  async editMyResponse(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ApiResponse<ISurveyResponse>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.patch<ISurveyResponse>(
      `${this.basePath}/${surveyId}/my-response`,
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
   * Get all responses for a survey with optional date range (Admin endpoint)
   * Used for CSV export in the analytics dashboard
   */
  async getSurveyResponses(
    surveyId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      status?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<ApiResponse<ISurveyResponse[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/responses`, { surveyId, ...params });
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
   * Get a single survey template by ID (Admin endpoint)
   */
  async getTemplate(id: string): Promise<ApiResponse<ISurveyTemplate>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurveyTemplate>(`${this.basePath}/templates/${id}`);
  }

  /**
   * Create a new survey template (Admin endpoint)
   */
  async createTemplate(data: ISurveyTemplateCreateRequest): Promise<ApiResponse<ISurveyTemplate>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.post<ISurveyTemplate>(`${this.basePath}/templates`, data);
  }

  /**
   * Update an existing survey template (Admin endpoint)
   */
  async updateTemplate(id: string, data: ISurveyTemplateUpdateRequest): Promise<ApiResponse<ISurveyTemplate>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.put<ISurveyTemplate>(`${this.basePath}/templates/${id}`, data);
  }

  /**
   * Publish a survey instance from a template (Admin endpoint)
   */
  async publishSurvey(data: ISurveyPublishRequest): Promise<ApiResponse<ISurvey>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.post<ISurvey>(`${this.basePath}/publish`, data);
  }

  /**
   * Save a survey instance as draft without publishing (Admin endpoint)
   */
  async saveSurveyAsDraft(data: ISurveyPublishRequest): Promise<ApiResponse<ISurvey>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.post<ISurvey>(`${this.basePath}/draft`, data);
  }

  /**
   * Publish a draft survey instance (Admin endpoint)
   * @param surveyId - The survey ID in TM-xxx format
   */
  async publishSurveyDraft(surveyId: string): Promise<ApiResponse<ISurvey>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.post<ISurvey>(`${this.basePath}/${surveyId}/publish`, {});
  }

  /**
   * List all surveys for admin (all statuses) (Admin endpoint)
   */
  async listSurveysAdmin(params?: {
    status?: string;
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<ApiResponse<ISurvey[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get<ISurvey[]>(`${this.basePath}/list`, params);
  }

  /**
   * Update a survey instance (Admin endpoint)
   * @param id - Internal numeric MySQL PK (not surveyId)
   */
  async updateSurveyInstance(id: string, data: ISurveyUpdateRequest): Promise<ApiResponse<ISurvey>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.put<ISurvey>(`${this.basePath}/${id}`, data);
  }

  /**
   * Delete a survey instance (Admin endpoint)
   * @param surveyId - The survey ID in TM-xxx format
   */
  async deleteSurveyInstance(surveyId: string): Promise<ApiResponse<{ message: string }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.delete<{ message: string }>(`${this.basePath}/${surveyId}`);
  }

  /**
   * Delete a survey template (Admin endpoint)
   */
  async deleteTemplate(id: string): Promise<ApiResponse<{ message: string }>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.delete<{ message: string }>(`${this.basePath}/templates/${id}`);
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

  /**
   * Get district breakdown for a survey (Admin endpoint)
   * Returns submissions per district
   */
  async getDistrictBreakdown(
    surveyId: string
  ): Promise<ApiResponse<Array<{ district: string; count: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/district`);
  }

  /**
   * Get assembly constituency breakdown for a survey (Admin endpoint)
   * Returns submissions per AC
   */
  async getAcBreakdown(
    surveyId: string
  ): Promise<ApiResponse<Array<{ ac: string; count: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    return apiService.get(`${this.basePath}/${surveyId}/analytics/ac`);
  }

  /**
   * Get GPS location breakdown for a survey (Admin endpoint)
   * Returns grouped coordinates with submission counts (~100m precision)
   */
  async getLocationBreakdown(
    surveyId: string,
    filters?: { zones?: string[]; districts?: string[]; acs?: string[]; userIds?: string[] }
  ): Promise<ApiResponse<Array<{ latitude: number; longitude: number; count: number }>>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    const params: Record<string, string> = {};
    if (filters?.zones?.length)     params.zones     = filters.zones.join(',');
    if (filters?.districts?.length) params.districts = filters.districts.join(',');
    if (filters?.acs?.length)       params.acs       = filters.acs.join(',');
    if (filters?.userIds?.length)   params.userIds   = filters.userIds.join(',');
    return apiService.get(`${this.basePath}/${surveyId}/analytics/locations`, Object.keys(params).length ? params : undefined);
  }

  async getQuestionAnalytics(
    surveyId: string,
    lang?: string,
    filters?: { zones?: string[]; districts?: string[]; acs?: string[]; userIds?: string[] }
  ): Promise<ApiResponse<any[]>> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    apiService.setAuthToken(token);
    const params: Record<string, string> = {};
    if (lang) params.lang = lang;
    if (filters?.zones?.length)     params.zones     = filters.zones.join(',');
    if (filters?.districts?.length) params.districts = filters.districts.join(',');
    if (filters?.acs?.length)       params.acs       = filters.acs.join(',');
    if (filters?.userIds?.length)   params.userIds   = filters.userIds.join(',');
    return apiService.get(`${this.basePath}/${surveyId}/analytics/questions`, Object.keys(params).length ? params : undefined);
  }
}

export default new SurveyService();
