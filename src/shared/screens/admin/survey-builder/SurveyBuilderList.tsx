// src/shared/screens/admin/survey-builder/SurveyBuilderList.tsx

import React, { useState } from 'react';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTemplatesQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { toast } from 'sonner';
import { useDeleteTemplate } from '@/core/hooks/mutations/survey-template.mutations';
import surveyService from '@/services/survey/survey.service';
import MethodologyPickerModal from './components/MethodologyPickerModal';
import { SURVEY_METHODOLOGY_META, METHODOLOGY_BADGE_COLOR } from '@/core/constants/survey.constants';
import type { SurveyMethodology } from '@/core/types/survey.type';

const SurveyBuilderListContent: React.FC = () => {
  const { data, isLoading, isError } = useTemplatesQuery();
  const deleteTemplate = useDeleteTemplate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

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
      const res = await surveyService.getTemplate(id);
      if (!res.data) throw new Error('Template not found');
      const { questions, translations, settings, name } = res.data as any;
      sessionStorage.setItem('tm-duplicate-prefill', JSON.stringify({ questions, translations, settings, name }));
      window.location.href = '/admin/survey-builder/new';
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to duplicate');
      setDuplicatingId(null);
    }
  };

  return (
    <div className="h-full flex bg-surface-container-low text-text-dark">
      <AdminSidebar />
      {showPicker && <MethodologyPickerModal onClose={() => setShowPicker(false)} />}

      <main className="h-full overflow-y-auto flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-1">Survey Builder</h1>
              <p className="text-on-surface-variant">Manage survey templates</p>
            </div>
            <button
              onClick={() => setShowPicker(true)}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + New Template
            </button>
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
            <div className="bg-surface-container rounded-lg shadow-sm p-12 text-center">
              <p className="text-outline mb-4">No templates yet.</p>
              <button
                onClick={() => setShowPicker(true)}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Create your first template
              </button>
            </div>
          )}

          {!isLoading && !isError && templates.length > 0 && (
            <div className="bg-surface-container rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Template</th>
                    <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Methodology</th>
                    <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Questions</th>
                    <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Default Layout</th>
                    <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Default Type</th>
                    <th className="text-right px-6 py-3 font-semibold text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => {
                    const methodology = (t.settings as any)?.methodology as SurveyMethodology | undefined;
                    const methodMeta = methodology ? SURVEY_METHODOLOGY_META[methodology] : undefined;
                    return (
                      <tr key={t._id} className="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-on-surface">
                            {t.translations?.en?.label ?? t.label ?? '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {methodMeta ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${METHODOLOGY_BADGE_COLOR[methodMeta.category]}`}>
                              {methodMeta.label}
                            </span>
                          ) : (
                            <span className="text-xs text-outline">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{t.questions?.length ?? 0}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant capitalize">
                            {t.settings?.defaultFormLayout ?? 'paginated'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            (t.settings?.defaultType ?? 'respondent') === 'agent'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}>
                            {t.settings?.defaultType ?? 'respondent'}
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
                            className="text-on-surface-variant hover:underline font-medium disabled:opacity-50"
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
                    );
                  })}
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

// ─── Panel export for embedding in the Surveys hub ───────────────────────────

const SurveyBuilderListPanelContent: React.FC = () => {
  const { data, isLoading, isError } = useTemplatesQuery();
  const deleteTemplate = useDeleteTemplate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

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
      const res = await surveyService.getTemplate(id);
      if (!res.data) throw new Error('Template not found');
      const { questions, translations, settings, name } = res.data as any;
      sessionStorage.setItem('tm-duplicate-prefill', JSON.stringify({ questions, translations, settings, name }));
      window.location.href = '/admin/survey-builder/new';
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to duplicate');
      setDuplicatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoaderUI message="Loading templates..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        Failed to load templates. Please refresh.
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <>
        {showPicker && <MethodologyPickerModal onClose={() => setShowPicker(false)} />}
        <div className="bg-surface-container rounded-lg shadow-sm p-12 text-center">
          <p className="text-outline mb-4">No templates yet.</p>
          <button
            onClick={() => setShowPicker(true)}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create your first template
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {showPicker && <MethodologyPickerModal onClose={() => setShowPicker(false)} />}
      <div className="bg-surface-container rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Template</th>
              <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Methodology</th>
              <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Questions</th>
              <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Default Layout</th>
              <th className="text-left px-6 py-3 font-semibold text-on-surface-variant">Default Type</th>
              <th className="text-right px-6 py-3 font-semibold text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => {
              const methodology = (t.settings as any)?.methodology as SurveyMethodology | undefined;
              const methodMeta = methodology ? SURVEY_METHODOLOGY_META[methodology] : undefined;
              return (
                <tr key={t._id} className="border-b border-outline-variant/50 hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-on-surface">
                      {t.translations?.en?.label ?? t.label ?? '—'}
                    </div>
                    <div className="text-xs text-outline mt-0.5">{t.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    {methodMeta ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${METHODOLOGY_BADGE_COLOR[methodMeta.category]}`}>
                        {methodMeta.label}
                      </span>
                    ) : (
                      <span className="text-xs text-outline">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">{t.questions?.length ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-surface-container-high text-on-surface-variant capitalize">
                      {t.settings?.defaultFormLayout ?? 'paginated'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                      (t.settings?.defaultType ?? 'respondent') === 'agent'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
                      {t.settings?.defaultType ?? 'respondent'}
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
                      className="text-on-surface-variant hover:underline font-medium disabled:opacity-50"
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const SurveyBuilderListPanel: React.FC = () => <SurveyBuilderListPanelContent />;
