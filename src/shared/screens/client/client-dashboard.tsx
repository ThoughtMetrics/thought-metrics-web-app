import React from 'react';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useAuth } from '@/shared/providers/auth-provider';
import { useAdminSurveysQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useTemplatesQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useTrackingLinks } from '@/core/hooks/queries/analytics/index.queries';

const ClientDashboardContent: React.FC = () => {
  const { user } = useAuth();

  const { data: publishedData, isLoading: publishedLoading } = useAdminSurveysQuery({ status: 'published' });
  const { data: draftData, isLoading: draftLoading } = useAdminSurveysQuery({ status: 'draft' });
  const { data: templatesData, isLoading: templatesLoading } = useTemplatesQuery();
  const { data: linksData, isLoading: linksLoading } = useTrackingLinks();

  const publishedCount = publishedData?.data?.length ?? 0;
  const draftCount = draftData?.data?.length ?? 0;
  const templateCount = templatesData?.data?.length ?? 0;
  const campaignCount = (linksData?.data as any[])?.length ?? 0;

  const isLoading = publishedLoading || draftLoading || templatesLoading || linksLoading;

  const stats = [
    { label: 'Published Surveys', value: publishedCount, href: '/dashboard/surveys?status=published', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Draft Surveys', value: draftCount, href: '/dashboard/surveys?status=draft', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Templates', value: templateCount, href: '/dashboard/survey-builder', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Campaigns', value: campaignCount, href: '/dashboard/campaigns', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <ClientSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome{user?.displayName ? `, ${user.displayName}` : ''}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoaderUI message="Loading your workspace..." />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <a
                    key={stat.label}
                    href={stat.href}
                    className={`rounded-xl border p-5 hover:shadow-md transition-shadow ${stat.color}`}
                  >
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium">{stat.label}</div>
                  </a>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/dashboard/survey-builder/new"
                    className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    + Create New Survey
                  </a>
                  <a
                    href="/dashboard/surveys"
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View My Surveys
                  </a>
                  <a
                    href="/dashboard/campaigns"
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Manage Campaigns
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export const ClientDashboard: React.FC = () => (
  <ClientRouteGuard>
    <ClientDashboardContent />
  </ClientRouteGuard>
);

export default ClientDashboard;
