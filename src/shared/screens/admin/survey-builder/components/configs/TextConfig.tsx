// components/configs/TextConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary' : 'bg-gray-300'}`}
  >
    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

const TextConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { setQuestionTranslation, setQuestionConfig } = useSurveyBuilderStore();
  const t = question.translations[lang];
  const cfg = question.config;
  const isText = question.questionType === QuestionType.TEXT;
  const isTextarea = question.questionType === QuestionType.TEXTAREA;
  const isNumber = question.questionType === QuestionType.NUMBER;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
        <input
          type="text"
          value={t.placeholder ?? ''}
          onChange={(e) => setQuestionTranslation(qIdx, lang, { placeholder: e.target.value })}
          placeholder="e.g. Enter your answer..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* ── Open-end: character limits ── */}
      {(isText || isTextarea) && lang === 'en' && (
        <div className="space-y-3 pt-1 border-t border-gray-100">
          <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Character Limits</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Min chars</label>
              <input
                type="number"
                min={0}
                value={cfg.minChars ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { minChars: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="—"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Max chars</label>
              <input
                type="number"
                min={1}
                value={cfg.maxChars ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { maxChars: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="—"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {cfg.maxChars && (
            <p className="text-xs text-gray-400">Character counter will be shown to respondents.</p>
          )}
        </div>
      )}

      {/* ── Open-end: input size ── */}
      {(isText || isTextarea) && lang === 'en' && (
        <div className="space-y-3 pt-1 border-t border-gray-100">
          <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Input Size</span>
          {isText && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Width (px)</label>
              <input
                type="number"
                min={50}
                value={cfg.inputWidthPx ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { inputWidthPx: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Full width"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
          {isTextarea && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
              <input
                type="number"
                min={60}
                value={cfg.inputHeightPx ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { inputHeightPx: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Auto"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
      )}

      {/* ── Number: min/max range ── */}
      {isNumber && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
            <input
              type="number"
              value={cfg.min ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { min: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
            <input
              type="number"
              value={cfg.max ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { max: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* ── Number: Don't Know / Refuse ── */}
      {isNumber && lang === 'en' && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg">
            <span className="text-xs font-medium text-gray-600">Allow "Don't Know / Refuse"</span>
            <ToggleSwitch
              checked={cfg.hasDontKnow ?? false}
              onChange={(v) => setQuestionConfig(qIdx, { hasDontKnow: v })}
            />
          </div>
          {cfg.hasDontKnow && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Button label</label>
                <input
                  type="text"
                  value={cfg.dontKnowLabel ?? ''}
                  onChange={(e) => setQuestionConfig(qIdx, { dontKnowLabel: e.target.value || undefined })}
                  placeholder="Don't Know"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stored value</label>
                <input
                  type="text"
                  value={cfg.dontKnowValue ?? ''}
                  onChange={(e) => setQuestionConfig(qIdx, { dontKnowValue: e.target.value || undefined })}
                  placeholder="DK"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Number: decimal delimiter ── */}
      {isNumber && lang === 'en' && (
        <div className="space-y-2 pt-1 border-t border-gray-100">
          <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Decimal Delimiter</span>
          <div className="flex gap-4">
            {(['period', 'comma'] as const).map((d) => (
              <label key={d} className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-700">
                <input
                  type="radio"
                  name={`decimal-${qIdx}`}
                  checked={(cfg.decimalDelimiter ?? 'period') === d}
                  onChange={() => setQuestionConfig(qIdx, { decimalDelimiter: d })}
                  className="accent-primary"
                />
                {d === 'period' ? 'Period ( . )' : 'Comma ( , )'}
              </label>
            ))}
          </div>
        </div>
      )}

      {question.questionType === QuestionType.CURRENCY && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Currency Code</label>
          <input
            type="text"
            value={cfg.currency ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { currency: e.target.value })}
            placeholder="e.g. INR, USD"
            maxLength={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
};

export default TextConfig;
