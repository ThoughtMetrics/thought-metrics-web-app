// components/configs/ChoiceConfig.tsx

import React from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { QuestionType } from '@/core/types/survey.type';
import { ChevronDown } from 'lucide-react';
import PipeTokenButton from '../PipeTokenButton';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const slugifyKey = (v: string) =>
  v.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 30);

const ChoiceConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { addOption, removeOption, updateOption, questions } = useSurveyBuilderStore();
  const options = question.config.options ?? [];
  const [expandedAttrsIdx, setExpandedAttrsIdx] = React.useState<number | null>(null);
  const [sharedAttrsExpanded, setSharedAttrsExpanded] = React.useState(false);

  const rowOptionsMode = question.config.rowOptionsMode ?? 'per-row';
  const rowColumns = question.config.rowColumns ?? {};

  const hasOthers = options.some((o) => o.value === 'others');
  const regularOptions = options.filter((o) => o.value !== 'others');

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const lines = text
        .split(/\r?\n/)
        .map((line) =>
          line
            .replace(/^[\s\u2022\u2023\u25E6\u2043\u2219•\-\*]+/, '')
            .replace(/^\d+[\.\)]\s*/, '')
            .trim()
        )
        .filter(Boolean);
      if (lines.length === 0) return;
      const othersOpt = options.filter((o) => o.value === 'others');
      const base = regularOptions.length;
      const newOpts = lines.map((line, i) => ({
        value: slugifyKey(line) || `opt${base + i + 1}`,
        label: line,
      }));
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
        options: [...regularOptions, ...newOpts, ...othersOpt],
      });
    } catch {
      // clipboard access denied
    }
  };

  // Duplicate label detection (case-insensitive, among non-others options)
  const labelCounts = regularOptions.reduce<Record<string, number>>((acc, o) => {
    const key = o.label.trim().toLowerCase();
    if (key) acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const isDuplicateLabel = (label: string) => {
    const key = label.trim().toLowerCase();
    return key !== '' && (labelCounts[key] ?? 0) > 1;
  };

  const handleLabelChange = (optIdx: number, value: string) => {
    if (lang === 'en') {
      const newSlug = slugifyKey(value) || `opt${optIdx + 1}`;
      updateOption(qIdx, optIdx, 'label', value);
      updateOption(qIdx, optIdx, 'value', newSlug);
      // Sync value field in ta.options so publish modal value-based matching stays correct
      const taOpts = question.translations.ta.options;
      if (taOpts?.length) {
        const updatedTaOpts = taOpts.map((o, i) =>
          i === optIdx ? { ...o, value: newSlug } : o
        );
        useSurveyBuilderStore.getState().setQuestionTranslation(qIdx, 'ta', { options: updatedTaOpts });
      }
    } else {
      const tOpts = [...(question.translations.ta.options ?? options.map((o) => ({ ...o, label: '' })))];
      tOpts[optIdx] = { ...tOpts[optIdx], label: value };
      useSurveyBuilderStore.getState().setQuestionTranslation(qIdx, 'ta', { options: tOpts });
    }
  };

  const toggleOthers = (checked: boolean) => {
    if (checked) {
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
        // Keep existing order; just append 'others' at the end
        options: [...options, { value: 'others', label: 'Others' }],
      });
    } else {
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
        options: options.filter((o) => o.value !== 'others'),
        othersPlaceholder: undefined,
      });
    }
  };

  const updateOptionAttrs = (
    optIdx: number,
    attrs: Array<{ key: string; value: string }>
  ) => {
    const next = [...options];
    next[optIdx] = { ...next[optIdx], attributes: attrs };
    useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { options: next });
  };

  const updateSharedAttrs = (attrs: Array<{ key: string; value: string }>) => {
    useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { sharedOptionAttributes: attrs });
  };

  const setRowOptionsMode = (next: 'shared' | 'per-row') => {
    if (next === 'per-row') {
      const sharedCols = question.config.columns ?? [];
      const seeded: Record<string, import('@/core/types/survey-builder.type').IBuilderQuestionOption[]> = {};
      options.forEach((o) => {
        seeded[o.value] = rowColumns[o.value]?.length ? rowColumns[o.value] : [...sharedCols];
      });
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { rowOptionsMode: 'per-row', rowColumns: seeded });
    } else {
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { rowOptionsMode: 'shared' });
      setSharedAttrsExpanded(false);
    }
  };

  const othersPlaceholder = (question.config as any).othersPlaceholder ?? '';
  const { setQuestionConfig } = useSurveyBuilderStore();
  const sharedAttrs = question.config.sharedOptionAttributes ?? [];

  return (
    <div className="space-y-3">
      {/* ── Per-option sub-options toggle ── */}
      {lang === 'en' && (
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
          <span className="text-xs font-medium text-gray-600">Different fields per choice</span>
          <button
            type="button"
            role="switch"
            aria-checked={rowOptionsMode === 'per-row'}
            onClick={() => setRowOptionsMode(rowOptionsMode === 'shared' ? 'per-row' : 'shared')}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              rowOptionsMode === 'per-row' ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                rowOptionsMode === 'per-row' ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Options</label>
        <div className="flex items-center gap-3">
          {lang === 'en' && (
            <button
              onClick={pasteFromClipboard}
              title="Paste options from clipboard — one per line"
              className="text-xs text-gray-500 hover:text-primary font-medium flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Paste
            </button>
          )}
          <button
            onClick={() => addOption(qIdx)}
            className="text-xs text-primary hover:underline font-medium"
          >
            + Add Option
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {regularOptions.map((opt, displayIdx) => {
          const optIdx = options.indexOf(opt);
          const duplicate = isDuplicateLabel(opt.label);
          const label = lang === 'en' ? opt.label : (question.translations.ta.options?.[optIdx]?.label ?? '');
          const attrs = opt.attributes ?? [];
          const isAttrsExpanded = expandedAttrsIdx === optIdx;

          return (
            <div key={optIdx} className="space-y-1">
              {/* Option label row */}
              <div className="space-y-0.5">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => handleLabelChange(optIdx, e.target.value)}
                    placeholder={lang === 'en' ? `Option ${displayIdx + 1}` : 'Tamil label'}
                    className={`flex-1 border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary ${
                      duplicate ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {/* Pipe token button — appends {{N}} to this option's label */}
                  {lang === 'en' && (
                    <PipeTokenButton
                      questions={questions}
                      currentQuestionIndex={qIdx}
                      onInsert={(token) => handleLabelChange(optIdx, label + token)}
                      title="Append a piped answer reference to this option label"
                    />
                  )}
                  {/* Per-option attributes toggle — only in per-row mode */}
                  {lang === 'en' && rowOptionsMode === 'per-row' && (
                    <button
                      type="button"
                      onClick={() => setExpandedAttrsIdx(isAttrsExpanded ? null : optIdx)}
                      title="Option attributes"
                      className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
                        attrs.length > 0
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {attrs.length > 0 && (
                        <span className="font-medium">{attrs.length}</span>
                      )}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-150 ${isAttrsExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                  {/* Intense purchase per-option toggle (MCQ_SINGLE, EN only) */}
                  {lang === 'en' && question.questionType === QuestionType.MCQ_SINGLE && question.config.isIntensePurchase && (
                    <button
                      type="button"
                      title="Toggle intense purchase for this option"
                      onClick={() => {
                        const next = [...options];
                        next[optIdx] = { ...next[optIdx], isIntensePurchase: !opt.isIntensePurchase };
                        setQuestionConfig(qIdx, { options: next });
                      }}
                      className={`text-xs px-1.5 py-1 rounded border flex-shrink-0 transition-colors ${
                        opt.isIntensePurchase
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-gray-300 text-gray-300'
                      }`}
                      aria-label="Intense purchase toggle"
                    >
                      IP
                    </button>
                  )}
                  <button
                    onClick={() => removeOption(qIdx, optIdx)}
                    disabled={regularOptions.length <= 1}
                    className="text-red-400 hover:text-red-600 disabled:opacity-30 flex-shrink-0"
                    title="Remove option"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {duplicate && (
                  <p className="text-xs text-red-500 pl-0.5">Duplicate option label</p>
                )}
              </div>

              {/* Per-option attribute editor — only in per-row mode */}
              {isAttrsExpanded && rowOptionsMode === 'per-row' && lang === 'en' && (
                <div className="border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Additional fields for &quot;{opt.label || `Option ${displayIdx + 1}`}&quot;
                  </p>
                  {attrs.map((attr, aIdx) => (
                    <div key={aIdx} className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={attr.key}
                        onChange={(e) => {
                          const next = [...attrs];
                          next[aIdx] = { ...next[aIdx], key: e.target.value };
                          updateOptionAttrs(optIdx, next);
                        }}
                        placeholder="Field name"
                        className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                      />
                      <input
                        type="text"
                        value={attr.value}
                        onChange={(e) => {
                          const next = [...attrs];
                          next[aIdx] = { ...next[aIdx], value: e.target.value };
                          updateOptionAttrs(optIdx, next);
                        }}
                        placeholder="Value"
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => updateOptionAttrs(optIdx, attrs.filter((_, i) => i !== aIdx))}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                        title="Remove field"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateOptionAttrs(optIdx, [...attrs, { key: '', value: '' }])}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    + Add Field
                  </button>
                </div>
              )}

            </div>
          );
        })}

        {hasOthers && (
          <div className="flex gap-2 items-center opacity-60">
            <input
              type="text"
              value="Others"
              readOnly
              className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs bg-gray-100 cursor-not-allowed"
            />
            <span className="w-4 flex-shrink-0" />
          </div>
        )}
      </div>

      {/* ── Shared additional fields (when rowOptionsMode === 'shared', EN only) ── */}
      {rowOptionsMode === 'shared' && lang === 'en' && (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex-1">Additional fields (shared for all options)</span>
            <button
              type="button"
              onClick={() => setSharedAttrsExpanded(!sharedAttrsExpanded)}
              title="Shared option attributes"
              className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
                sharedAttrs.length > 0
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-gray-300 text-gray-400 hover:border-primary hover:text-primary'
              }`}
            >
              {sharedAttrs.length > 0 && (
                <span className="font-medium">{sharedAttrs.length}</span>
              )}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-150 ${sharedAttrsExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          {sharedAttrsExpanded && (
            <div className="border border-dashed border-primary/40 rounded-lg p-2.5 space-y-1.5 bg-primary/3">
              <p className="text-xs font-medium text-gray-600 mb-1">Additional fields (applied to all options)</p>
              {sharedAttrs.map((attr, aIdx) => (
                <div key={aIdx} className="flex gap-1.5 items-center">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => {
                      const next = [...sharedAttrs];
                      next[aIdx] = { ...next[aIdx], key: e.target.value };
                      updateSharedAttrs(next);
                    }}
                    placeholder="Field name"
                    className="w-28 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => {
                      const next = [...sharedAttrs];
                      next[aIdx] = { ...next[aIdx], value: e.target.value };
                      updateSharedAttrs(next);
                    }}
                    placeholder="Value"
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => updateSharedAttrs(sharedAttrs.filter((_, i) => i !== aIdx))}
                    className="text-red-400 hover:text-red-600 flex-shrink-0"
                    title="Remove field"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => updateSharedAttrs([...sharedAttrs, { key: '', value: '' }])}
                className="text-xs text-primary hover:underline font-medium"
              >
                + Add Field
              </button>
            </div>
          )}
        </div>
      )}

      {/* Others toggle */}
      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={hasOthers}
          onChange={(e) => toggleOthers(e.target.checked)}
          className="w-3.5 h-3.5 accent-primary"
        />
        <span className="text-xs text-gray-600">Include &quot;Others&quot; option</span>
      </label>

      {/* Others text-input sub-config */}
      {hasOthers && (
        <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50 space-y-2">
          <p className="text-xs font-medium text-gray-600">Others — text input shown to respondent</p>
          <input
            type="text"
            value={othersPlaceholder}
            onChange={(e) =>
              useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
                othersPlaceholder: e.target.value,
              })
            }
            placeholder='Placeholder text (e.g. "Please specify…")'
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          />
        </div>
      )}

      {/* ── Is intense purchase (MCQ_SINGLE only, EN only) ── */}
      {lang === 'en' && question.questionType === QuestionType.MCQ_SINGLE && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs font-medium text-gray-600">Is there purchase intent</span>
            <button
              type="button"
              role="switch"
              aria-checked={question.config.isIntensePurchase ?? false}
              onClick={() => setQuestionConfig(qIdx, { isIntensePurchase: !question.config.isIntensePurchase })}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                question.config.isIntensePurchase ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${
                  question.config.isIntensePurchase ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {question.config.isIntensePurchase && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Question label</label>
              <input
                type="text"
                value={question.config.intensePurchaseLabel ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { intensePurchaseLabel: e.target.value })}
                placeholder="Is there purchase intent?"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChoiceConfig;
