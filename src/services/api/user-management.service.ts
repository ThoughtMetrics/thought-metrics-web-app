import ApiService from './api.service';
import type { ApiResponse } from './api.service';
import type { UserProfile, UserRole } from '@/core/types/user.type';
import authService from './auth.service';

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  zone?: string;
  district?: string;
  ac?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: UserRole;
}

export interface UpdateUserZonalRequest {
  userId: string;
  acNos: number[];
}

export interface UpdateUserRoleZonalRequest {
  userId: string;
  role: UserRole;
  acNos?: number[];
  zone?: string;
}

export interface AdminCreateUserRequest {
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  acNos?: number[];
  zone?: string;
  sendWelcomeEmail: boolean;
}

export interface BulkJobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  summary: {
    total: number;
    processed: number;
    created: number;
    failed: number;
    skipped: number;
  };
  failedRows: Array<{ rowNumber: number; email: string; error: string }>;
  completedAt?: string;
  createdAt: string;
}

class UserManagementService {
  private async ensureAuth() {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken();
    ApiService.setAuthToken(token);
  }

  /**
   * Get all users with pagination and filters
   */
  async getUsers(params?: UserListParams): Promise<ApiResponse<UserListResponse>> {
    await this.ensureAuth();
    return await ApiService.get<UserListResponse>('/users', params);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    return await ApiService.get<UserProfile>(`/users/${userId}`);
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    return await ApiService.post<UserProfile>('/users/change-role', { userId, role });
  }

  /**
   * Update user zonal by assembly constituency numbers (admin only) — multi-zone support
   */
  async updateUserZonal(userId: string, acNos: number[]): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    return await ApiService.post<UserProfile>('/users/change-zonal', { userId, acNos });
  }

  /**
   * Update user role and zonal in a single atomic request (admin only)
   * acNos is optional — omit to update role only
   */
  async updateUserRoleAndZonal(userId: string, role: UserRole, acNos?: number[], zone?: string): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    const body: UpdateUserRoleZonalRequest = { userId, role };
    if (acNos && acNos.length > 0) body.acNos = acNos;
    if (zone) body.zone = zone;
    return await ApiService.post<UserProfile>('/users/change-role-zonal', body);
  }

  /**
   * Update user profile (admin can update any user)
   */
  async updateUser(userId: string, data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    return await ApiService.put<UserProfile>(`/users/${userId}`, data);
  }

  /**
   * Delete user (soft delete - admin only)
   */
  async deleteUser(userId: string): Promise<ApiResponse<UserProfile>> {
    await this.ensureAuth();
    return await ApiService.patch<UserProfile>(`/users/${userId}/deactivate`, {});
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    await this.ensureAuth();
    return await ApiService.get<any>('/users/stats');
  }

  /**
   * Admin: create a single user with default password
   */
  async adminCreateUser(data: AdminCreateUserRequest): Promise<ApiResponse<{ user: UserProfile }>> {
    await this.ensureAuth();
    // For non-field-incharge roles, strip zone (backend validates this via Joi .when/.forbidden)
    const payload: AdminCreateUserRequest = { ...data };
    if (payload.role !== 'field-incharge') delete payload.zone;
    return await ApiService.post<{ user: UserProfile }>('/users/admin/create', payload);
  }

  /**
   * Admin: bulk import users from Excel file
   */
  async bulkImportUsers(file: File): Promise<ApiResponse<{ jobId: string; totalRows: number; totalBatches: number }>> {
    await this.ensureAuth();
    return await ApiService.uploadFile<{ jobId: string; totalRows: number; totalBatches: number }>('/users/admin/bulk-import', file);
  }

  /**
   * Admin: get bulk import job status
   */
  async getBulkJobStatus(jobId: string): Promise<ApiResponse<BulkJobStatus>> {
    await this.ensureAuth();
    return await ApiService.get<BulkJobStatus>(`/users/admin/bulk-jobs/${jobId}`);
  }

  /**
   * Get storage usage for the authenticated user (client portal)
   */
  async getStorageUsage(): Promise<ApiResponse<{ storageUsed: number; storageQuota: number | null; storageAvailable: number | null; usagePercent: number }>> {
    await this.ensureAuth();
    return await ApiService.get('/users/storage');
  }

  /**
   * List team members for the authenticated client's company
   */
  async getTeamMembers(): Promise<ApiResponse<{ members: UserProfile[]; companyId: string }>> {
    await this.ensureAuth();
    return await ApiService.get('/users/team');
  }

  /**
   * Create a team member (company owner only)
   */
  async createTeamMember(data: { email: string; firstName: string; lastName?: string }): Promise<ApiResponse<{ user: UserProfile }>> {
    await this.ensureAuth();
    return await ApiService.post('/users/team', data);
  }

  /**
   * Remove a team member (company owner only)
   */
  async removeTeamMember(memberId: string): Promise<ApiResponse<void>> {
    await this.ensureAuth();
    return await ApiService.delete(`/users/team/${memberId}`);
  }
}

export default new UserManagementService();
