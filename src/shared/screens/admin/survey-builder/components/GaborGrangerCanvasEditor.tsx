// components/GaborGrangerCanvasEditor.tsx
//
// Typeform-style canvas editor for GABOR_GRANGER questions.
// Shows: product description, Regenerate button, optional qualifying question
// block, [Price] preview strip, and a list of numbered price-level cards.

import React from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const GaborGrangerCanvasEditor: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();

  const cfg = question.config;
  const options = cfg.options ?? [];
  const currency = cfg.gaborCurrency ?? '₹';
  const showQualifying = cfg.gaborShowQualifying !== false;

  // Resolve [Price] placeholder for the preview strip
  const firstPrice = options[0]?.label ?? '—';
  const previewText = (question.translations.en.text || 'Would you buy this product at the price of [Price]?')
    .replace(/\[Price\]/gi, `${currency}${firstPrice}`);

  const handleQualifyingChange = (value: string) => {
    setQuestionConfig(qIdx, { gaborQualifyingQuestion: value });
  };

  const handlePriceChange = (optIdx: number, rawValue: string) => {
    const next = [...options];
    const num = parseFloat(rawValue);
    next[optIdx] = {
      value: !isNaN(num) ? `price_${num}` : next[optIdx].value,
      label: rawValue,
    };
    setQuestionConfig(qIdx, { options: next });
  };

  const removePrice = (optIdx: number) => {
    if (options.length <= 1) return;
    const next = options.filter((_, i) => i !== optIdx);
    setQuestionConfig(qIdx, { options: next });
  };

  const addPriceManually = () => {
    setQuestionConfig(qIdx, {
      options: [...options, { value: `price_new_${Date.now()}`, label: '' }],
    });
  };

  const regeneratePrices = () => {
    const min = cfg.gaborMinPrice ?? 200;
    const max = cfg.gaborMaxPrice ?? 1100;
    const step = cfg.gaborPriceStep ?? 100;
    if (min >= max || step <= 0) return;
    const prices: Array<{ value: string; label: string }> = [];
    for (let p = min; p <= max + 0.001; p += step) {
      const rounded = Math.round(p);
      prices.push({ value: `price_${rounded}`, label: String(rounded) });
    }
    setQuestionConfig(qIdx, { options: prices });
  };

  return (
    <div className="space-y-4">

      {/* Qualifying question block */}
      {showQualifying && (
        <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant bg-surface-container/60">
            <span className="flex items-center gap-1.5 text-xs font-medium text-outline">
              <svg className="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Qualifying question
            </span>
            <span className="text-xs text-outline">Toggle in settings →</span>
          </div>
          <div className="px-3 py-2.5">
            <textarea
              rows={2}
              value={cfg.gaborQualifyingQuestion ?? ''}
              onChange={(e) => handleQualifyingChange(e.target.value)}
              className="w-full bg-transparent text-sm text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {/* [Price] preview strip */}
      <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm">
        <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
          Preview
        </span>
        <span className="text-on-surface font-medium">{previewText}</span>
      </div>

      <hr className="border-outline-variant" />

      {/* Price levels header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-outline uppercase tracking-wide">Price levels</span>
          <span className="text-xs text-outline bg-surface-container-high border border-outline-variant rounded-full px-2 py-0.5">
            {options.length} {options.length === 1 ? 'price' : 'prices'}
          </span>
        </div>
        <button
          type="button"
          onClick={regeneratePrices}
          className="flex items-center gap-1.5 text-xs font-medium text-outline hover:text-on-surface-variant border border-outline-variant hover:border-outline-variant rounded-md px-2.5 py-1 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate
        </button>
      </div>

      {/* Price rows */}
      <div className="space-y-1.5">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 group">
            {/* Number badge */}
            <span className="text-xs text-outline w-5 text-right flex-shrink-0 tabular-nums">
              {i + 1}
            </span>

            {/* Price card */}
            <div className="flex-1 flex items-center gap-1.5 bg-surface-container-low rounded-lg px-3 py-2 border border-outline-variant hover:border-outline-variant transition-colors">
              <span className="text-sm text-outline flex-shrink-0">{currency}</span>
              <input
                type="number"
                value={opt.label}
                onChange={(e) => handlePriceChange(i, e.target.value)}
                placeholder="0"
                className="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder-outline/40 focus:outline-none"
              />
            </div>

            {/* Remove button */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => removePrice(i)}
                disabled={options.length <= 1}
                title="Remove price"
                className="text-outline hover:text-red-500 p-0.5 rounded transition-colors disabled:opacity-20"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeWidth={1.5} d="M9 9l6 6M15 9l-6 6" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add price manually */}
      <div className="pl-7 pt-1">
        <button
          type="button"
          onClick={addPriceManually}
          className="text-sm text-blue-400 hover:text-blue-600 underline underline-offset-2 transition-colors"
        >
          Add price manually
        </button>
      </div>

    </div>
  );
};

export default GaborGrangerCanvasEditor;
