// src/shared/screens/admin/survey-builder/SurveyBuilderList.tsx

import React, { useState } from 'react';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTemplatesQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useDeleteTemplate, useDuplicateTemplate } from '@/core/hooks/mutations/survey-template.mutations';

const SurveyBuilderListContent: React.FC = () => {
  const { data, isLoading, isError } = useTemplatesQuery();
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const templates = data?.data ?? [];

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteTemplate.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setDuplicatingId(id);
    try {
      await duplicateTemplate.mutateAsync(id);
    } finally {
      setDuplicatingId(null);
    }
  };

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <main className="h-full overflow-y-scroll flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Survey Builder</h1>
              <p className="text-gray-600">Manage survey templates</p>
            </div>
            <a
              href="/admin/survey-builder/new"
              className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + New Template
            </a>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <LoaderUI message="Loading templates..." />
            </div>
          )}

          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              Failed to load templates. Please refresh.
            </div>
          )}

          {!isLoading && !isError && templates.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 mb-4">No templates yet.</p>
              <a
                href="/admin/survey-builder/new"
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Create your first template
              </a>
            </div>
          )}

          {!isLoading && !isError && templates.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">EN Label</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Questions</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-700">Default Layout</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{t.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {t.translations?.en?.label ?? t.label ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{t.questions?.length ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {t.settings?.defaultFormLayout ?? 'paginated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <a
                          href={`/admin/survey-builder/${t._id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDuplicate(t._id)}
                          disabled={duplicatingId === t._id}
                          className="text-gray-600 hover:underline font-medium disabled:opacity-50"
                        >
                          {duplicatingId === t._id ? 'Copying…' : 'Duplicate'}
                        </button>
                        <button
                          onClick={() => handleDelete(t._id, t.name)}
                          disabled={deletingId === t._id}
                          className="text-red-600 hover:underline font-medium disabled:opacity-50"
                        >
                          {deletingId === t._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export const SurveyBuilderList: React.FC = () => (
  <AdminRouteGuard>
    <SurveyBuilderListContent />
  </AdminRouteGuard>
);

export default SurveyBuilderList;
