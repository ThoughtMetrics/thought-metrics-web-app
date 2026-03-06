// src/shared/screens/admin/surveys/SurveyManagement.tsx

import React, { useState } from 'react';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useAdminSurveysQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useUpdateSurveyInstance } from '@/core/hooks/mutations/survey-template.mutations';
import type { ISurvey } from '@/core/types/survey.type';
import EditSurveyModal from './components/EditSurveyModal';

type TabValue = 'all' | 'published' | 'draft' | 'archived';

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-amber-100 text-amber-700',
  expired: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-600',
};

const PUBLIC_SITE_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.host}`
  : '';

function formatDate(d?: string | null): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const SurveyManagementContent: React.FC = () => {
  const { data, isLoading, isError } = useAdminSurveysQuery();
  const updateSurvey = useUpdateSurveyInstance();

  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [editingSurvey, setEditingSurvey] = useState<ISurvey | null>(null);

  const allSurveys: ISurvey[] = data?.data ?? [];

  const filtered = activeTab === 'all'
    ? allSurveys
    : allSurveys.filter((s) => (s.status as string) === activeTab);

  const handleArchive = async (survey: ISurvey) => {
    if (!window.confirm(`Archive survey "${survey.label}"?`)) return;
    await updateSurvey.mutateAsync({ id: survey.id, data: { status: 'archived' } });
  };

  const handleCopyLink = (surveyId: string) => {
    void navigator.clipboard.writeText(`${PUBLIC_SITE_URL}/survey-boards/${surveyId}`);
    // A simple visual feedback without extra import
    const el = document.getElementById(`copy-${surveyId}`);
    if (el) { el.textContent = 'Copied!'; setTimeout(() => { el.textContent = 'Copy Link'; }, 2000); }
  };

  const tabs: { label: string; value: TabValue }[] = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Surveys</h1>
              <p className="text-gray-600">Manage published survey instances</p>
            </div>
            <a
              href="/admin/survey-builder"
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + New from Template
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <LoaderUI message="Loading surveys..." />
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              Failed to load surveys. Please refresh.
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">No surveys found.</p>
            </div>
          )}

          {!isLoading && !isError && filtered.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Survey ID</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Label</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Type</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Responses</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Start</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Expires</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{s.surveyId ?? s.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{s.label}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_BADGE[s.status as string] ?? STATUS_BADGE.archived}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                          {s.type ?? 'respondent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {s.currentResponses}{s.maxResponses ? ` / ${s.maxResponses}` : ''}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(s.startDate)}</td>
                      <td className="px-6 py-4 text-gray-600">{s.expireDate ? formatDate(s.expireDate) : 'Never'}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        {s.surveyId && (
                          <button
                            id={`copy-${s.surveyId}`}
                            onClick={() => handleCopyLink(s.surveyId!)}
                            className="text-gray-500 hover:text-gray-800 font-medium"
                          >
                            Copy Link
                          </button>
                        )}
                        <button
                          onClick={() => setEditingSurvey(s)}
                          className="text-primary hover:underline font-medium"
                        >
                          Edit
                        </button>
                        {(s.status as string) !== 'archived' && (
                          <button
                            onClick={() => handleArchive(s)}
                            disabled={updateSurvey.isPending}
                            className="text-red-600 hover:underline font-medium disabled:opacity-50"
                          >
                            Archive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {editingSurvey && (
        <EditSurveyModal
          survey={editingSurvey}
          onClose={() => setEditingSurvey(null)}
        />
      )}
    </div>
  );
};

export const SurveyManagement: React.FC = () => (
  <AdminRouteGuard>
    <SurveyManagementContent />
  </AdminRouteGuard>
);

export default SurveyManagement;
