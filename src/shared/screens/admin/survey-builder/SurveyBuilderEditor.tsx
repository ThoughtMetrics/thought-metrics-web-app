// src/shared/screens/admin/survey-builder/SurveyBuilderEditor.tsx

import React, { useEffect, useCallback, useState } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTemplateQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useCreateTemplate, useUpdateTemplate, useSaveSurveyDraft } from '@/core/hooks/mutations/survey-template.mutations';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import QuestionListPanel from './components/QuestionListPanel';
import QuestionPreviewPanel from './components/QuestionPreviewPanel';
import QuestionConfigPanel from './components/QuestionConfigPanel';
import PublishSurveyModal from './components/PublishSurveyModal';

interface Props {
  templateId?: string;
}

const LOCAL_KEY = (id: string | undefined) => `tm-builder-${id ?? 'new'}`;

const clearLocalDraft = (id: string | undefined) => {
  try { localStorage.removeItem(LOCAL_KEY(id)); } catch {}
};

const SurveyBuilderEditorContent: React.FC<Props> = ({ templateId }) => {
  const { data, isLoading, isError } = useTemplateQuery(templateId);

  const { name, isDirty, questions, settings, translations, setName, setTranslation, loadTemplate, resetEditor, toCreateRequest, toUpdateRequest, undo, redo, _past, _future } =
    useSurveyBuilderStore();

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const saveSurveyDraft = useSaveSurveyDraft();

  const isSaving = createTemplate.isPending || updateTemplate.isPending || saveSurveyDraft.isPending;
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(null);

  // Load template data into store when it arrives
  useEffect(() => {
    if (data?.data) {
      loadTemplate(data.data);
    } else if (!templateId) {
      resetEditor();
    }
  }, [data, templateId]);

  // For new templates: restore from localStorage on mount
  useEffect(() => {
    if (templateId) return;
    try {
      const raw = localStorage.getItem(LOCAL_KEY(undefined));
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.translations || saved.questions) {
          // Restore individual store fields directly — avoids ISurveyTemplate shape requirement
          useSurveyBuilderStore.setState({
            name: saved.name ?? '',
            translations: saved.translations,
            questions: saved.questions ?? [],
            settings: saved.settings,
            isDirty: false,
          });
          setLocalSavedAt(new Date(saved.savedAt));
        }
      }
    } catch {}
  }, []); // mount only

  // Debounced auto-save to localStorage when title is present
  useEffect(() => {
    if (!translations?.en?.label?.trim()) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_KEY(templateId), JSON.stringify({
          name, translations, questions, settings, savedAt: new Date().toISOString(),
        }));
        setLocalSavedAt(new Date());
      } catch {}
    }, 1500);
    return () => clearTimeout(timer);
  }, [name, translations, questions, settings, templateId]);

  // Warn before unloading with unsaved changes.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (useSurveyBuilderStore.getState().isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Undo / Redo keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const slugify = (v: string) =>
    v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

  const handleLabelChange = (value: string) => {
    setTranslation('en', 'label', value);
    if (!templateId) {
      setName(slugify(value));
    }
  };

  // Save Draft — three cases based on template state
  const handleSave = useCallback(async () => {
    const enLabel = translations?.en?.label?.trim();
    if (!name.trim() && enLabel) setName(slugify(enLabel));

    if (!templateId) {
      // New survey — create template (backend auto-creates MySQL draft via _upsertMySQLDraft)
      const res = await createTemplate.mutateAsync(toCreateRequest());
      if (res.data?._id) {
        clearLocalDraft(undefined);
        toast.success('Draft saved');
        window.location.href = `/admin/survey-builder/${res.data._id}`;
      }
    } else if (!data?.data?.surveyId) {
      // Existing template, not yet published — just update the template
      await updateTemplate.mutateAsync({ id: templateId, data: toUpdateRequest() });
      clearLocalDraft(templateId);
    } else {
      // Already published — update template + create a new draft MySQL row for future publishing
      await updateTemplate.mutateAsync({ id: templateId, data: toUpdateRequest() });
      await saveSurveyDraft.mutateAsync({ templateId, label: enLabel || name });
      clearLocalDraft(templateId);
      // saveSurveyDraft.onSuccess handles toast + redirect to /admin/surveys
    }
  }, [templateId, name, translations, data, toCreateRequest, toUpdateRequest, createTemplate, updateTemplate, saveSurveyDraft, setName]);

  // Publish — always open panel immediately, no pre-API calls
  const handlePublishClick = useCallback(() => {
    setShowPublishModal(true);
  }, []);

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

  const allQuestionsHaveText = questions.length > 0 && questions.every((q) => !!q.translations.en.text.trim());
  const isFirstPublish = !data?.data?.surveyId;
  const hasChangesToPublish = isDirty || isFirstPublish;

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
            {localSavedAt && (
              <span className="text-xs text-gray-400" title={`Auto-saved at ${localSavedAt.toLocaleTimeString()}`}>
                ✓ Locally saved {localSavedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}

            <button
              onClick={undo}
              disabled={_past.length === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={redo}
              disabled={_future.length === 0}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCw size={16} />
            </button>

            {!!translations?.en?.label?.trim() && (
              <button
                onClick={handlePublishClick}
                disabled={isSaving || !hasChangesToPublish || !allQuestionsHaveText}
                title={
                  questions.length === 0
                    ? 'Add at least one question before publishing'
                    : !allQuestionsHaveText
                    ? 'All questions must have text before publishing'
                    : !hasChangesToPublish
                    ? 'No changes to publish'
                    : undefined
                }
                className="px-4 py-1.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish
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

      {showPublishModal && (
        <PublishSurveyModal
          templateId={templateId ?? null}
          defaultLabel={translations?.en?.label ?? name}
          defaultFormLayout={settings.defaultFormLayout}
          defaultType={settings.defaultType}
          existingSurveyId={data?.data?.surveyId}
          onClose={() => setShowPublishModal(false)}
          onPublished={() => clearLocalDraft(templateId)}
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
