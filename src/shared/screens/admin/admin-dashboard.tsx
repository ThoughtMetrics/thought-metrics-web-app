import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTrackingLinks } from '@/core/hooks/queries/analytics/index.queries';
import { useAdminSurveysQuery } from '@/core/hooks/queries/survey-templates/index.queries';

const AdminDashboardContent: React.FC = () => {
  const { user, userRole, isAdmin, isSuperAdmin, isAuthReady } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, loading: true });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await UserManagementService.getUsers({
          page: 1,
          limit: 1,
        });
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

  const { data: linksResponse } = useTrackingLinks();
  const { data: surveysResponse } = useAdminSurveysQuery({ status: 'published', limit: 1 });

  const activeCampaigns = (linksResponse?.data ?? []).filter((l) => l.isActive).length;
  const publishedSurveys = surveysResponse?.total ?? 0;

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
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
                <div className="scale-50 -my-4">
                  <LoaderUI message="" />
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Campaigns</h3>
              <p className="text-3xl font-bold text-gray-900">{activeCampaigns}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Published Surveys</h3>
              <p className="text-3xl font-bold text-gray-900">{publishedSurveys}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/admin/surveys"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">Manage Surveys</h3>
                <p className="text-sm text-gray-600">View surveys and campaign tracking links</p>
              </a>
              <a
                href="/admin/users"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">Manage Users</h3>
                <p className="text-sm text-gray-600">
                  View and manage all users
                </p>
              </a>
              <a
                href="/admin/create-tracking-link"
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">Create Campaign</h3>
                <p className="text-sm text-gray-600">Create a new tracking link campaign</p>
              </a>
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
