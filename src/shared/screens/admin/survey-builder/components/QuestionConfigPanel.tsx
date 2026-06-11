// components/QuestionConfigPanel.tsx
//
// Right panel in the question builder section.
// Shows behaviour-level settings for the selected question:
//   - Required toggle
//   - Allow Comment toggle
//   - MCQ-specific settings (Order of Options, Force selections, Others/All/None toggles)
//   - Option Filter (MCQ types only)
//   - Conditional Logic

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

// ── Local toggle/spinner components ─────────────────────────────────────────

const RightPanelToggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1 pr-3">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      {description && <p className="text-xs text-outline mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-primary' : 'bg-outline-variant'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Spinner: React.FC<{
  value: number | undefined;
  min?: number;
  onChange: (v: number) => void;
}> = ({ value, min = 1, onChange }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, (value ?? min) - 1))}
      className="w-6 h-6 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high text-sm font-medium leading-none"
    >
      −
    </button>
    <span className="w-6 text-center text-xs font-medium text-on-surface tabular-nums">
      {value ?? '—'}
    </span>
    <button
      type="button"
      onClick={() => onChange((value ?? min - 1) + 1)}
      className="w-6 h-6 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-high text-sm font-medium leading-none"
    >
      +
    </button>
  </div>
);

// ── Main panel ───────────────────────────────────────────────────────────────

const QuestionConfigPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    activeLanguage,
    setQuestionField,
    setQuestionConfig,
    setQuestionTranslation,
  } = useSurveyBuilderStore();

  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full bg-surface-container-low flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-outline">Select a question</p>
          <p className="text-xs text-outline mt-1">Question settings will appear here</p>
        </div>
      </div>
    );
  }

  const question = questions[selectedQuestionIndex];
  if (!question) return null;

  const cfg = question.config;
  const isMcq =
    question.questionType === QuestionType.MCQ_SINGLE ||
    question.questionType === QuestionType.MCQ_MULTIPLE;
  const isMcqMultiple = question.questionType === QuestionType.MCQ_MULTIPLE;
  const isRanking = question.questionType === QuestionType.RANKING;
  const isFile = question.questionType === QuestionType.FILE;
  const isVideo = question.questionType === QuestionType.VIDEO;
  const isAudio = question.questionType === QuestionType.AUDIO;

  const isText = question.questionType === QuestionType.TEXT;
  const isTextarea = question.questionType === QuestionType.TEXTAREA;
  const isNumber = question.questionType === QuestionType.NUMBER;
  const isCurrency = question.questionType === QuestionType.CURRENCY;
  const isTextType = [
    QuestionType.TEXT, QuestionType.TEXTAREA, QuestionType.NUMBER,
    QuestionType.EMAIL, QuestionType.PHONE, QuestionType.DATE, QuestionType.CURRENCY,
  ].includes(question.questionType);
  const isMaxDiff = question.questionType === QuestionType.MAX_DIFF;
  const isGaborGranger = question.questionType === QuestionType.GABOR_GRANGER;

  // Others option — derived from options array
  const opts = cfg.options ?? [];
  const hasOthers = opts.some((o) => o.value === 'others');
  const hasAllOfAbove = opts.some((o) => o.value === 'all_of_above');

  const toggleOthers = (on: boolean) => {
    if (on) {
      setQuestionConfig(selectedQuestionIndex, {
        options: [...opts.filter((o) => o.value !== 'others'), { value: 'others', label: 'Others' }],
      });
    } else {
      setQuestionConfig(selectedQuestionIndex, {
        options: opts.filter((o) => o.value !== 'others'),
        othersPlaceholder: undefined,
      });
    }
  };

  const toggleAllOfAbove = (on: boolean) => {
    const withoutAoa = opts.filter((o) => o.value !== 'all_of_above');
    if (on) {
      const othersIdx = withoutAoa.findIndex((o) => o.value === 'others');
      const inserted =
        othersIdx >= 0
          ? [
              ...withoutAoa.slice(0, othersIdx),
              { value: 'all_of_above', label: 'All of the above' },
              ...withoutAoa.slice(othersIdx),
            ]
          : [...withoutAoa, { value: 'all_of_above', label: 'All of the above' }];
      setQuestionConfig(selectedQuestionIndex, { options: inserted });
    } else {
      setQuestionConfig(selectedQuestionIndex, { options: withoutAoa });
    }
  };

  return (
    <div className="h-full bg-surface-container-low flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-outline-variant/50">
        <h3 className="text-sm font-semibold text-on-surface-variant">Question Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Required / Allow Comment */}
        <div className="space-y-3">
          <RightPanelToggle
            label="Required"
            description="Respondents must answer this question"
            checked={question.required ?? false}
            onChange={() => setQuestionField(selectedQuestionIndex, 'required', !question.required)}
          />
          <RightPanelToggle
            label="Allow Comment"
            description="Add an optional comment field"
            checked={question.allowComment ?? false}
            onChange={() => setQuestionField(selectedQuestionIndex, 'allowComment', !question.allowComment)}
          />
        </div>

        {/* MCQ-specific settings */}
        {isMcq && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">

            {/* Order of Options */}
            <div className="space-y-2">
              <RightPanelToggle
                label="Order of Options"
                description="Change the order the options appear"
                checked={cfg.randomizeOptions ?? false}
                onChange={() =>
                  setQuestionConfig(selectedQuestionIndex, {
                    randomizeOptions: !cfg.randomizeOptions,
                    optionOrderStrategy: !cfg.randomizeOptions
                      ? (cfg.optionOrderStrategy ?? 'random')
                      : undefined,
                  })
                }
              />
              {cfg.randomizeOptions && (
                <select
                  value={cfg.optionOrderStrategy ?? 'random'}
                  onChange={(e) =>
                    setQuestionConfig(selectedQuestionIndex, {
                      optionOrderStrategy: e.target.value as typeof cfg.optionOrderStrategy,
                    })
                  }
                  className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                >
                  <option value="random">Random</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="numerical_high_to_low">Numerical High to Low</option>
                  <option value="numerical_low_to_high">Numerical Low to High</option>
                  <option value="flip">Flip</option>
                  <option value="rotate">Rotate</option>
                </select>
              )}
            </div>

            {/* Force number of Options — MCQ_MULTIPLE only */}
            {isMcqMultiple && (
              <div className="space-y-3">
                <RightPanelToggle
                  label="Force number of Options"
                  description="Make respondents choose one or more"
                  checked={cfg.forceSelectionCount ?? false}
                  onChange={() =>
                    setQuestionConfig(selectedQuestionIndex, {
                      forceSelectionCount: !cfg.forceSelectionCount,
                      ...(!cfg.forceSelectionCount
                        ? {}
                        : { minSelections: undefined, maxSelections: undefined }),
                    })
                  }
                />
                {cfg.forceSelectionCount && (
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">Minimum selections</span>
                      <Spinner
                        value={cfg.minSelections}
                        onChange={(v) => setQuestionConfig(selectedQuestionIndex, { minSelections: v })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">Maximum selections</span>
                      <Spinner
                        value={cfg.maxSelections}
                        onChange={(v) => setQuestionConfig(selectedQuestionIndex, { maxSelections: v })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show "others" option */}
            <RightPanelToggle
              label='Show "others" option'
              description="Allow users to enter their own answer"
              checked={hasOthers}
              onChange={() => toggleOthers(!hasOthers)}
            />

            {/* Show "All of the above" — MCQ_MULTIPLE only */}
            {isMcqMultiple && (
              <RightPanelToggle
                label='"All of the above" option'
                description="Allow users to select all of the options"
                checked={hasAllOfAbove}
                onChange={() => toggleAllOfAbove(!hasAllOfAbove)}
              />
            )}

            {/* Show "None of the above" */}
            <RightPanelToggle
              label='"None of the above" option'
              description="Allow users to select none of the options"
              checked={cfg.hasExclusiveOption ?? false}
              onChange={() =>
                setQuestionConfig(selectedQuestionIndex, {
                  hasExclusiveOption: !cfg.hasExclusiveOption,
                  exclusiveOptionLabel: !cfg.hasExclusiveOption
                    ? (cfg.exclusiveOptionLabel || 'None of the above')
                    : undefined,
                })
              }
            />
          </div>
        )}

        {/* Ranking-specific settings */}
        {isRanking && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">

            {/* Response format */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Response Format</span>
              <select
                value={cfg.rankingFormat ?? 'drag-vertical'}
                onChange={(e) =>
                  setQuestionConfig(selectedQuestionIndex, {
                    rankingFormat: e.target.value as typeof cfg.rankingFormat,
                  })
                }
                className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
              >
                <option value="drag-vertical">Drag to sort (vertical)</option>
                <option value="drag-horizontal">Drag to sort (horizontal)</option>
                <option value="drag-container">Drag to container</option>
                <option value="dropdown">Dropdown per item</option>
                <option value="numeric-input">Number input per item</option>
              </select>
            </div>

            {/* Dropdown placeholder — only when format is dropdown */}
            {cfg.rankingFormat === 'dropdown' && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-on-surface-variant">Dropdown placeholder</span>
                <input
                  type="text"
                  value={cfg.rankingDropdownPlaceholder ?? ''}
                  onChange={(e) =>
                    setQuestionConfig(selectedQuestionIndex, {
                      rankingDropdownPlaceholder: e.target.value || undefined,
                    })
                  }
                  placeholder="Click to select rank..."
                  className="w-36 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Partial ranking */}
            <RightPanelToggle
              label="Partial ranking"
              description="Allow ranking only N items instead of all"
              checked={cfg.allowPartialRanking ?? false}
              onChange={() =>
                setQuestionConfig(selectedQuestionIndex, {
                  allowPartialRanking: !cfg.allowPartialRanking,
                  ...(!cfg.allowPartialRanking ? {} : { partialRankCount: undefined }),
                })
              }
            />
            {cfg.allowPartialRanking && (
              <div className="flex items-center justify-between pl-1">
                <span className="text-xs text-on-surface-variant">Items to rank</span>
                <Spinner
                  value={cfg.partialRankCount}
                  min={1}
                  onChange={(v) => setQuestionConfig(selectedQuestionIndex, { partialRankCount: v })}
                />
              </div>
            )}

            {/* Show Others option */}
            <RightPanelToggle
              label='Show "Others" option'
              description="Allow respondents to enter their own answer"
              checked={opts.some((o) => o.value === 'others')}
              onChange={() => {
                const hasOthers = opts.some((o) => o.value === 'others');
                if (hasOthers) {
                  setQuestionConfig(selectedQuestionIndex, {
                    options: opts.filter((o) => o.value !== 'others'),
                  });
                } else {
                  setQuestionConfig(selectedQuestionIndex, {
                    options: [...opts, { value: 'others', label: 'Others' }],
                  });
                }
              }}
            />

          </div>
        )}

        {/* File Upload settings */}
        {isFile && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">
            <span className="block text-xs font-semibold text-outline uppercase tracking-wide">File Upload Settings</span>

            {/* Accepted file types */}
            <div className="space-y-2">
              <span className="text-xs text-on-surface-variant">Accepted file types</span>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {(['pdf', 'jpg', 'png', 'doc', 'mp4'] as const).map((type) => {
                  const accepted = cfg.acceptedFileTypes ?? [];
                  const checked = accepted.includes(type);
                  return (
                    <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          const next = checked
                            ? accepted.filter((t) => t !== type)
                            : [...accepted, type];
                          setQuestionConfig(selectedQuestionIndex, { acceptedFileTypes: next });
                        }}
                        className="w-3.5 h-3.5 accent-primary"
                      />
                      <span className="text-xs font-medium text-on-surface-variant uppercase">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Max file size */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-on-surface-variant">Max file size (MB)</span>
              <input
                type="number"
                min={1}
                max={100}
                value={cfg.maxFileSizeMb ?? 10}
                onChange={(e) =>
                  setQuestionConfig(selectedQuestionIndex, { maxFileSizeMb: Number(e.target.value) })
                }
                className="w-20 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
              />
            </div>

          </div>
        )}

        {/* Video Response settings */}
        {isVideo && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">
            <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Video Settings</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-on-surface-variant">Max duration (seconds)</span>
              <input
                type="number"
                min={5}
                max={600}
                value={cfg.maxVideoDurationSec ?? 120}
                onChange={(e) =>
                  setQuestionConfig(selectedQuestionIndex, { maxVideoDurationSec: Number(e.target.value) })
                }
                className="w-20 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
              />
            </div>
          </div>
        )}

        {/* Audio Response settings */}
        {isAudio && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">
            <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Audio Settings</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-on-surface-variant">Max duration (seconds)</span>
              <input
                type="number"
                min={5}
                max={600}
                value={cfg.maxAudioDurationSec ?? 120}
                onChange={(e) =>
                  setQuestionConfig(selectedQuestionIndex, { maxAudioDurationSec: Number(e.target.value) })
                }
                className="w-20 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
              />
            </div>
          </div>
        )}

        {/* Text-type settings */}
        {isTextType && (
          <div className="space-y-4 pt-3 border-t border-outline-variant/50">

            {/* Placeholder */}
            <div className="space-y-1.5">
              <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Placeholder</span>
              <input
                type="text"
                value={question.translations[activeLanguage]?.placeholder ?? ''}
                onChange={(e) => setQuestionTranslation(selectedQuestionIndex, activeLanguage, { placeholder: e.target.value })}
                placeholder="e.g. Enter your answer..."
                className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Character limits — TEXT / TEXTAREA only */}
            {(isText || isTextarea) && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Character Limits</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Min chars</span>
                  <Spinner
                    value={cfg.minChars}
                    min={0}
                    onChange={(v) => setQuestionConfig(selectedQuestionIndex, { minChars: v > 0 ? v : undefined })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Max chars</span>
                  <Spinner
                    value={cfg.maxChars}
                    min={1}
                    onChange={(v) => setQuestionConfig(selectedQuestionIndex, { maxChars: v })}
                  />
                </div>
              </div>
            )}

            {/* Input size — TEXT (width) / TEXTAREA (height) */}
            {(isText || isTextarea) && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Input Size</span>
                {isText && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface-variant">Width (px)</span>
                    <input
                      type="number"
                      min={50}
                      value={cfg.inputWidthPx ?? ''}
                      onChange={(e) => setQuestionConfig(selectedQuestionIndex, { inputWidthPx: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Full width"
                      className="w-24 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    />
                  </div>
                )}
                {isTextarea && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-on-surface-variant">Height (px)</span>
                    <input
                      type="number"
                      min={60}
                      value={cfg.inputHeightPx ?? ''}
                      onChange={(e) => setQuestionConfig(selectedQuestionIndex, { inputHeightPx: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="Auto"
                      className="w-24 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Number: value range */}
            {isNumber && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Value Range</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-on-surface-variant">Min</span>
                  <input
                    type="number"
                    value={cfg.min ?? ''}
                    onChange={(e) => setQuestionConfig(selectedQuestionIndex, { min: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-24 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-on-surface-variant">Max</span>
                  <input
                    type="number"
                    value={cfg.max ?? ''}
                    onChange={(e) => setQuestionConfig(selectedQuestionIndex, { max: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-24 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-right"
                  />
                </div>
              </div>
            )}

            {/* Number: decimal delimiter */}
            {isNumber && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Decimal Delimiter</span>
                <div className="flex gap-4">
                  {(['period', 'comma'] as const).map((d) => (
                    <label key={d} className="flex items-center gap-1.5 cursor-pointer text-xs text-on-surface-variant">
                      <input
                        type="radio"
                        name={`decimal-${selectedQuestionIndex}`}
                        checked={(cfg.decimalDelimiter ?? 'period') === d}
                        onChange={() => setQuestionConfig(selectedQuestionIndex, { decimalDelimiter: d })}
                        className="accent-primary"
                      />
                      {d === 'period' ? 'Period ( . )' : 'Comma ( , )'}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Number: Don't Know / Refuse */}
            {isNumber && (
              <div className="space-y-2">
                <RightPanelToggle
                  label={`Allow "Don't Know / Refuse"`}
                  checked={cfg.hasDontKnow ?? false}
                  onChange={() => setQuestionConfig(selectedQuestionIndex, { hasDontKnow: !cfg.hasDontKnow })}
                />
                {cfg.hasDontKnow && (
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-on-surface-variant">Button label</span>
                      <input
                        type="text"
                        value={cfg.dontKnowLabel ?? ''}
                        onChange={(e) => setQuestionConfig(selectedQuestionIndex, { dontKnowLabel: e.target.value || undefined })}
                        placeholder="Don't Know"
                        className="w-28 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-on-surface-variant">Stored value</span>
                      <input
                        type="text"
                        value={cfg.dontKnowValue ?? ''}
                        onChange={(e) => setQuestionConfig(selectedQuestionIndex, { dontKnowValue: e.target.value || undefined })}
                        placeholder="DK"
                        className="w-28 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Currency code */}
            {isCurrency && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-on-surface-variant">Currency code</span>
                <input
                  type="text"
                  value={cfg.currency ?? ''}
                  onChange={(e) => setQuestionConfig(selectedQuestionIndex, { currency: e.target.value })}
                  placeholder="INR, USD..."
                  maxLength={5}
                  className="w-24 border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

          </div>
        )}

        {/* MaxDiff settings */}
        {isMaxDiff && (() => {
          const n = cfg.options?.length ?? 0;
          const ips = cfg.itemCount ?? 4;
          const sets = cfg.maxDiffNumSets ?? 10;
          const anchored = cfg.anchoredMaxDiff ?? false;
          const express = cfg.maxDiffExpressMode ?? false;
          const sparse = cfg.maxDiffSparseMode ?? false;

          type GuidanceVariant = 'ok' | 'warn' | 'info';
          const guidance: Array<{ variant: GuidanceVariant; text: string }> = [];

          if (n < 6) {
            guidance.push({ variant: 'warn', text: `Only ${n} item${n !== 1 ? 's' : ''} — MaxDiff needs at least 8 for reliable scores. Add more items.` });
          } else if (n < 8) {
            guidance.push({ variant: 'warn', text: `${n} items is borderline. At least 8 items recommended for dependable results.` });
          } else if (n <= 20) {
            guidance.push({ variant: 'ok', text: `${n} items — good range. Results will be statistically reliable.` });
          } else if (n <= 40) {
            guidance.push({ variant: 'ok', text: `${n} items — larger set. Consider enabling Express mode to reduce respondent fatigue.` });
          } else {
            guidance.push({ variant: 'warn', text: `${n} items is a very large set. Enable Express or Sparse mode to keep it manageable.` });
          }

          if (ips < 3) {
            guidance.push({ variant: 'warn', text: 'Items per set is too low. Respondents need at least 3–4 items to make a meaningful comparison.' });
          } else if (ips > 6) {
            guidance.push({ variant: 'warn', text: 'More than 6 items per set is hard for respondents. The sweet spot is 4–5.' });
          } else {
            guidance.push({ variant: 'ok', text: `${ips} items per set — good choice.` });
          }

          if (sets < 8) {
            guidance.push({ variant: 'warn', text: `${sets} sets may not be enough. At least 8 sets per respondent gives stable preference scores.` });
          } else if (sets <= 15) {
            guidance.push({ variant: 'ok', text: `${sets} sets — solid. Respondents can finish without fatigue.` });
          } else {
            guidance.push({ variant: 'warn', text: `${sets} sets is high. Respondents may drop off after 15. Consider reducing.` });
          }

          if (anchored) guidance.push({ variant: 'info', text: 'Anchored MaxDiff adds a "none of these" option. Use when some items may genuinely not apply.' });
          if (express) guidance.push({ variant: 'info', text: 'Express mode shows a subset of items per respondent. Best for 30+ items.' });
          if (sparse) guidance.push({ variant: 'info', text: 'Sparse mode: each item shown once per respondent. Best for 50+ items.' });
          if (express && sparse) guidance.push({ variant: 'warn', text: 'Both Express and Sparse are on. This is rarely needed — pick one unless your list is 50+ items.' });

          const isOptimal = n >= 8 && ips >= 3 && ips <= 6 && sets >= 8 && sets <= 15;

          const variantClass: Record<GuidanceVariant, string> = {
            ok:   'bg-green-50 border-green-200 text-green-700',
            warn: 'bg-amber-50 border-amber-200 text-amber-700',
            info: 'bg-blue-50 border-blue-200 text-blue-700',
          };

          return (
            <div className="space-y-4 pt-3 border-t border-outline-variant/50">
              <span className="block text-xs font-semibold text-outline uppercase tracking-wide">MaxDiff Settings</span>

              {/* Items per set */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-on-surface-variant">Items per set</span>
                  <p className="text-xs text-outline mt-0.5">Items shown per choice set (4–5 recommended)</p>
                </div>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={ips}
                  onChange={(e) => setQuestionConfig(selectedQuestionIndex, { itemCount: Number(e.target.value) })}
                  className="w-16 border border-outline-variant rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary flex-shrink-0"
                />
              </div>

              {/* Number of sets */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-on-surface-variant">Number of sets</span>
                  <p className="text-xs text-outline mt-0.5">Choice sets shown per respondent (min 8)</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={sets}
                  onChange={(e) => setQuestionConfig(selectedQuestionIndex, { maxDiffNumSets: Number(e.target.value) })}
                  className="w-16 border border-outline-variant rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary flex-shrink-0"
                />
              </div>

              {/* Modes */}
              <div className="space-y-3">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Modes</span>

                <RightPanelToggle
                  label="Anchored MaxDiff"
                  description='Adds a "none of these" anchor option per set'
                  checked={anchored}
                  onChange={() => setQuestionConfig(selectedQuestionIndex, { anchoredMaxDiff: !anchored })}
                />
                {anchored && (
                  <div className="space-y-2 pl-1 pt-1 border-l-2 border-primary/20 ml-1">
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-1">Anchor question text</label>
                      <input
                        type="text"
                        value={cfg.anchorQuestionText ?? ''}
                        onChange={(e) => setQuestionConfig(selectedQuestionIndex, { anchorQuestionText: e.target.value || undefined })}
                        placeholder="Is this important to you?"
                        className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-on-surface-variant">Items/set (min 5)</span>
                      <Spinner
                        value={cfg.itemsPerSet ?? 7}
                        min={5}
                        onChange={(v) => setQuestionConfig(selectedQuestionIndex, { itemsPerSet: v })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">Yes label</label>
                        <input
                          type="text"
                          value={cfg.anchorPositiveLabel ?? ''}
                          onChange={(e) => setQuestionConfig(selectedQuestionIndex, { anchorPositiveLabel: e.target.value || undefined })}
                          placeholder="Important"
                          className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-on-surface-variant mb-1">No label</label>
                        <input
                          type="text"
                          value={cfg.anchorNegativeLabel ?? ''}
                          onChange={(e) => setQuestionConfig(selectedQuestionIndex, { anchorNegativeLabel: e.target.value || undefined })}
                          placeholder="Not important"
                          className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <RightPanelToggle
                  label="Express mode"
                  description="Show a random subset of items per respondent"
                  checked={express}
                  onChange={() => setQuestionConfig(selectedQuestionIndex, {
                    maxDiffExpressMode: !express,
                    maxDiffSparseMode: false,
                  })}
                />
                {express && (
                  <div className="flex items-center justify-between gap-2 pl-1">
                    <span className="text-xs text-on-surface-variant">Items shown per respondent</span>
                    <Spinner
                      value={cfg.expressItemCount}
                      min={2}
                      onChange={(v) => setQuestionConfig(selectedQuestionIndex, { expressItemCount: v })}
                    />
                  </div>
                )}

                <RightPanelToggle
                  label="Sparse mode"
                  description="Each item shown exactly once per respondent (50+ items)"
                  checked={sparse}
                  onChange={() => setQuestionConfig(selectedQuestionIndex, {
                    maxDiffSparseMode: !sparse,
                    maxDiffExpressMode: false,
                    expressItemCount: undefined,
                  })}
                />
              </div>

              {/* Live Guidance */}
              <div className="pt-3 border-t border-outline-variant/50 space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Live Guidance</span>
                {guidance.map((g, i) => (
                  <div key={i} className={`text-xs px-3 py-2 rounded-lg border ${variantClass[g.variant]} leading-relaxed`}>
                    {g.text}
                  </div>
                ))}
                {isOptimal && (
                  <div className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 border border-green-300 text-green-700 px-3 py-1.5 rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Recommended setup
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Gabor-Granger settings */}
        {isGaborGranger && (() => {
          const n = cfg.options?.length ?? 0;
          const currency = cfg.gaborCurrency ?? '₹';
          const minPrice = cfg.gaborMinPrice ?? 200;
          const maxPrice = cfg.gaborMaxPrice ?? 1100;
          const priceStep = cfg.gaborPriceStep ?? 100;
          const mode = cfg.gaborPresentationMode ?? 'sequential';
          const showQual = cfg.gaborShowQualifying ?? true;

          type GuidanceVariant = 'ok' | 'warn' | 'info';
          const guidance: Array<{ variant: GuidanceVariant; text: string }> = [];

          if (n < 4) {
            guidance.push({ variant: 'warn', text: `Only ${n} price point${n !== 1 ? 's' : ''} — need at least 4 to plot a demand curve.` });
          } else if (n < 6) {
            guidance.push({ variant: 'warn', text: `${n} price points is low. 6–10 gives a smoother demand curve.` });
          } else if (n <= 12) {
            guidance.push({ variant: 'ok', text: `${n} price points — good range for a reliable demand curve.` });
          } else {
            guidance.push({ variant: 'warn', text: `${n} prices may cause respondent fatigue in sequential mode. Consider reducing to 10–12.` });
          }

          if (minPrice >= maxPrice) {
            guidance.push({ variant: 'warn', text: 'Min price must be lower than max price.' });
          } else {
            const spread = Math.round((maxPrice - minPrice) / minPrice * 100);
            if (spread < 50) {
              guidance.push({ variant: 'warn', text: `Range is narrow (${spread}% spread). Widen it to better capture willingness to pay.` });
            } else {
              guidance.push({ variant: 'ok', text: `Range: ${currency}${minPrice} – ${currency}${maxPrice}. Good spread for price sensitivity.` });
            }
          }

          if (mode === 'sequential') {
            guidance.push({ variant: 'info', text: 'Sequential: one price shown at a time — more accurate, respondents cannot compare.' });
          } else {
            guidance.push({ variant: 'warn', text: 'All at once: respondents see all prices simultaneously. Anchoring on the highest price may skew results.' });
          }

          if (showQual) {
            guidance.push({ variant: 'info', text: 'Qualifying question on — non-buyers filtered before price questions.' });
          }

          const spread = minPrice < maxPrice ? Math.round((maxPrice - minPrice) / minPrice * 100) : 0;
          const isOptimal = n >= 6 && n <= 12 && minPrice < maxPrice && spread >= 50 && mode === 'sequential' && showQual;

          const variantClass: Record<GuidanceVariant, string> = {
            ok:   'bg-green-50 border-green-200 text-green-700',
            warn: 'bg-amber-50 border-amber-200 text-amber-700',
            info: 'bg-blue-50 border-blue-200 text-blue-700',
          };

          return (
            <div className="space-y-4 pt-3 border-t border-outline-variant/50">
              <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Gabor-Granger Settings</span>

              {/* Currency */}
              <div>
                <span className="block text-xs font-medium text-on-surface-variant mb-1.5">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setQuestionConfig(selectedQuestionIndex, { gaborCurrency: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="₹">₹ — Indian Rupee (INR)</option>
                  <option value="$">$ — US Dollar (USD)</option>
                  <option value="€">€ — Euro (EUR)</option>
                  <option value="£">£ — British Pound (GBP)</option>
                  <option value="¥">¥ — Japanese Yen (JPY)</option>
                  <option value="S$">S$ — Singapore Dollar (SGD)</option>
                  <option value="AED">AED — UAE Dirham</option>
                </select>
              </div>

              {/* Auto-generate range */}
              <div>
                <span className="block text-xs font-medium text-on-surface-variant mb-1.5">Auto-generate range</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-xs text-outline mb-1">Min</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setQuestionConfig(selectedQuestionIndex, { gaborMinPrice: Number(e.target.value) })}
                      className="w-full border border-outline-variant rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <span className="block text-xs text-outline mb-1">Max</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setQuestionConfig(selectedQuestionIndex, { gaborMaxPrice: Number(e.target.value) })}
                      className="w-full border border-outline-variant rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Step interval */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-medium text-on-surface-variant">Step interval</span>
                  <p className="text-xs text-outline mt-0.5">Gap between each price point</p>
                </div>
                <input
                  type="number"
                  value={priceStep}
                  onChange={(e) => setQuestionConfig(selectedQuestionIndex, { gaborPriceStep: Number(e.target.value) })}
                  className="w-16 border border-outline-variant rounded-lg px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary flex-shrink-0"
                />
              </div>

              {/* Presentation mode */}
              <div>
                <span className="block text-xs font-medium text-on-surface-variant mb-1.5">Presentation mode</span>
                <div className="flex rounded-lg border border-outline-variant overflow-hidden">
                  {(['sequential', 'allatonce'] as const).map((m, idx) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuestionConfig(selectedQuestionIndex, { gaborPresentationMode: m })}
                      className={`flex-1 py-1.5 text-xs font-medium transition-colors ${idx === 0 ? 'border-r border-outline-variant' : ''} ${
                        mode === m ? 'bg-primary text-on-primary' : 'text-outline hover:bg-surface-container-high'
                      }`}
                    >
                      {m === 'sequential' ? 'Sequential' : 'All at once'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qualifying toggle */}
              <RightPanelToggle
                label="Qualifying question"
                description="Filter out non-buyers before price questions"
                checked={showQual}
                onChange={() => setQuestionConfig(selectedQuestionIndex, { gaborShowQualifying: !showQual })}
              />

              {/* Live Guidance */}
              <div className="pt-3 border-t border-outline-variant/50 space-y-2">
                <span className="block text-xs font-semibold text-outline uppercase tracking-wide">Live Guidance</span>
                {guidance.map((g, i) => (
                  <div key={i} className={`text-xs px-3 py-2 rounded-lg border ${variantClass[g.variant]} leading-relaxed`}>
                    {g.text}
                  </div>
                ))}
                {isOptimal && (
                  <div className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 border border-green-300 text-green-700 px-3 py-1.5 rounded-full">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Recommended setup
                  </div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default QuestionConfigPanel;
