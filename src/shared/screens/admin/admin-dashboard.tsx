import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';

const AdminDashboardContent: React.FC = () => {
  const { user, userRole, isAdmin, isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await UserManagementService.getUsers({ page: 1, limit: 1 });
        if (response.data) {
          setStats({ totalUsers: response.data.total, loading: false });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ totalUsers: 0, loading: false });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="h-full overflow-y-scroll overflow-x-hidden flex bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome to the admin panel</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-medium capitalize">{userRole || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin Status</p>
                <p className="font-medium">{isAdmin ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Super Admin</p>
                <p className="font-medium">{isSuperAdmin ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Users
              </h3>
              {stats.loading ? (
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Active Campaigns
              </h3>
              <p className="text-3xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Responses
              </h3>
              <p className="text-3xl font-bold text-gray-900">-</p>
              <p className="text-sm text-gray-500 mt-2">Coming soon</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/admin/analytics"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">
                  View Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Check campaign performance and tracking data
                </p>
              </a>
              <a
                href="/admin/users"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </a>
              <div className="block p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                <h3 className="font-medium text-gray-900 mb-1">
                  Create Campaign
                </h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
              <div className="block p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
                <h3 className="font-medium text-gray-900 mb-1">Settings</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main component with AdminRouteGuard
export const AdminDashboard: React.FC = () => {
  return (
    <AdminRouteGuard>
      <AdminDashboardContent />
    </AdminRouteGuard>
  );
};

export default AdminDashboard;
