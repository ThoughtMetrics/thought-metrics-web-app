// components/PublishSurveyModal.tsx

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useCreateTemplate, usePublishSurvey, useUpdateTemplate, useUpdateSurveyInstance, useDiscardDraftContent } from '@/core/hooks/mutations/survey-template.mutations';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import type { ISurveyPublishRequest, ISurveyUpdateRequest } from '@/core/types/survey-builder.type';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import type { SurveyFormLayout } from '@/core/types/survey.type';
import { QuestionType } from '@/core/types/survey.type';

// Industry options (mirrors backend Industry enum)
const INDUSTRY_OPTIONS: { value: string; label: string }[] = [
  { value: 'All Industries', label: 'All Industries' },
  { value: 'Advertising & Marketing', label: 'Advertising & Marketing' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Education', label: 'Education' },
  { value: 'Financial Services & Insurance', label: 'Financial Services & Insurance' },
  { value: 'FMCG', label: 'FMCG' },
  { value: 'Healthcare & Life Sciences', label: 'Healthcare & Life Sciences' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Internet & Media', label: 'Internet & Media' },
  { value: 'Investor & Private Equity', label: 'Investor & Private Equity' },
  { value: 'Retail & Merchandising', label: 'Retail & Merchandising' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Fitness & Wellness', label: 'Fitness & Wellness' },
  { value: 'Apparel', label: 'Apparel' },
  { value: 'Political', label: 'Political' },
  { value: 'Others', label: 'Others' },
];

interface Props {
  templateId: string | null; // null = new unsaved template
  defaultLabel: string;
  defaultFormLayout: SurveyFormLayout;
  defaultType?: 'respondent' | 'agent';
  existingSurveyId?: string;
  hasDraftContent?: boolean;
  onClose: () => void;
  onPublished?: () => void;
}

type Step = 'form' | 'lang-prompt' | 'translation' | 'success';

const LANG_OPTIONS: { code: SupportedBuilderLanguage; label: string }[] = [
  { code: 'ta', label: 'Tamil' },
];

const OPTION_TYPES = new Set([
  QuestionType.MCQ_SINGLE,
  QuestionType.MCQ_MULTIPLE,
  QuestionType.RANKING,
  QuestionType.MAX_DIFF,
  QuestionType.CONSTANT_SUM,
]);

type QuestionTranslationDraft = {
  text: string;
  options: { value: string; label: string }[];
};

type TranslationDraft = {
  templateLabel: string;
  templateDescription: string;
  templateInstructions: string;
  questions: QuestionTranslationDraft[];
};

const PublishSurveyModal: React.FC<Props> = ({
  templateId,
  defaultLabel,
  defaultFormLayout,
  defaultType = 'respondent',
  existingSurveyId,
  hasDraftContent,
  onClose,
  onPublished,
}) => {
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const publish = usePublishSurvey();
  const updateSurvey = useUpdateSurveyInstance();
  const discardDraft = useDiscardDraftContent();

  const { questions, translations: storeTranslations, settings: storeSettings, setQuestionTranslation, setTranslation, toCreateRequest, toUpdateRequest } = useSurveyBuilderStore();

  // ── Publish form state ───────────────────────────────────────────────────
  const [label, setLabel] = useState(defaultLabel);
  const [surveyId, setSurveyId] = useState('');
  const [industry, setIndustry] = useState(storeSettings.industry ?? 'Others');
  const [type, setType] = useState<'respondent' | 'agent'>(defaultType);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expireDate, setExpireDate] = useState('');
  const [maxResponses, setMaxResponses] = useState('');
  const [zonalBasedSurvey, setZonalBasedSurvey] = useState(false);
  const [formLayout, setFormLayout] = useState<SurveyFormLayout>(defaultFormLayout);

  // ── Step & translation state ─────────────────────────────────────────────
  const [step, setStep] = useState<Step>('form');
  const [publishedLabel, setPublishedLabel] = useState('');
  const [publishedSurveyId, setPublishedSurveyId] = useState('');
  const [selectedLang, setSelectedLang] = useState<SupportedBuilderLanguage>('ta');
  const [draft, setDraft] = useState<TranslationDraft | null>(null);
  const [savedLangs, setSavedLangs] = useState<Set<SupportedBuilderLanguage>>(new Set());

  const backdropRef = useRef<HTMLDivElement>(null);
  const publishingRef = useRef(false);
  const isBusy = createTemplate.isPending || updateTemplate.isPending || publish.isPending || updateSurvey.isPending || discardDraft.isPending;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && step !== 'success') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, step]);

  // Auto-redirect after showing success
  useEffect(() => {
    if (step !== 'success') return;
    const t = setTimeout(() => { window.location.href = '/admin/surveys'; }, 3000);
    return () => clearTimeout(t);
  }, [step]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const buildPublishPayload = (effectiveTplId: string): ISurveyPublishRequest => {
    const payload: ISurveyPublishRequest = {
      templateId: effectiveTplId,
      label: label.trim(),
      industry,
      type,
      visibility,
      startDate: startDate || undefined,
      expireDate: expireDate || undefined,
      maxResponses: maxResponses ? parseInt(maxResponses, 10) : undefined,
      zonalBasedSurvey,
      formLayout,
    };
    if (surveyId.trim()) payload.surveyId = surveyId.trim();
    return payload;
  };

  const buildUpdatePayload = (): ISurveyUpdateRequest => ({
    label: label.trim(),
    type,
    visibility,
    startDate: startDate || undefined,
    expireDate: expireDate || undefined,
    maxResponses: maxResponses ? parseInt(maxResponses, 10) : undefined,
    zonalBasedSurvey,
    formLayout,
  });

  // ── Unified publish handler ──────────────────────────────────────────────
  const handlePublish = async () => {
    if (publishingRef.current) return;
    publishingRef.current = true;
    try {
      let effectiveTemplateId = templateId;

      if (!effectiveTemplateId) {
        // New template — create it first (backend also creates MySQL draft via _upsertMySQLDraft)
        const res = await createTemplate.mutateAsync(toCreateRequest());
        effectiveTemplateId = res.data?._id ?? null;
        if (!effectiveTemplateId) return; // error toast shown by mutation
      } else {
        // Save all changes (questions, Tamil translations, settings)
        await updateTemplate.mutateAsync({ id: effectiveTemplateId, data: toUpdateRequest() });
      }

      if (existingSurveyId) {
        // Already published — update survey metadata
        await updateSurvey.mutateAsync({ id: existingSurveyId, data: buildUpdatePayload() });
        // Clear any saved draftContent now that the live template has been updated
        if (hasDraftContent && effectiveTemplateId) {
          await discardDraft.mutateAsync(effectiveTemplateId);
        }
        useSurveyBuilderStore.setState({ isDirty: false });
        onPublished?.();
      } else {
        // First publish — backend promotes draft row to published (no duplicate created)
        const res = await publish.mutateAsync(buildPublishPayload(effectiveTemplateId));
        setPublishedSurveyId((res as any)?.data?.surveyId ?? '');
        onPublished?.();
      }
      setPublishedLabel(label.trim());
      setStep('success');
    } catch {
      // individual mutations show their own error toasts
    } finally {
      publishingRef.current = false;
    }
  };

  // ── Step 1 form submit → go to translation prompt ────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setStep('lang-prompt');
  };

  // ── Translation helpers ──────────────────────────────────────────────────
  const initDraft = (lang: SupportedBuilderLanguage): TranslationDraft => {
    const existing = storeTranslations[lang];
    return {
      templateLabel: existing?.label ?? '',
      templateDescription: existing?.description ?? '',
      templateInstructions: existing?.instructions ?? '',
      questions: questions.map((q) => {
        const existingQ = q.translations[lang];
        const enOptions = OPTION_TYPES.has(q.questionType) ? (q.config.options ?? []) : [];
        const existingOpts = existingQ?.options ?? [];
        return {
          text: existingQ?.text ?? '',
          options: enOptions.map((enOpt, i) => ({
            value: enOpt.value,
            label: existingOpts.find((o) => o.value === enOpt.value)?.label
              ?? existingOpts[i]?.label
              ?? '',
          })),
        };
      }),
    };
  };

  const handleOpenTranslation = (lang: SupportedBuilderLanguage) => {
    setSelectedLang(lang);
    setDraft(initDraft(lang));
    setStep('translation');
  };

  const handleSaveTranslation = async () => {
    if (!draft) return;
    const enTemplate = storeTranslations['en'];

    setTranslation(selectedLang, 'label', draft.templateLabel || enTemplate?.label || '');
    setTranslation(selectedLang, 'description', draft.templateDescription || enTemplate?.description || '');
    setTranslation(selectedLang, 'instructions', draft.templateInstructions || enTemplate?.instructions || '');

    questions.forEach((q, idx) => {
      const qDraft = draft.questions[idx];
      if (!qDraft) return;
      const enText = q.translations.en.text || q.text;
      const hasOptions = qDraft.options.length > 0;
      setQuestionTranslation(idx, selectedLang, {
        text: qDraft.text || enText,
        ...(hasOptions ? {
          options: qDraft.options.map((opt, oIdx) => ({
            value: opt.value,
            label: opt.label || (q.config.options ?? [])[oIdx]?.label || opt.value,
          })),
        } : {}),
      });
    });

    setSavedLangs((prev) => new Set([...prev, selectedLang]));
    setStep('lang-prompt');
  };

  const updateDraftQuestion = (qIdx: number, partial: Partial<QuestionTranslationDraft>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions];
      qs[qIdx] = { ...qs[qIdx], ...partial };
      return { ...prev, questions: qs };
    });
  };

  const updateDraftOption = (qIdx: number, optIdx: number, optLabel: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions];
      const opts = [...qs[qIdx].options];
      opts[optIdx] = { ...opts[optIdx], label: optLabel };
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...prev, questions: qs };
    });
  };

  const selectedLangLabel = LANG_OPTIONS.find((l) => l.code === selectedLang)?.label ?? selectedLang;

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderForm = () => (
    <form onSubmit={handleFormSubmit} className="flex flex-col">
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">
            Survey Label <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {!existingSurveyId && (
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Survey ID</label>
            <input
              type="text"
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              placeholder="Auto-generated if left blank"
              className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface-container"
          >
            {INDUSTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-xs text-outline mt-1">Determines the survey ID prefix (e.g. TM-POL001)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Mode</label>
          <div className="flex gap-2">
            {(['respondent', 'agent'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  type === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                }`}
              >
                {t === 'respondent' ? 'Public' : 'Agent'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Visibility</label>
          <div className="flex gap-2">
            {(['public', 'private'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVisibility(v)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  visibility === v
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Expire Date</label>
            <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-1">Max Responses</label>
          <input
            type="number"
            value={maxResponses}
            onChange={(e) => setMaxResponses(e.target.value)}
            min={1}
            placeholder="No limit"
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-on-surface-variant">Zonal Based Survey</label>
          <button
            type="button"
            onClick={() => setZonalBasedSurvey((v) => !v)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${zonalBasedSurvey ? 'bg-primary' : 'bg-outline-variant'}`}
          >
            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${zonalBasedSurvey ? 'translate-x-4' : 'translate-x-1'}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface-variant mb-2">Form Layout</label>
          <div className="flex gap-2">
            {(['paginated', 'list'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setFormLayout(l)}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${
                  formLayout === l
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex gap-3 px-6 py-4 border-t border-outline-variant/50 bg-surface-container sticky bottom-0 flex-shrink-0">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={!label.trim()}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </form>
  );

  const renderLangPrompt = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 space-y-4 flex-1">
        <p className="text-sm text-outline">
          Optionally add translations before publishing.
        </p>

        <div className="space-y-2">
          {LANG_OPTIONS.map((lang) => {
            const isSaved = savedLangs.has(lang.code);
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleOpenTranslation(lang.code)}
                className="w-full flex items-center justify-between border border-outline-variant rounded-lg px-4 py-3 hover:border-primary/50 hover:bg-surface-container-high transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {isSaved ? (
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 rounded border border-outline-variant flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-on-surface">{lang.label}</span>
                </div>
                <span className="text-sm text-primary font-medium">
                  {isSaved ? `Edit ${lang.label} translation` : `Add ${lang.label} translation`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex flex-col gap-2 px-6 py-4 border-t border-outline-variant/50 bg-surface-container sticky bottom-0 flex-shrink-0">
        <button
          onClick={handlePublish}
          disabled={isBusy}
          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBusy ? 'Publishing…' : 'Publish'}
        </button>
        <button
          onClick={() => setStep('form')}
          className="text-xs text-outline hover:text-on-surface-variant transition-colors pt-1 text-center"
        >
          ← Back
        </button>
      </div>
    </div>
  );

  const renderTranslation = () => {
    if (!draft) return null;

    const enTemplateTranslations = storeTranslations['en'];

    return (
      <div className="flex flex-col flex-1 min-h-0">
        {/* Translation editor header */}
        <div className="px-6 py-3 border-b border-outline-variant/50 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setStep('lang-prompt')} className="text-outline hover:text-on-surface-variant transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-sm text-on-surface-variant">
            {savedLangs.has(selectedLang) ? 'Editing' : 'Adding'} <span className="font-semibold text-on-surface">{selectedLangLabel}</span> translations — English shown for reference
          </p>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-2 gap-px bg-outline-variant/20 flex-shrink-0">
          <div className="bg-surface-container-low px-4 py-2 text-xs font-semibold text-outline uppercase tracking-wide">English</div>
          <div className="bg-surface-container-low px-4 py-2 text-xs font-semibold text-primary uppercase tracking-wide">{selectedLangLabel}</div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/20">

          {/* Template label / description / instructions */}
          {(enTemplateTranslations?.label || enTemplateTranslations?.description || enTemplateTranslations?.instructions) && (
            <div className="bg-blue-50/40">
              <div className="px-4 py-2 border-b border-blue-100">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Survey Info</span>
              </div>

              {enTemplateTranslations?.label && (
                <div className="grid grid-cols-2 gap-px bg-outline-variant/20">
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Label</p>
                    <p className="text-sm text-on-surface-variant">{enTemplateTranslations.label}</p>
                  </div>
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Label</p>
                    <input
                      type="text"
                      value={draft.templateLabel}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateLabel: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} label…`}
                      className="w-full border border-outline-variant rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                    />
                  </div>
                </div>
              )}

              {enTemplateTranslations?.description && (
                <div className="grid grid-cols-2 gap-px bg-outline-variant/20">
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Description</p>
                    <p className="text-sm text-on-surface-variant">{enTemplateTranslations.description}</p>
                  </div>
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Description</p>
                    <input
                      type="text"
                      value={draft.templateDescription}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateDescription: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} description…`}
                      className="w-full border border-outline-variant rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                    />
                  </div>
                </div>
              )}

              {enTemplateTranslations?.instructions && (
                <div className="grid grid-cols-2 gap-px bg-outline-variant/20">
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Instructions</p>
                    <p className="text-sm text-on-surface-variant">{enTemplateTranslations.instructions}</p>
                  </div>
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Instructions</p>
                    <input
                      type="text"
                      value={draft.templateInstructions}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateInstructions: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} instructions…`}
                      className="w-full border border-outline-variant rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions */}
          {questions.map((q, qIdx) => {
            const enText = q.translations.en.text || q.text;
            const qDraft = draft.questions[qIdx];
            const hasOptions = qDraft.options.length > 0;

            return (
              <div key={q.id}>
                {/* Question badge */}
                <div className="px-4 py-2 bg-surface-container-low border-b border-outline-variant/50 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex-shrink-0">
                    {q.order}
                  </span>
                  <span className="text-xs text-outline truncate">{enText || '(no text)'}</span>
                </div>

                {/* Question text row */}
                <div className="grid grid-cols-2 gap-px bg-outline-variant/20">
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Question text</p>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{enText || <span className="text-outline/40 italic">empty</span>}</p>
                  </div>
                  <div className="bg-surface-container px-4 py-3">
                    <p className="text-xs text-outline mb-1">Question text</p>
                    <textarea
                      value={qDraft.text}
                      onChange={(e) => updateDraftQuestion(qIdx, { text: e.target.value })}
                      placeholder={`${selectedLangLabel} question text…`}
                      rows={2}
                      className="w-full border border-outline-variant rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container resize-none"
                    />
                  </div>
                </div>

                {/* Options rows */}
                {hasOptions && (
                  <div className="bg-surface-container-low/60">
                    <div className="px-4 py-1.5 border-y border-outline-variant/50">
                      <span className="text-xs text-outline font-medium">Options</span>
                    </div>
                    {qDraft.options.map((opt, optIdx) => {
                      const enOpt = (q.config.options ?? [])[optIdx];
                      return (
                        <div key={opt.value} className="grid grid-cols-2 gap-px bg-outline-variant/20">
                          <div className="bg-surface-container px-4 py-2 flex items-center">
                            <span className="text-sm text-on-surface-variant">{enOpt?.label || opt.value}</span>
                          </div>
                          <div className="bg-surface-container px-4 py-2">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateDraftOption(qIdx, optIdx, e.target.value)}
                              placeholder={`${selectedLangLabel}…`}
                              className="w-full border border-outline-variant rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-outline-variant/50 flex-shrink-0 bg-surface-container">
          <button
            onClick={() => setStep('lang-prompt')}
            className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSaveTranslation}
            disabled={isBusy}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-on-surface mb-1">Published successfully!</h3>
        <p className="text-sm text-outline">{publishedLabel}</p>
        {publishedSurveyId && (
          <p className="text-xs text-outline mt-0.5 font-mono">{publishedSurveyId}</p>
        )}
      </div>
      <p className="text-xs text-outline">Redirecting to surveys in a moment…</p>
      <button
        onClick={() => { window.location.href = '/admin/surveys'; }}
        className="mt-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Go to Surveys
      </button>
    </div>
  );

  // ── Modal shell ───────────────────────────────────────────────────────────

  const isTranslationStep = step === 'translation';

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className={`bg-surface-container rounded-xl shadow-2xl mx-4 flex flex-col overflow-hidden transition-all ${
        isTranslationStep ? 'w-full max-w-2xl h-[90vh]' : 'w-full max-w-lg max-h-[90vh]'
      }`}>
        {/* Header — hidden on success step */}
        {step !== 'success' && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/50 flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-on-surface">
                {step === 'form' && 'Publish Survey'}
                {step === 'lang-prompt' && 'Before you publish…'}
                {step === 'translation' && `${selectedLangLabel} Translations`}
              </h2>
              {step === 'form' && (
                <p className="text-xs text-outline mt-0.5">Step 1 of 2 — Survey details</p>
              )}
              {step === 'lang-prompt' && (
                <p className="text-xs text-outline mt-0.5">Step 2 of 2 — Translations (optional)</p>
              )}
              {step === 'translation' && (
                <p className="text-xs text-outline mt-0.5">
                  {savedLangs.has(selectedLang) ? 'Editing' : 'Adding'} {selectedLangLabel} translations
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-outline hover:text-on-surface-variant transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Step content — scrollable area, header stays pinned */}
        <div className={isTranslationStep ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'flex-1 overflow-y-auto min-h-0'}>
          {step === 'form' && renderForm()}
          {step === 'lang-prompt' && renderLangPrompt()}
          {step === 'translation' && renderTranslation()}
          {step === 'success' && renderSuccess()}
        </div>
      </div>
    </div>
  );
};

export default PublishSurveyModal;
