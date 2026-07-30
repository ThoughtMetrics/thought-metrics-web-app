// src/shared/screens/admin/survey-builder/SurveyBuilderEditor.tsx

import React, { useEffect, useCallback, useState } from 'react';
import { RotateCcw, RotateCw, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import AdminRouteGuard from '@/shared/components/guards/AdminRouteGuard';
import AdminSidebar from '@/shared/components/admin/AdminSidebar';
import ClientRouteGuard from '@/shared/components/guards/ClientRouteGuard';
import ClientSidebar from '@/shared/components/client/ClientSidebar';
import { LoaderUI } from '@/shared/ui/atoms/loader/LoaderUI';
import { useTemplateQuery } from '@/core/hooks/queries/survey-templates/index.queries';
import { useCreateTemplate, useUpdateTemplate, useSaveSurveyDraft, useSaveDraftContent, useDiscardDraftContent } from '@/core/hooks/mutations/survey-template.mutations';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import QuestionListPanel from './components/QuestionListPanel';
import QuestionEditorPanel from './components/QuestionEditorPanel';
import QuestionConfigPanel from './components/QuestionConfigPanel';
import SurveyDetailsSection from './components/SurveyDetailsSection';
import { BuilderLanguageCompact } from './components/BuilderLanguageCompact';
import PublishSurveyModal from './components/PublishSurveyModal';

interface Props {
  templateId?: string;
  SidebarComponent?: React.ComponentType;
  backHref?: string;
}

const LOCAL_KEY = (id: string | undefined) => `tm-builder-${id ?? 'new'}`;

const clearLocalDraft = (id: string | undefined) => {
  try { localStorage.removeItem(LOCAL_KEY(id)); } catch {}
};

const SurveyBuilderEditorContent: React.FC<Props> = ({ templateId, SidebarComponent = AdminSidebar, backHref = '/admin/surveys' }) => {
  const { data, isLoading, isError } = useTemplateQuery(templateId);

  const { name, isDirty, questions, settings, translations, setName, setTranslation, loadTemplate, resetEditor, toCreateRequest, toUpdateRequest, undo, redo, _past, _future } =
    useSurveyBuilderStore();

  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const saveSurveyDraft = useSaveSurveyDraft();
  const saveDraftContent = useSaveDraftContent();
  const discardDraftContent = useDiscardDraftContent();

  const isSaving = createTemplate.isPending || updateTemplate.isPending || saveSurveyDraft.isPending || saveDraftContent.isPending;
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [localSavedAt, setLocalSavedAt] = useState<Date | null>(null);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Two-section layout: 'details' (survey metadata + settings) or 'questions' (builder)
  const [editorSection, setEditorSection] = useState<'details' | 'questions'>('details');

  // Auto-redirect 2 seconds after save-draft success overlay appears
  useEffect(() => {
    if (!showSaveSuccess) return;
    const t = setTimeout(() => { window.location.href = backHref; }, 2000);
    return () => clearTimeout(t);
  }, [showSaveSuccess, backHref]);

  // Load template data into store when it arrives
  useEffect(() => {
    if (data?.data) {
      const template = data.data;
      // If published template has a saved draft, prompt before loading
      if (template.draftContent?.savedAt && template.publishedSurveyId) {
        setShowDraftPrompt(true);
      } else {
        // Explicitly close the dialog if it was open (e.g. stale cache showed draftContent
        // but the fresh refetch has none — or after a successful discard).
        setShowDraftPrompt(false);
        loadTemplate(template);
      }
      // Existing templates with questions open directly in the question builder
      const questionCount =
        template.draftContent?.questions?.length ?? template.questions?.length ?? 0;
      if (questionCount > 0) {
        setEditorSection('questions');
      }
    } else if (!templateId) {
      resetEditor();
    }
  }, [data, templateId]);

  // For new templates: check for duplicate prefill first, then fall back to localStorage
  useEffect(() => {
    if (templateId) return;
    try {
      const prefillRaw = sessionStorage.getItem('tm-duplicate-prefill');
      if (prefillRaw) {
        sessionStorage.removeItem('tm-duplicate-prefill');
        const prefill = JSON.parse(prefillRaw);
        const originalLabel = prefill.translations?.en?.label ?? prefill.name ?? '';
        // Only append "(Copy)" for actual duplicates; methodology templates set isDuplicate: false
        const label = prefill.isDuplicate !== false
          ? `${originalLabel} (Copy)`
          : originalLabel;
        // Internal name: use original slug + numeric suffix (no "copy" wording)
        const baseName = slugify(originalLabel) || 'survey';
        const numericSuffix = Date.now().toString().slice(-4);
        // Use loadTemplate for proper question/translation normalization,
        // then override: new survey has no templateId and should be dirty
        loadTemplate({
          ...prefill,
          _id: '',
          name: `${baseName}-${numericSuffix}`,
          translations: {
            ...prefill.translations,
            en: { ...(prefill.translations?.en ?? {}), label },
          },
        } as any);
        useSurveyBuilderStore.setState({ isDirty: true });
        if (prefill.companyId) {
          useSurveyBuilderStore.getState().setCompanyScope(prefill.companyId, prefill.companyName ?? null);
        }
        // If prefill includes starter questions, jump straight to the builder
        if ((prefill.questions?.length ?? 0) > 0) {
          setEditorSection('questions');
        }
        return;
      }
    } catch {}
    try {
      const raw = localStorage.getItem(LOCAL_KEY(undefined));
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.translations || saved.questions) {
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
      // Strip trailing "(Copy)" variants so the internal name never contains "copy"
      const nameBase = value.replace(/\s*\(copy\)\s*$/i, '').trim();
      setName(slugify(nameBase || value));
    }
  };

  const handleContinueDraft = useCallback(() => {
    const template = data!.data!;
    const draft = template.draftContent!;
    loadTemplate({
      ...template,
      questions: (draft.questions as any) ?? template.questions,
      translations: (draft.translations as any) ?? template.translations,
      settings: (draft.settings as any) ?? template.settings,
    });
    setShowDraftPrompt(false);
  }, [data, loadTemplate]);

  const handleDiscardDraft = useCallback(async () => {
    const response = await discardDraftContent.mutateAsync(templateId!);
    if (response?.data) {
      loadTemplate(response.data);
    }
    setShowDraftPrompt(false);
  }, [templateId, discardDraftContent, loadTemplate]);

  // Returns true when current editor state is identical to the published template fields.
  // Used to prevent saving a draftContent that adds no new information.
  const isSameAsPublished = useCallback((): boolean => {
    if (!data?.data || !templateId) return false;
    const current = toUpdateRequest();
    const pub = data.data;
    return (
      JSON.stringify(current.questions) === JSON.stringify(pub.questions) &&
      JSON.stringify(current.translations) === JSON.stringify(pub.translations) &&
      JSON.stringify(current.settings) === JSON.stringify(pub.settings)
    );
  }, [data, templateId, toUpdateRequest]);

  // Save Draft — three cases based on template state
  const handleSave = useCallback(async () => {
    const enLabel = translations?.en?.label?.trim();
    if (!name.trim() && enLabel) setName(slugify(enLabel));

    if (!templateId) {
      // New survey — create template (backend auto-creates MySQL draft via _upsertMySQLDraft)
      const res = await createTemplate.mutateAsync(toCreateRequest());
      if (res.data?._id) {
        clearLocalDraft(undefined);
        setShowSaveSuccess(true);
      }
    } else if (!data?.data?.publishedSurveyId) {
      // Existing template, not yet published — just update the template
      await updateTemplate.mutateAsync({ id: templateId, data: toUpdateRequest() });
      clearLocalDraft(templateId);
      setShowSaveSuccess(true);
    } else {
      // Published survey — if current content matches published, discard any stale draftContent
      if (isSameAsPublished()) {
        if (data?.data?.draftContent?.savedAt) {
          await discardDraftContent.mutateAsync(templateId);
        }
        clearLocalDraft(templateId);
        setShowSaveSuccess(true);
        return;
      }
      // Content differs — save to draftContent only, never overwrite live template
      await saveDraftContent.mutateAsync({ id: templateId, content: toUpdateRequest() });
      clearLocalDraft(templateId);
      setShowSaveSuccess(true);
    }
  }, [templateId, name, translations, data, isSameAsPublished, toCreateRequest, toUpdateRequest, createTemplate, updateTemplate, saveDraftContent, discardDraftContent, setName]);

  // Publish — always open panel immediately, no pre-API calls
  const handlePublishClick = useCallback(() => {
    setShowPublishModal(true);
  }, []);

  if (isLoading && templateId) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-container-low">
        <LoaderUI message="Loading template..." />
      </div>
    );
  }

  if (isError && templateId) {
    return (
      <div className="h-full flex items-center justify-center bg-surface-container-low">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 max-w-md text-center">
          <p className="font-medium mb-2">Failed to load template</p>
          <a href={backHref} className="text-primary underline text-sm">
            Back to Surveys
          </a>
        </div>
      </div>
    );
  }

  const allQuestionsHaveText = questions.length > 0 && questions.every((q) => !!q.translations.en.text.trim());
  const isFirstPublish = !data?.data?.publishedSurveyId;
  const hasDraftContent = !!(data?.data?.draftContent?.savedAt);
  const canPublish = allQuestionsHaveText && (isFirstPublish || isDirty || hasDraftContent);

  return (
    <>
      {showDraftPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-lg font-semibold text-on-surface mb-2">Unsaved draft found</h2>
            <p className="text-sm text-on-surface-variant mb-6">
              A saved draft exists for this survey. Do you want to continue editing the draft or
              discard it and start fresh from the published version?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => void handleDiscardDraft()}
                disabled={discardDraftContent.isPending}
                className="px-4 py-2 text-sm text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high disabled:opacity-50"
              >
                {discardDraftContent.isPending ? 'Discarding…' : 'Discard'}
              </button>
              <button
                onClick={handleContinueDraft}
                className="px-4 py-2 text-sm text-on-primary bg-primary rounded-lg hover:bg-primary/90"
              >
                Continue editing
              </button>
            </div>
          </div>
        </div>
      )}

      {showSaveSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container rounded-xl p-8 max-w-sm w-full mx-4 shadow-xl flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-on-surface mb-1">Draft saved!</h3>
              <p className="text-sm text-outline">Redirecting to surveys…</p>
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex bg-surface-container-low text-text-dark">
        <SidebarComponent />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center gap-4 px-6 py-3 bg-surface-container border-b border-outline-variant flex-shrink-0">
            {editorSection === 'questions' ? (
              <button
                onClick={() => setEditorSection('details')}
                className="flex items-center gap-1.5 text-secondary hover:text-secondary/80 transition-colors flex-shrink-0"
                title="Back to Survey Details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Survey Details</span>
              </button>
            ) : (
              <a
                href={backHref}
                className="flex items-center gap-1.5 text-secondary hover:text-secondary/80 transition-colors flex-shrink-0"
                title="Back to Surveys"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </a>
            )}

            <input
              type="text"
              value={translations?.en?.label ?? ''}
              onChange={(e) => handleLabelChange(e.target.value)}
              placeholder="Survey display title (e.g. Political Survey 2026)"
              className="flex-1 min-w-0 border border-outline-variant rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container-low text-on-surface"
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              {isDirty && (
                <span className="text-xs text-orange-500 font-medium">Unsaved changes</span>
              )}
              {hasDraftContent && !isDirty && (
                <span className="text-xs text-amber-500 font-medium">Draft saved</span>
              )}
              {localSavedAt && (
                <span className="text-xs text-outline" title={`Auto-saved at ${localSavedAt.toLocaleTimeString()}`}>
                  ✓ Locally saved {localSavedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}

              <button
                onClick={undo}
                disabled={_past.length === 0}
                title="Undo (Ctrl+Z)"
                className="p-1.5 rounded-md text-outline hover:text-on-surface hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={redo}
                disabled={_future.length === 0}
                title="Redo (Ctrl+Y)"
                className="p-1.5 rounded-md text-outline hover:text-on-surface hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCw size={16} />
              </button>

              <BuilderLanguageCompact />

              {!!translations?.en?.label?.trim() && (
                <button
                  onClick={handlePublishClick}
                  disabled={isSaving || !canPublish}
                  title={
                    questions.length === 0
                      ? 'Add at least one question before publishing'
                      : !allQuestionsHaveText
                      ? 'All questions must have text before publishing'
                      : !canPublish
                      ? 'No changes to publish'
                      : undefined
                  }
                  className="px-4 py-1.5 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish
                </button>
              )}

              <button
                onClick={() => void handleSave()}
                disabled={isSaving || (!!templateId && !isDirty)}
                className="px-4 py-1.5 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving…' : 'Save Draft'}
              </button>
            </div>
          </div>

          {/* Section layout */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {editorSection === 'details' ? (
              /* ── Survey Details: full-width center, no side panels ── */
              <div className="flex-1 min-w-0 overflow-hidden">
                <SurveyDetailsSection onContinue={() => setEditorSection('questions')} />
              </div>
            ) : (
              /* ── Question Builder: 3-panel layout ── */
              <>
                {/* LEFT: Question list — 256px */}
                <div className="w-64 flex-shrink-0 overflow-hidden">
                  <QuestionListPanel />
                </div>

                {/* CENTER: Question editor */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <QuestionEditorPanel />
                </div>

                {/* RIGHT: Question settings — 288px */}
                <div className="w-72 flex-shrink-0 overflow-hidden border-l border-outline-variant">
                  <QuestionConfigPanel />
                </div>
              </>
            )}
          </div>
        </div>

        {showPublishModal && (
          <PublishSurveyModal
            templateId={templateId ?? null}
            defaultLabel={translations?.en?.label ?? name}
            defaultFormLayout={settings.defaultFormLayout}
            defaultType={settings.defaultType}
            existingSurveyId={data?.data?.publishedSurveyId ?? undefined}
            hasDraftContent={hasDraftContent}
            onClose={() => setShowPublishModal(false)}
            onPublished={() => clearLocalDraft(templateId)}
          />
        )}
      </div>
    </>
  );
};

export const SurveyBuilderEditor: React.FC<Props> = (props) => (
  <AdminRouteGuard>
    <SurveyBuilderEditorContent {...props} />
  </AdminRouteGuard>
);

export const ClientSurveyBuilderEditor: React.FC<Pick<Props, 'templateId'>> = ({ templateId }) => (
  <ClientRouteGuard>
    <SurveyBuilderEditorContent
      templateId={templateId}
      SidebarComponent={ClientSidebar}
      backHref="/client/surveys"
    />
  </ClientRouteGuard>
);

export default SurveyBuilderEditor;
