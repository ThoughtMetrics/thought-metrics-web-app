import ApiService from './api.service';
import type { ApiResponse } from './api.service';
import authService from './auth.service';

export interface ImportSurvey {
  id: string;
  surveyId: string;
  label: string;
  status: string;
  type: string;
  currentResponses: number;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnPreview {
  filePath: string;
  mimeType: string;
  headers: string[];
  detectedMap: Record<string, string>;
  sampleRows: Record<string, string>[];
  totalRows: number;
}

export interface ImportJobStatus {
  jobId: string;
  surveyId: string;
  templateMongoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedBy: string;
  columnMap: Record<string, string>;
  totalRows: number;
  processedRows: number;
  insertedCount: number;
  failedCount: number;
  failedRows: Array<{ rowNumber: number; error: string }>;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

class SurveyImportService {
  private readonly basePath = '/survey-import';

  private async ensureAuth() {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    ApiService.setAuthToken(token);
  }

  async listSurveys(): Promise<ImportSurvey[]> {
    await this.ensureAuth();
    const res = await ApiService.get<ImportSurvey[]>(`${this.basePath}/surveys`);
    return res.data ?? [];
  }

  async createSurvey(name: string): Promise<{ surveyId: string; templateMongoId: string }> {
    await this.ensureAuth();
    const res = await ApiService.post<{ surveyId: string; templateMongoId: string }>(
      `${this.basePath}/surveys`,
      { name }
    );
    if (!res.data) throw new Error('Failed to create survey');
    return res.data;
  }

  async previewColumns(surveyId: string, file: File): Promise<ColumnPreview> {
    await this.ensureAuth();
    const formData = new FormData();
    formData.append('file', file);

    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();

    const { getAPIConfig } = await import('@/core/configs/api-config');
    const cfg = getAPIConfig();
    const baseURL = `${cfg.baseURL}${cfg.apiPath}/${cfg.baseAPIVersion}`;

    const response = await fetch(`${baseURL}${this.basePath}/${surveyId}/preview`, {
      method: 'POST',
      headers: { Authorization: `Bearer firebase:${token}` },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.message ?? `Preview failed (${response.status})`);
    }
    return json.data as ColumnPreview;
  }

  async startImport(params: {
    surveyId: string;
    templateMongoId: string;
    filePath: string;
    mimeType: string;
    columnMap: Record<string, string>;
    totalRows: number;
  }): Promise<{ jobId: string }> {
    await this.ensureAuth();
    const { surveyId, ...body } = params;
    const res = await ApiService.post<{ jobId: string }>(
      `${this.basePath}/${surveyId}/import`,
      body
    );
    if (!res.data) throw new Error('Failed to start import');
    return res.data;
  }

  async getJobStatus(jobId: string): Promise<ImportJobStatus> {
    await this.ensureAuth();
    const res = await ApiService.get<ImportJobStatus>(`${this.basePath}/jobs/${jobId}`);
    if (!res.data) throw new Error('Job not found');
    return res.data;
  }

  async listJobs(surveyId: string): Promise<ImportJobStatus[]> {
    await this.ensureAuth();
    const res = await ApiService.get<ImportJobStatus[]>(`${this.basePath}/${surveyId}/jobs`);
    return res.data ?? [];
  }
}

export default new SurveyImportService();
