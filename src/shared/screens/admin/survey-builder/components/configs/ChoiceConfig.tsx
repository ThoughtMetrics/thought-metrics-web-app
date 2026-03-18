// components/configs/ChoiceConfig.tsx

import React from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const slugifyKey = (v: string) =>
  v.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 30);

const ChoiceConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { addOption, removeOption, updateOption } = useSurveyBuilderStore();
  const options = question.config.options ?? [];

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
      updateOption(qIdx, optIdx, 'label', value);
      updateOption(qIdx, optIdx, 'value', slugifyKey(value) || `opt${optIdx + 1}`);
    } else {
      const tOpts = [...(question.translations.ta.options ?? options.map((o) => ({ ...o, label: '' })))];
      tOpts[optIdx] = { ...tOpts[optIdx], label: value };
      useSurveyBuilderStore.getState().setQuestionTranslation(qIdx, 'ta', { options: tOpts });
    }
  };

  const toggleOthers = (checked: boolean) => {
    if (checked) {
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
        options: [...options, { value: 'others', label: 'Others' }],
      });
    } else {
      useSurveyBuilderStore.getState().setQuestionConfig(qIdx, {
        options: options.filter((o) => o.value !== 'others'),
        othersPlaceholder: undefined,
      });
    }
  };

  const othersPlaceholder = (question.config as any).othersPlaceholder ?? '';

  return (
    <div className="space-y-3">
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
          return (
            <div key={optIdx} className="space-y-0.5">
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
    </div>
  );
};

export default ChoiceConfig;
