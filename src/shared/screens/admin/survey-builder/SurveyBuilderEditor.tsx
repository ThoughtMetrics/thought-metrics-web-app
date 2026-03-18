// src/shared/screens/admin/survey-builder/SurveyBuilderEditor.tsx

import React, { useEffect, useCallback, useState } from 'react';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTemplateQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useCreateTemplate, useUpdateTemplate } from '@/core/hooks/mutations/survey-template.mutations';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import QuestionListPanel from './components/QuestionListPanel';
import QuestionPreviewPanel from './components/QuestionPreviewPanel';
import QuestionConfigPanel from './components/QuestionConfigPanel';
import PublishSurveyModal from './components/PublishSurveyModal';

interface Props {
  templateId?: string;
}

const SurveyBuilderEditorContent: React.FC<Props> = ({ templateId }) => {
  const { data, isLoading, isError } = useTemplateQuery(templateId);

  const { name, isDirty, questions, settings, translations, setName, setTranslation, loadTemplate, resetEditor, toCreateRequest, toUpdateRequest } =
    useSurveyBuilderStore();

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const isSaving = createTemplate.isPending || updateTemplate.isPending;
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Load template data into store when it arrives
  useEffect(() => {
    if (data?.data) {
      loadTemplate(data.data);
    } else if (!templateId) {
      resetEditor();
    }
  }, [data, templateId]);

  // Warn before unloading with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const slugify = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

  const handleLabelChange = (value: string) => {
    setTranslation('en', 'label', value);
    if (!templateId) {
      setName(slugify(value));
    }
  };

  const handleSave = useCallback(async () => {
    // Auto-set internal name from label if still empty
    const enLabel = translations?.en?.label?.trim();
    if (!name.trim() && enLabel) {
      setName(slugify(enLabel));
    }
    if (templateId) {
      await updateTemplate.mutateAsync({ id: templateId, data: toUpdateRequest() });
    } else {
      await createTemplate.mutateAsync(toCreateRequest());
    }
  }, [templateId, name, translations, toCreateRequest, toUpdateRequest, createTemplate, updateTemplate, setName]);

  if (isLoading && templateId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <LoaderUI message="Loading template..." />
      </div>
    );
  }

  if (isError && templateId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 max-w-md text-center">
          <p className="font-medium mb-2">Failed to load template</p>
          <a href="/admin/surveys" className="text-primary underline text-sm">
            Back to Surveys
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50 text-text-dark">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <a
            href="/admin/surveys"
            className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
            title="Back to Surveys"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>

          <input
            type="text"
            value={translations?.en?.label ?? ''}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Survey display title (e.g. Political Survey 2026)"
            className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50"
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            {isDirty && (
              <span className="text-xs text-orange-500 font-medium">Unsaved changes</span>
            )}

            {templateId && !!translations?.en?.label?.trim() && questions.every((q) => !!q.translations.en.text.trim()) && (
              <button
                onClick={() => setShowPublishModal(true)}
                disabled={isSaving}
                className="px-4 py-1.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish as Survey
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving…' : 'Save Draft'}
            </button>
          </div>
        </div>

        {/* 3-panel layout */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* LEFT: Question list — 256px */}
          <div className="w-64 flex-shrink-0 overflow-hidden">
            <QuestionListPanel />
          </div>

          {/* CENTER: Preview */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <QuestionPreviewPanel />
          </div>

          {/* RIGHT: Config — 320px */}
          <div className="w-80 flex-shrink-0 overflow-hidden border-l border-gray-200">
            <QuestionConfigPanel />
          </div>
        </div>
      </div>

      {showPublishModal && templateId && (
        <PublishSurveyModal
          templateId={templateId}
          defaultLabel={translations?.en?.label ?? name}
          defaultFormLayout={settings.defaultFormLayout}
          defaultType={settings.defaultType}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
};

export const SurveyBuilderEditor: React.FC<Props> = (props) => (
  <AdminRouteGuard>
    <SurveyBuilderEditorContent {...props} />
  </AdminRouteGuard>
);

export default SurveyBuilderEditor;
