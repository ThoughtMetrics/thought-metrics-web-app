// components/PublishSurveyModal.tsx

import React, { useEffect, useRef, useState } from 'react';
import { usePublishSurvey, useSaveSurveyDraft, useUpdateTemplate } from '@/core/hooks/mutations/survey-template.mutations';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import type { ISurveyPublishRequest } from '@/core/types/survey-builder.type';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import type { SurveyFormLayout } from '@/core/types/survey.type';
import { QuestionType } from '@/core/types/survey.type';

interface Props {
  templateId: string;
  defaultLabel: string;
  defaultFormLayout: SurveyFormLayout;
  defaultType?: 'respondent' | 'agent';
  onClose: () => void;
}

type Step = 'form' | 'lang-prompt' | 'translation';

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

const PublishSurveyModal: React.FC<Props> = ({ templateId, defaultLabel, defaultFormLayout, defaultType = 'respondent', onClose }) => {
  const publish = usePublishSurvey();
  const saveDraft = useSaveSurveyDraft();
  const updateTemplate = useUpdateTemplate();

  const { questions, translations: storeTranslations, setQuestionTranslation, setTranslation, toUpdateRequest } = useSurveyBuilderStore();

  // ── Publish form state ───────────────────────────────────────────────────
  const [label, setLabel] = useState(defaultLabel);
  const [surveyId, setSurveyId] = useState('');
  const [type, setType] = useState<'respondent' | 'agent'>(defaultType);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expireDate, setExpireDate] = useState('');
  const [maxResponses, setMaxResponses] = useState('');
  const [zonalBasedSurvey, setZonalBasedSurvey] = useState(false);
  const [formLayout, setFormLayout] = useState<SurveyFormLayout>(defaultFormLayout);

  // ── Step & translation state ─────────────────────────────────────────────
  const [step, setStep] = useState<Step>('form');
  const [selectedLang, setSelectedLang] = useState<SupportedBuilderLanguage>('ta');
  const [draft, setDraft] = useState<TranslationDraft | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const isBusy = publish.isPending || saveDraft.isPending || updateTemplate.isPending;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const buildPayload = (): ISurveyPublishRequest => {
    const payload: ISurveyPublishRequest = {
      templateId,
      label: label.trim(),
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

  const doPublish = async () => {
    await publish.mutateAsync(buildPayload());
  };

  // ── Step 1 form submit → go to translation prompt ────────────────────────
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setStep('lang-prompt');
  };

  const handleSaveAsDraft = async () => {
    if (!label.trim()) return;
    await saveDraft.mutateAsync(buildPayload());
  };

  // ── Step 2: user picks language and continues to translation editor ───────
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
          options: enOptions.map((enOpt) => ({
            value: enOpt.value,
            label: existingOpts.find((o) => o.value === enOpt.value)?.label ?? '',
          })),
        };
      }),
    };
  };

  const handleContinueToTranslation = () => {
    setDraft(initDraft(selectedLang));
    setStep('translation');
  };

  // ── Step 3: save translations to store + backend, then publish ────────────
  const handleSaveAndPublish = async () => {
    if (!draft) return;

    // Write template-level translations
    setTranslation(selectedLang, 'label', draft.templateLabel);
    setTranslation(selectedLang, 'description', draft.templateDescription);
    setTranslation(selectedLang, 'instructions', draft.templateInstructions);

    // Write per-question translations
    questions.forEach((q, idx) => {
      const qDraft = draft.questions[idx];
      if (!qDraft) return;
      const hasOptions = qDraft.options.length > 0;
      setQuestionTranslation(idx, selectedLang, {
        text: qDraft.text,
        ...(hasOptions ? { options: qDraft.options } : {}),
      });
    });

    // Persist template (with translations) to backend, then publish
    await updateTemplate.mutateAsync({ id: templateId, data: toUpdateRequest() });
    await doPublish();
  };

  const updateDraftQuestion = (qIdx: number, partial: Partial<QuestionTranslationDraft>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions];
      qs[qIdx] = { ...qs[qIdx], ...partial };
      return { ...prev, questions: qs };
    });
  };

  const updateDraftOption = (qIdx: number, optIdx: number, label: string) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const qs = [...prev.questions];
      const opts = [...qs[qIdx].options];
      opts[optIdx] = { ...opts[optIdx], label };
      qs[qIdx] = { ...qs[qIdx], options: opts };
      return { ...prev, questions: qs };
    });
  };

  const selectedLangLabel = LANG_OPTIONS.find((l) => l.code === selectedLang)?.label ?? selectedLang;

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderForm = () => (
    <form onSubmit={handleFormSubmit} className="px-6 py-5 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Survey Label <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Survey ID</label>
        <input
          type="text"
          value={surveyId}
          onChange={(e) => setSurveyId(e.target.value)}
          placeholder="Auto-generated if left blank"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
        <div className="flex gap-4">
          {(['respondent', 'agent'] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={t} checked={type === t} onChange={() => setType(t)} className="accent-primary" />
              <span className="text-sm">{t === 'respondent' ? 'Public' : 'Agent'}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
        <div className="flex gap-4">
          {(['public', 'private'] as const).map((v) => (
            <label key={v} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={v} checked={visibility === v} onChange={() => setVisibility(v)} className="accent-primary" />
              <span className="text-sm capitalize">{v}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expire Date</label>
          <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Responses</label>
        <input
          type="number"
          value={maxResponses}
          onChange={(e) => setMaxResponses(e.target.value)}
          min={1}
          placeholder="No limit"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Zonal Based Survey</label>
        <button
          type="button"
          onClick={() => setZonalBasedSurvey((v) => !v)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${zonalBasedSurvey ? 'bg-primary' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${zonalBasedSurvey ? 'translate-x-4' : 'translate-x-1'}`} />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Form Layout</label>
        <div className="flex gap-4">
          {(['paginated', 'list'] as const).map((l) => (
            <label key={l} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={l} checked={formLayout === l} onChange={() => setFormLayout(l)} className="accent-primary" />
              <span className="text-sm capitalize">{l}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveAsDraft}
          disabled={isBusy || !label.trim()}
          className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveDraft.isPending ? 'Saving…' : 'Save as Draft'}
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
    <div className="px-6 py-8 flex flex-col items-center text-center gap-6">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
        <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Add translations?</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Do you want to add translations for your survey questions and options before publishing?
        </p>
      </div>

      <div className="w-full max-w-xs space-y-3">
        {LANG_OPTIONS.map((lang) => (
          <label
            key={lang.code}
            className={`flex items-center gap-3 w-full border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
              selectedLang === lang.code ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="lang"
              value={lang.code}
              checked={selectedLang === lang.code}
              onChange={() => setSelectedLang(lang.code)}
              className="accent-primary"
            />
            <span className="text-sm font-medium text-gray-800">{lang.label}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button
          onClick={handleContinueToTranslation}
          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Yes, add {selectedLangLabel} translations
        </button>
        <button
          onClick={doPublish}
          disabled={isBusy}
          className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {publish.isPending ? 'Publishing…' : 'No, publish now'}
        </button>
        <button onClick={() => setStep('form')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1">
          ← Back
        </button>
      </div>
    </div>
  );

  const renderTranslation = () => {
    if (!draft) return null;

    const enTemplateTranslations = storeTranslations['en'];

    return (
      <div className="flex flex-col h-full">
        {/* Translation editor header */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
          <button onClick={() => setStep('lang-prompt')} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-sm text-gray-600">
            Add <span className="font-semibold text-gray-900">{selectedLangLabel}</span> translations — English shown for reference
          </p>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-2 gap-px bg-gray-200 flex-shrink-0">
          <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">English</div>
          <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-primary uppercase tracking-wide">{selectedLangLabel}</div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

          {/* Template label / description / instructions */}
          {(enTemplateTranslations?.label || enTemplateTranslations?.description || enTemplateTranslations?.instructions) && (
            <div className="bg-blue-50/40">
              <div className="px-4 py-2 border-b border-blue-100">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Survey Info</span>
              </div>

              {enTemplateTranslations?.label && (
                <div className="grid grid-cols-2 gap-px bg-gray-200">
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Label</p>
                    <p className="text-sm text-gray-700">{enTemplateTranslations.label}</p>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Label</p>
                    <input
                      type="text"
                      value={draft.templateLabel}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateLabel: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} label…`}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {enTemplateTranslations?.description && (
                <div className="grid grid-cols-2 gap-px bg-gray-200">
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{enTemplateTranslations.description}</p>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <input
                      type="text"
                      value={draft.templateDescription}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateDescription: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} description…`}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {enTemplateTranslations?.instructions && (
                <div className="grid grid-cols-2 gap-px bg-gray-200">
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Instructions</p>
                    <p className="text-sm text-gray-700">{enTemplateTranslations.instructions}</p>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Instructions</p>
                    <input
                      type="text"
                      value={draft.templateInstructions}
                      onChange={(e) => setDraft((p) => p ? { ...p, templateInstructions: e.target.value } : p)}
                      placeholder={`${selectedLangLabel} instructions…`}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex-shrink-0">
                    {q.order}
                  </span>
                  <span className="text-xs text-gray-500 truncate">{enText || '(no text)'}</span>
                </div>

                {/* Question text row */}
                <div className="grid grid-cols-2 gap-px bg-gray-200">
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Question text</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{enText || <span className="text-gray-300 italic">empty</span>}</p>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <p className="text-xs text-gray-400 mb-1">Question text</p>
                    <textarea
                      value={qDraft.text}
                      onChange={(e) => updateDraftQuestion(qIdx, { text: e.target.value })}
                      placeholder={`${selectedLangLabel} question text…`}
                      rows={2}
                      className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                {/* Options rows */}
                {hasOptions && (
                  <div className="bg-gray-50/60">
                    <div className="px-4 py-1.5 border-y border-gray-100">
                      <span className="text-xs text-gray-400 font-medium">Options</span>
                    </div>
                    {qDraft.options.map((opt, optIdx) => {
                      const enOpt = (q.config.options ?? [])[optIdx];
                      return (
                        <div key={opt.value} className="grid grid-cols-2 gap-px bg-gray-200">
                          <div className="bg-white px-4 py-2 flex items-center">
                            <span className="text-sm text-gray-600">{enOpt?.label || opt.value}</span>
                          </div>
                          <div className="bg-white px-4 py-2">
                            <input
                              type="text"
                              value={opt.label}
                              onChange={(e) => updateDraftOption(qIdx, optIdx, e.target.value)}
                              placeholder={`${selectedLangLabel}…`}
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={() => setStep('lang-prompt')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSaveAndPublish}
            disabled={isBusy}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy ? 'Saving…' : `Save ${selectedLangLabel} & Publish`}
          </button>
        </div>
      </div>
    );
  };

  // ── Modal shell ───────────────────────────────────────────────────────────

  const isTranslationStep = step === 'translation';

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className={`bg-white rounded-xl shadow-2xl mx-4 flex flex-col overflow-hidden transition-all ${
        isTranslationStep ? 'w-full max-w-2xl h-[90vh]' : 'w-full max-w-lg max-h-[90vh] overflow-y-auto'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {step === 'form' && 'Publish as Survey'}
              {step === 'lang-prompt' && 'Before you publish…'}
              {step === 'translation' && `${selectedLangLabel} Translations`}
            </h2>
            {step === 'form' && (
              <p className="text-xs text-gray-400 mt-0.5">Step 1 of 2 — Survey details</p>
            )}
            {step === 'lang-prompt' && (
              <p className="text-xs text-gray-400 mt-0.5">Step 2 of 2 — Translations</p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Step content */}
        {step === 'form' && renderForm()}
        {step === 'lang-prompt' && renderLangPrompt()}
        {step === 'translation' && renderTranslation()}
      </div>
    </div>
  );
};

export default PublishSurveyModal;
