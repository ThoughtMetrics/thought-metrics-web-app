// components/VanWestendorpCanvasEditor.tsx
//
// Canvas editor for VAN_WESTENDORP (PSM) questions.
// Shows: product description, optional qualifying question block,
// 2x2 grid of 4 editable price question cards, and optional NMS extension block.

import React from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const PSM_THRESHOLDS = [
  { key: 'vwQ1Text' as const, title: 'Too cheap',    dot: '#FF6B6B' },
  { key: 'vwQ2Text' as const, title: 'Good value',   dot: '#6EDA8A' },
  { key: 'vwQ3Text' as const, title: 'Expensive',    dot: '#FFBE6A' },
  { key: 'vwQ4Text' as const, title: 'Too expensive', dot: '#FF7B72' },
];

const VanWestendorpCanvasEditor: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const cfg = question.config;
  const currency = cfg.vwCurrency ?? '₹';
  const showQualifying = cfg.vwShowQualifying !== false;
  const showNMS = cfg.vwShowNMS ?? false;

  return (
    <div className="space-y-4">

      {/* Product description */}
      <div>
        <span className="block text-xs font-semibold text-outline uppercase tracking-wide mb-1.5">
          Product description
        </span>
        <textarea
          rows={2}
          value={cfg.vwProductDescription ?? ''}
          placeholder="Describe the product or service being evaluated..."
          onChange={(e) => setQuestionConfig(qIdx, { vwProductDescription: e.target.value })}
          className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2.5 text-sm text-on-surface placeholder-outline/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
      </div>

      {/* Qualifying question block */}
      <div
        className={`bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden transition-opacity ${showQualifying ? 'opacity-100' : 'opacity-35 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant bg-surface-container/60">
          <span className="flex items-center gap-1.5 text-xs font-medium text-outline">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            value={cfg.vwQualifyingQuestion ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { vwQualifyingQuestion: e.target.value })}
            className="w-full bg-transparent text-sm text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
          />
        </div>
      </div>

      <hr className="border-outline-variant" />

      {/* Price questions header */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-outline uppercase tracking-wide">Price questions</span>
        <span title="Four questions that map respondents' psychological price boundaries. Edit the wording if needed — keep the meaning intact.">
          <svg className="w-3.5 h-3.5 text-outline cursor-default" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v5M12 8h.01" />
          </svg>
        </span>
      </div>

      {/* 2x2 grid of price question cards */}
      <div className="grid grid-cols-2 gap-2">
        {PSM_THRESHOLDS.map(({ key, title, dot }) => (
          <div key={key} className="border border-outline-variant rounded-lg bg-surface-container-low overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-outline-variant">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dot }} />
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">{title}</span>
            </div>
            <div className="px-3 py-2.5 space-y-2">
              <textarea
                rows={3}
                value={(cfg[key] as string | undefined) ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { [key]: e.target.value })}
                className="w-full bg-transparent text-sm text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-outline">Answer type:</span>
                <span className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full border border-outline-variant">
                  {currency} number
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newton, Miller & Smith extension block */}
      <div
        className={`border border-purple-500/30 rounded-lg bg-purple-500/10 overflow-hidden transition-opacity ${showNMS ? 'opacity-100' : 'opacity-35 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-purple-500/25">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-300 [[data-theme='light']_&]:text-purple-700">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17 6 23 6 23 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Newton, Miller &amp; Smith extension
            <span title="Adds a purchase likelihood scale at the respondent's own 'good value' and 'expensive' prices. Bridges psychological pricing with actual purchase intent.">
              <svg className="w-3.5 h-3.5 cursor-default" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v5M12 8h.01" />
              </svg>
            </span>
          </span>
          <span className="text-xs text-purple-300/70 [[data-theme='light']_&]:text-purple-600">Toggle in settings →</span>
        </div>
        <div className="px-3 py-3 space-y-2">
          {/* At good value */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EDA8A] flex-shrink-0" />
            <span className="min-w-[70px] text-xs font-medium text-purple-300 [[data-theme='light']_&]:text-purple-700">At good value:</span>
            <textarea
              rows={1}
              value={cfg.vwNMSGoodValueQuestion ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { vwNMSGoodValueQuestion: e.target.value })}
              className="flex-1 bg-transparent text-xs text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
            />
          </div>
          {/* At expensive */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBE6A] flex-shrink-0" />
            <span className="min-w-[70px] text-xs font-medium text-purple-300 [[data-theme='light']_&]:text-purple-700">At expensive:</span>
            <textarea
              rows={1}
              value={cfg.vwNMSExpensiveQuestion ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { vwNMSExpensiveQuestion: e.target.value })}
              className="flex-1 bg-transparent text-xs text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
            />
          </div>
          <p className="text-xs text-purple-300/70 [[data-theme='light']_&]:text-purple-600 pl-3.5">
            [GoodValue] and [Expensive] are replaced with each respondent's own answers from the price questions above.
          </p>
        </div>
      </div>

    </div>
  );
};

export default VanWestendorpCanvasEditor;
