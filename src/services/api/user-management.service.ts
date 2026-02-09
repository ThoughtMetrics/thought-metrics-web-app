import ApiService from './api.service';
import type { ApiResponse } from './api.service';
import type { UserProfile, UserRole, UserZonal } from '@/core/types/user.type';

export interface UserListParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  zonal?: UserZonal;
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
  zonal: UserZonal;
}

class UserManagementService {
  /**
   * Get all users with pagination and filters
   */
  async getUsers(params?: UserListParams): Promise<ApiResponse<UserListResponse>> {
    return await ApiService.get<UserListResponse>('/users', params);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserProfile>> {
    return await ApiService.get<UserProfile>(`/users/${userId}`);
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<UserProfile>> {
    return await ApiService.post<UserProfile>('/users/change-role', { userId, role });
  }

  /**
   * Update user zonal (admin only)
   */
  async updateUserZonal(userId: string, zonal: UserZonal): Promise<ApiResponse<UserProfile>> {
    return await ApiService.post<UserProfile>('/users/change-zonal', { userId, zonal });
  }

  /**
   * Update user profile (admin can update any user)
   */
  async updateUser(userId: string, data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return await ApiService.put<UserProfile>(`/users/${userId}`, data);
  }

  /**
   * Delete user (soft delete - admin only)
   */
  async deleteUser(userId: string): Promise<ApiResponse<UserProfile>> {
    return await ApiService.patch<UserProfile>(`/users/${userId}/deactivate`, {});
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<any>> {
    return await ApiService.get<any>('/users/stats');
  }
}

export default new UserManagementService();
