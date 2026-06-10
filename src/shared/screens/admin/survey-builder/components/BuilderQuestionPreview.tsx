// components/BuilderQuestionPreview.tsx
//
// Maps IBuilderQuestion → real survey question atoms.
//
// When `interactive` is true (used by Show Preview mode):
//   - All inputs are editable (no readOnly)
//   - Local state tracks the selected answer for controlled components
//   - onAnswerChange reports changes to the parent for conditional visibility
//   - onBack / onNext allow the parent to drive paginated navigation
//
// When `interactive` is false (default static preview):
//   - Inputs are read-only / static
//   - Controlled-component props use sensible empty defaults

import React, { useState } from 'react';
import { QuestionType, type SurveyFormLayout } from '@/core/types/survey.type';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { SurveyLayoutContext } from '@/shared/screens/survey-boards/survey-layout-context';
import {
  SurveyQuestionWrapper,
  LickertScale,
  StarRating,
  RadioButtons,
  Checkboxes,
  SingleSlider,
  DoubleSlider,
  MultipleSlider,
  MatrixGrid,
  Ranking,
  MaxDiff,
  ConstantSum,
} from '@/shared/ui/atoms/survey-questions';
import { FileUpload } from '@/shared/ui/atoms/survey-questions/FileUpload';
import { VideoUpload } from '@/shared/ui/atoms/survey-questions/VideoUpload';
import { AudioUpload } from '@/shared/ui/atoms/survey-questions/AudioUpload';
import { PhoneInputField } from '@/shared/ui/atoms/survey-questions/PhoneInputField';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BuilderQuestionPreviewProps {
  question: IBuilderQuestion;
  lang: SupportedBuilderLanguage;
  questionNumber: number;
  totalQuestions: number;
  /** Controls which layout SurveyQuestionWrapper renders ('paginated' | 'list'). */
  previewLayout: SurveyFormLayout;
  /** When true, all inputs are editable and local state tracks answers. */
  interactive?: boolean;
  /** Reports the string representation of the current answer to the parent. Used for conditional visibility. */
  onAnswerChange?: (value: string) => void;
  /** Called when the user clicks Back in paginated interactive mode. */
  onBack?: () => void;
  /** Called when the user clicks Next / Finish in paginated interactive mode. */
  onNext?: () => void;
  /** Whether Back is disabled (first question). */
  isFirst?: boolean;
  /** Whether this is the last visible question (shows Finish instead of Next). */
  isLast?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOOP = () => {};

/**
 * Returns options in the shape expected by RadioButtons / Checkboxes /
 * Ranking / MaxDiff / ConstantSum.
 */
function resolveOptions(question: IBuilderQuestion, lang: SupportedBuilderLanguage) {
  const configOpts = question.config.options ?? [];
  if (lang === 'en') {
    return configOpts.map((opt) => ({ id: opt.value, value: opt.value, label: opt.label, attributes: opt.attributes }));
  }
  const langOpts = question.translations[lang]?.options ?? [];
  return configOpts.map((opt, idx) => {
    const byValue = langOpts.find((o) => o.value === opt.value);
    const byIndex = langOpts[idx];
    const translated = byValue ?? byIndex;
    const label = translated?.label?.trim() ? translated.label : opt.label;
    return { id: opt.value, value: opt.value, label, attributes: opt.attributes };
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const BuilderQuestionPreview: React.FC<BuilderQuestionPreviewProps> = ({
  question,
  lang,
  questionNumber,
  totalQuestions,
  previewLayout,
  interactive = false,
  onAnswerChange,
  onBack,
  onNext,
  isFirst = true,
  isLast = false,
}) => {
  const { config } = question;

  // ── Local answer state (used when interactive=true) ──────────────────────
  const [textVal, setTextVal] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedStars, setSelectedStars] = useState<number | undefined>(undefined);
  const [likertValue, setLikertValue] = useState<number | undefined>(undefined);
  const [scaleValue, setScaleValue] = useState<number>(config.min ?? 1);
  // DoubleSlider manages its own internal state after mount — no need to mirror it here.
  // We just capture changes via onRangeChange for the answer string.
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [matrixValues, setMatrixValues] = useState<Record<string, string>>({});
  const [intensePurchaseAnswers, setIntensePurchaseAnswers] = useState<Record<string, boolean>>({});
  const [matrixIntensePurchase, setMatrixIntensePurchase] = useState<Record<string, boolean>>({});
  const [rankedItems, setRankedItems] = useState<string[]>(
    () => resolveOptions(question, lang).map((o) => o.value)
  );
  const [maxDiffSelections, setMaxDiffSelections] = useState<Record<string, 'best' | 'worst' | null>>({});
  const [allocatedPoints, setAllocatedPoints] = useState<Record<string, number>>({});
  const [constRatings, setConstRatings] = useState<Record<string, number>>({});
  const [constQuantities, setConstQuantities] = useState<Record<string, number>>({});

  const questionText =
    question.translations[lang].text || question.text || '(no question text)';
  const placeholder = question.translations[lang].placeholder ?? '';

  // ── Common props ──────────────────────────────────────────────────────────
  const commonProps = {
    questionNumber,
    totalQuestions,
    question: questionText,
    surveyId: 'PREVIEW',
    comment: '',
    showComment: question.allowComment,
    showIntensePurchase: !!config.isIntensePurchase,
    intensePurchaseLabel: config.intensePurchaseLabel || undefined,
    progress: questionNumber / totalQuestions,
    onBack: interactive ? (onBack ?? NOOP) : NOOP,
    onNext: interactive ? (onNext ?? NOOP) : NOOP,
    isNextDisabled: false,
    isLastQuestion: interactive ? isLast : questionNumber === totalQuestions,
    isOptional: !question.required,
    hasAnswer: false,
  } as const;

  // ── Per-type rendering ───────────────────────────────────────────────────
  const renderQuestion = () => {
    switch (question.questionType) {

      // ── Likert Scale ───────────────────────────────────────────────────
      case QuestionType.LIKERT_SCALE:
        return (
          <LickertScale
            {...commonProps}
            minValue={config.min ?? 1}
            maxValue={config.max ?? 10}
            minLabel={config.minLabel ?? ''}
            maxLabel={config.maxLabel ?? ''}
            selectedValue={interactive ? likertValue : undefined}
            onValueChange={(v: number) => {
              if (!interactive) return;
              setLikertValue(v);
              onAnswerChange?.(String(v));
            }}
          />
        );

      // ── Star Rating ───────────────────────────────────────────────────
      case QuestionType.RATING:
        return (
          <StarRating
            {...commonProps}
            maxStars={config.ratingMax ?? 5}
            image={config.questionMediaType === 'image' ? config.questionMediaUrl : undefined}
            video={config.questionMediaType === 'video' ? config.questionMediaUrl : undefined}
            selectedStars={interactive ? selectedStars : undefined}
            onRatingChange={(r: number) => {
              if (!interactive) return;
              setSelectedStars(r);
              onAnswerChange?.(String(r));
            }}
          />
        );

      // ── Scale (slider) ────────────────────────────────────────────────
      case QuestionType.SCALE:
        return (
          <SingleSlider
            {...commonProps}
            minValue={config.min ?? 1}
            maxValue={config.max ?? 10}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            step={config.step}
            selectedValue={interactive ? scaleValue : undefined}
            onValueChange={(v: number) => {
              if (!interactive) return;
              setScaleValue(v);
              onAnswerChange?.(String(v));
            }}
          />
        );

      // ── Double slider ─────────────────────────────────────────────────
      case QuestionType.DOUBLE_SLIDER:
        return (
          <DoubleSlider
            {...commonProps}
            minValue={config.min ?? 0}
            maxValue={config.max ?? 100}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            step={config.step}
            onRangeChange={(range) => {
              if (!interactive) return;
              onAnswerChange?.(`${range.min}-${range.max}`);
            }}
          />
        );

      // ── Multi slider ──────────────────────────────────────────────────
      case QuestionType.MULTI_SLIDER: {
        const sliderItems = (config.sliders ?? []).map((s) => ({
          id: s.value,
          label: s.label,
          minLabel: '',
          maxLabel: '',
        }));
        return (
          <MultipleSlider
            {...commonProps}
            items={sliderItems}
            minValue={config.min ?? 0}
            maxValue={config.max ?? 100}
            selectedValues={interactive ? sliderValues : {}}
            onValuesChange={(vals: Record<string, number>) => {
              if (!interactive) return;
              setSliderValues(vals);
              onAnswerChange?.(JSON.stringify(vals));
            }}
          />
        );
      }

      // ── MCQ Single ────────────────────────────────────────────────────
      case QuestionType.MCQ_SINGLE: {
        const mcqOptions = resolveOptions(question, lang).map((opt) => {
          const srcOpt = (question.config.options ?? []).find((o) => o.value === opt.value);
          return { ...opt, isIntensePurchase: srcOpt?.isIntensePurchase };
        });
        if (config.mcqSubType === 'dropdown') {
          return (
            <SurveyQuestionWrapper {...commonProps}>
              <select
                value={interactive ? selectedValue : ''}
                onChange={interactive ? (e) => { setSelectedValue(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
                className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
              >
                <option value="">Select an option...</option>
                {mcqOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </SurveyQuestionWrapper>
          );
        }
        return (
          <RadioButtons
            {...commonProps}
            options={mcqOptions}
            selectedValue={interactive ? selectedValue : undefined}
            onValueChange={(v: string) => {
              if (!interactive) return;
              setSelectedValue(v);
              onAnswerChange?.(v);
            }}
            intensePurchaseLabel={config.intensePurchaseLabel}
            intensePurchaseAnswers={interactive ? intensePurchaseAnswers : {}}
            onIntensePurchaseChange={(vals) => {
              if (!interactive) return;
              setIntensePurchaseAnswers(vals);
            }}
            othersPlaceholder={config.othersPlaceholder}
          />
        );
      }

      // ── MCQ Multiple ──────────────────────────────────────────────────
      case QuestionType.MCQ_MULTIPLE: {
        const minSel = config.minSelections;
        const maxSel = config.maxSelections;
        const selHint = minSel && maxSel
          ? `Select between ${minSel} and ${maxSel} options`
          : minSel ? `Select at least ${minSel} options`
          : maxSel ? `Select up to ${maxSel} options`
          : undefined;
        return (
          <Checkboxes
            {...commonProps}
            question={selHint ? `${questionText}\n${selHint}` : questionText}
            options={resolveOptions(question, lang)}
            selectedValues={interactive ? selectedValues : []}
            onValueChange={(vals: string[]) => {
              if (!interactive) return;
              setSelectedValues(vals);
              onAnswerChange?.(vals.join(','));
            }}
            othersPlaceholder={config.othersPlaceholder}
          />
        );
      }

      // ── Ranking ───────────────────────────────────────────────────────
      case QuestionType.RANKING:
        return (
          <Ranking
            {...commonProps}
            items={resolveOptions(question, lang)}
            rankedItems={interactive ? rankedItems : resolveOptions(question, lang).map((o) => o.value)}
            onRankingChange={(items: string[]) => {
              if (!interactive) return;
              setRankedItems(items);
              onAnswerChange?.(items.join(','));
            }}
          />
        );

      // ── Matrix ────────────────────────────────────────────────────────
      case QuestionType.MATRIX: {
        const rows = (config.rows ?? []).map((r) => ({ id: r.value, value: r.value, label: r.label }));
        const columns = (config.columns ?? []).map((c) => ({
          id: c.value,
          value: c.value,
          label: c.label,
          isIntensePurchase: c.isIntensePurchase,
        }));
        const rowColumnsMap =
          config.rowOptionsMode === 'per-row' && config.rowColumns
            ? Object.fromEntries(
                Object.entries(config.rowColumns).map(([k, cols]) => [
                  k,
                  cols.map((c) => ({
                    id: c.value,
                    value: c.value,
                    label: c.label,
                    isIntensePurchase: c.isIntensePurchase,
                  })),
                ])
              )
            : undefined;
        return (
          <MatrixGrid
            {...commonProps}
            rows={rows}
            columns={columns}
            rowColumnsMap={rowColumnsMap}
            selectedValues={interactive ? matrixValues : {}}
            onValuesChange={(vals: Record<string, string>) => {
              if (!interactive) return;
              setMatrixValues(vals);
              onAnswerChange?.(JSON.stringify(vals));
            }}
            intensePurchaseLabel={config.intensePurchaseLabel}
            intensePurchaseAnswers={interactive ? matrixIntensePurchase : undefined}
            onIntensePurchaseChange={(vals: Record<string, boolean>) => {
              if (!interactive) return;
              setMatrixIntensePurchase(vals);
            }}
          />
        );
      }

      // ── MaxDiff ───────────────────────────────────────────────────────
      case QuestionType.MAX_DIFF: {
        const maxDiffItems = resolveOptions(question, lang).map((o) => ({
          id: o.value,
          label: o.label,
          attributes: o.attributes,
        }));
        return (
          <MaxDiff
            {...commonProps}
            items={maxDiffItems}
            selections={interactive ? maxDiffSelections : {}}
            onSelectionChange={(vals: Record<string, 'best' | 'worst' | null>) => {
              if (!interactive) return;
              setMaxDiffSelections(vals);
              onAnswerChange?.(JSON.stringify(vals));
            }}
          />
        );
      }

      // ── Constant Sum ──────────────────────────────────────────────────
      case QuestionType.CONSTANT_SUM:
        return (
          <ConstantSum
            {...commonProps}
            totalPoints={config.total ?? 100}
            options={resolveOptions(question, lang)}
            allocatedPoints={interactive ? allocatedPoints : {}}
            onAllocationChange={(vals: Record<string, number>) => {
              if (!interactive) return;
              setAllocatedPoints(vals);
              onAnswerChange?.(JSON.stringify(vals));
            }}
            mode={config.constantSumMode ?? 'constant-sum'}
            ratingMax={config.ratingConjointMax ?? 10}
            ratings={interactive ? constRatings : {}}
            onRatingChange={(vals: Record<string, number>) => {
              if (!interactive) return;
              setConstRatings(vals);
            }}
            quantities={interactive ? constQuantities : {}}
            onQuantityChange={(vals: Record<string, number>) => {
              if (!interactive) return;
              setConstQuantities(vals);
            }}
            volumeMultiplierKey={config.volumeMultiplierKey}
          />
        );

      // ── Text inputs ────────────────────────────────────────────────────
      case QuestionType.TEXT: {
        const textMaxChars = config.maxChars;
        const textMinChars = config.minChars;
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="text"
              value={interactive ? textVal : undefined}
              readOnly={!interactive}
              maxLength={textMaxChars}
              onChange={interactive ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
              placeholder={placeholder || 'Enter your answer...'}
              style={config.inputWidthPx ? { width: `${config.inputWidthPx}px`, maxWidth: '100%' } : undefined}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
            />
            {(textMaxChars || textMinChars) && (
              <p className="mt-1 text-sm text-custom-grey-3 text-right">
                {textVal.length}{textMaxChars ? `/${textMaxChars}` : ''} chars
                {textMinChars && textVal.length < textMinChars ? ` (min ${textMinChars})` : ''}
              </p>
            )}
          </SurveyQuestionWrapper>
        );
      }

      case QuestionType.TEXTAREA: {
        const taMaxChars = config.maxChars;
        const taMinChars = config.minChars;
        const taRows = config.inputHeightPx
          ? Math.max(2, Math.round(config.inputHeightPx / 24))
          : 6;
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <textarea
              value={interactive ? textVal : undefined}
              readOnly={!interactive}
              maxLength={taMaxChars}
              onChange={interactive ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
              placeholder={placeholder || 'Enter your answer...'}
              rows={taRows}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg resize-vertical focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
            />
            {(taMaxChars || taMinChars) && (
              <p className="mt-1 text-sm text-custom-grey-3 text-right">
                {textVal.length}{taMaxChars ? `/${taMaxChars}` : ''} chars
                {taMinChars && textVal.length < taMinChars ? ` (min ${taMinChars})` : ''}
              </p>
            )}
          </SurveyQuestionWrapper>
        );
      }

      case QuestionType.NUMBER: {
        const hasDK = config.hasDontKnow === true;
        const dkLabel = config.dontKnowLabel ?? "Don't Know";
        const dkVal = config.dontKnowValue ?? 'DK';
        const isDKSelected = interactive && textVal === dkLabel;
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="number"
              value={interactive ? (isDKSelected ? '' : textVal) : undefined}
              readOnly={!interactive || isDKSelected}
              onChange={interactive && !isDKSelected ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
              placeholder="0"
              min={config.min}
              max={config.max}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
            />
            {hasDK && (
              <button
                type="button"
                onClick={interactive ? () => {
                  if (isDKSelected) {
                    setTextVal('');
                    onAnswerChange?.('');
                  } else {
                    setTextVal(dkLabel);
                    onAnswerChange?.(dkVal);
                  }
                } : undefined}
                className={`mt-2 px-4 py-1.5 text-sm rounded border transition-colors ${
                  isDKSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface-container text-custom-grey-3 border-custom-grey-2 hover:border-primary hover:text-primary'
                }`}
              >
                {isDKSelected ? `✓ ${dkLabel}` : dkLabel}
              </button>
            )}
          </SurveyQuestionWrapper>
        );
      }

      case QuestionType.EMAIL:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="email"
              value={interactive ? textVal : undefined}
              readOnly={!interactive}
              onChange={interactive ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.DATE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="date"
              value={interactive ? textVal : undefined}
              readOnly={!interactive}
              onChange={interactive ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none focus:bg-surface-container focus:border-primary transition-colors"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.CURRENCY: {
        const currencySymbol = config.currency ?? '₹';
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <div className="flex items-center border-b-2 bg-custom-grey-5 border-custom-grey-2 focus-within:bg-surface-container focus-within:border-primary transition-colors">
              <span className="pl-4 pr-1 text-base md:text-lg font-medium text-text-dark select-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={interactive ? textVal : undefined}
                readOnly={!interactive}
                onChange={interactive ? (e) => { setTextVal(e.target.value); onAnswerChange?.(e.target.value); } : undefined}
                placeholder="0"
                min={config.min ?? 0}
                className="w-full pr-4 py-3 bg-transparent text-base md:text-lg focus:outline-none"
              />
            </div>
          </SurveyQuestionWrapper>
        );
      }

      case QuestionType.PHONE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <PhoneInputField
              answer={undefined}
              onChange={interactive ? (a) => { onAnswerChange?.(a?.value ?? ''); } : NOOP as any}
              placeholder={placeholder || 'Enter phone number'}
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.FILE:
        return (
          <FileUpload
            {...commonProps}
            questionId="PREVIEW"
            onFileChange={NOOP}
            maxSizeMB={config.maxFileSizeMb ?? 5}
          />
        );

      case QuestionType.VIDEO:
        return (
          <VideoUpload
            {...commonProps}
            questionId="PREVIEW"
            onFileChange={NOOP}
            maxSizeMB={config.maxFileSizeMb ?? 100}
            maxDurationSec={config.maxVideoDurationSec ?? 120}
          />
        );

      case QuestionType.AUDIO:
        return (
          <AudioUpload
            {...commonProps}
            questionId="PREVIEW"
            onFileChange={NOOP}
            maxSizeMB={config.maxFileSizeMb ?? 50}
            maxDurationSec={config.maxAudioDurationSec ?? 120}
          />
        );

      case QuestionType.TEXT_DISPLAY:
        return (
          <div className="rounded-lg border border-outline-variant bg-surface-container p-4 space-y-2">
            {config.displayHtml && (
              <div
                className="text-sm text-on-surface prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: config.displayHtml }}
              />
            )}
            {config.displayImageUrl && (
              <img
                src={config.displayImageUrl}
                alt="Display element"
                style={{ maxWidth: config.displayImageMaxWidth ?? '100%' }}
                className="rounded"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            {!config.displayHtml && !config.displayImageUrl && (
              <p className="text-xs text-outline italic text-center py-2">
                Text / Graphic Display — add HTML content or an image URL in the editor.
              </p>
            )}
          </div>
        );

      default:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <p className="text-sm text-custom-grey-3 py-4 text-center">
              No preview available for this question type.
            </p>
          </SurveyQuestionWrapper>
        );
    }
  };

  return (
    <SurveyLayoutContext.Provider value={{ layout: previewLayout, setLayout: NOOP }}>
      {renderQuestion()}
    </SurveyLayoutContext.Provider>
  );
};
