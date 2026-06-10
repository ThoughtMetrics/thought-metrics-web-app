import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import UserManagementService from '@/services/api/user-management.service';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import ApiService from '@/services/api/api.service';
import authService from '@/services/api/auth.service';

interface StorageInfo {
  storageUsed: number;
  storageQuota: number | null;
  usagePercent: number;
}

interface SurveyItem {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  currentResponses?: number;
}

const CLIENT_QUOTA = 20 * 1024 * 1024;

function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="bg-surface-container rounded-xl shadow-sm p-6 border border-outline-variant/50">
      <p className="text-sm font-medium text-outline">{label}</p>
      <div className="text-3xl font-bold text-on-surface mt-2">{value}</div>
      {sub && <p className="text-xs text-outline/40 mt-1">{sub}</p>}
    </div>
  );
}

const ClientDashboardContent: React.FC = () => {
  const { user, userRole } = useAuth();
  const [storage, setStorage] = useState<StorageInfo | null>(null);
  const [templates, setTemplates] = useState<SurveyItem[]>([]);
  const [templatesTotal, setTemplatesTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const firebaseUser = authService.getCurrentUser();
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          ApiService.setAuthToken(token);
        }

        const [storageRes, templatesRes] = await Promise.allSettled([
          UserManagementService.getStorageUsage(),
          ApiService.get<any>('/surveys/templates', { limit: 5 }),
        ]);

        if (storageRes.status === 'fulfilled' && storageRes.value.data) {
          setStorage(storageRes.value.data as StorageInfo);
        }
        if (templatesRes.status === 'fulfilled' && templatesRes.value.data) {
          const d = templatesRes.value.data;
          setTemplates(d.templates || d.data || []);
          setTemplatesTotal(d.total || 0);
        }
      } catch {
        // non-fatal
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fmtStorage = (bytes: number) =>
    bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  const storageColor =
    storage && storage.usagePercent >= 95 ? 'text-red-600' :
    storage && storage.usagePercent >= 80 ? 'text-amber-500' : 'text-indigo-600';

  const storageDisplay = storage
    ? `${fmtStorage(storage.storageUsed)} / ${fmtStorage(storage.storageQuota ?? CLIENT_QUOTA)}`
    : '— / 20 MB';

  if (loading) {
    return (
      <div className="h-full flex bg-surface-container-low">
        <ClientSidebar />
        <div className="flex-1 flex items-center justify-center"><LoaderUI message="Loading..." /></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-surface-container-low text-text-dark">
      <ClientSidebar />

      <main className="h-full overflow-y-auto flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface">
              Welcome{user?.displayName ? `, ${user.displayName}` : ''}
            </h1>
            <p className="text-outline mt-1 capitalize">{userRole} account</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <StatCard label="My Surveys" value={templatesTotal} sub="total templates" />
            <StatCard
              label="Storage Used"
              value={<span className={storageColor}>{storageDisplay}</span>}
              sub={storage ? `${storage.usagePercent}% used` : undefined}
            />
            <div className="bg-surface-container rounded-xl shadow-sm p-6 border border-outline-variant/50 flex flex-col justify-between">
              <p className="text-sm font-medium text-outline">Quick Action</p>
              <a href="/client/survey-builder/new"
                className="mt-4 inline-block bg-primary text-white text-center px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm">
                + New Survey
              </a>
            </div>
          </div>

          {/* Storage bar */}
          {storage && storage.storageQuota && (
            <div className="bg-surface-container rounded-xl shadow-sm p-6 border border-outline-variant/50 mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-on-surface-variant">Storage Quota</h2>
                <span className={`text-sm font-medium ${storageColor}`}>{storage.usagePercent}%</span>
              </div>
              <div className="w-full bg-surface-container-high rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    storage.usagePercent >= 95 ? 'bg-red-500' : storage.usagePercent >= 80 ? 'bg-amber-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${storage.usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-outline/40 mt-1">
                <span>{fmtStorage(storage.storageUsed)} used</span>
                <span>{fmtStorage((storage.storageQuota ?? CLIENT_QUOTA) - storage.storageUsed)} available</span>
              </div>
            </div>
          )}

          {/* Recent Surveys */}
          <div className="bg-surface-container rounded-xl shadow-sm border border-outline-variant/50">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/50">
              <h2 className="font-semibold text-on-surface">Recent Surveys</h2>
              <a href="/client/surveys" className="text-sm text-primary hover:underline">View all</a>
            </div>
            {templates.length === 0 ? (
              <div className="p-8 text-center text-outline/40 text-sm">
                No surveys yet.{' '}
                <a href="/client/survey-builder/new" className="text-primary hover:underline">Create your first survey</a>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-outline uppercase">Responses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {templates.map((t) => (
                    <tr key={t._id} className="hover:bg-surface-container-high">
                      <td className="px-6 py-3 font-medium text-on-surface">
                        <a href={`/client/survey-builder/${t._id}`} className="hover:text-primary">{t.name || '(Untitled)'}</a>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          t.status === 'published' ? 'bg-green-100 text-green-700' :
                          t.status === 'draft' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-yellow-100 text-yellow-700'
                        }`}>{t.status || 'draft'}</span>
                      </td>
                      <td className="px-6 py-3 text-outline">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                      <td className="px-6 py-3 text-outline">{t.currentResponses ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const ClientDashboard: React.FC = () => (
  <ClientRouteGuard>
    <ClientDashboardContent />
  </ClientRouteGuard>
);

export default ClientDashboard;
