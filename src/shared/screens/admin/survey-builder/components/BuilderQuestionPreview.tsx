// components/BuilderQuestionPreview.tsx
//
// Pure presentational component: maps IBuilderQuestion → real survey question
// components (the same atoms used by SurveyDetailComponent). Provides a local
// SurveyLayoutContext so the preview layout is controlled by the caller, not
// by any global state.
//
// Coupling: depends only on question data props + shared survey atoms.
// No store dependency — all data flows in via props.

import React from 'react';
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
  /** Optional callback when user interacts with MCQ/Rating answers in interactive preview mode. */
  onAnswerChange?: (value: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Single shared noop — avoids re-creating functions on every render.
// All interaction callbacks are noops: this is a read-only preview.
const NOOP = () => {};

/**
 * Returns options in the shape expected by RadioButtons / Checkboxes /
 * Ranking / MaxDiff / ConstantSum.
 * Priority: lang-specific translated options > config.options.
 */
function resolveOptions(question: IBuilderQuestion, lang: SupportedBuilderLanguage) {
  const configOpts = question.config.options ?? [];
  if (lang === 'en') {
    // config.options is always the authoritative English source in the builder
    return configOpts.map((opt) => ({ id: opt.value, value: opt.value, label: opt.label, attributes: opt.attributes }));
  }
  // For non-English: iterate config.options (authoritative list) and find the translated label.
  // Match by value first (exact), then by index as fallback.
  // If no non-empty translation found, fall back to the English label so options never go blank.
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
  onAnswerChange,
}) => {
  const { config } = question;
  const questionText =
    question.translations[lang].text || question.text || '(no question text)';
  const placeholder = question.translations[lang].placeholder ?? '';

  // ── Common props shared by all question components ──────────────────────
  // surveyLabel is intentionally omitted: the builder panel already shows the
  // template name; we don't want the full survey header bar inside the preview.
  const commonProps = {
    questionNumber,
    totalQuestions,
    question: questionText,
    surveyId: 'PREVIEW',
    comment: '',
    showComment: question.allowComment,
    progress: questionNumber / totalQuestions,
    onBack: NOOP,
    onNext: NOOP,
    isNextDisabled: false,
    isLastQuestion: questionNumber === totalQuestions,
    isOptional: !question.required,
    hasAnswer: false,
  } as const;

  // ── Per-type rendering ───────────────────────────────────────────────────
  const renderQuestion = () => {
    switch (question.questionType) {

      // ── Scale / Rating ─────────────────────────────────────────────────
      case QuestionType.LIKERT_SCALE:
        return (
          <LickertScale
            {...commonProps}
            minValue={config.min ?? 1}
            maxValue={config.max ?? 10}
            minLabel={config.minLabel ?? ''}
            maxLabel={config.maxLabel ?? ''}
            onValueChange={NOOP}
          />
        );

      case QuestionType.RATING:
        return (
          <StarRating
            {...commonProps}
            maxStars={config.ratingMax ?? 5}
            onRatingChange={(r: number) => onAnswerChange?.(String(r))}
          />
        );

      case QuestionType.SCALE:
        return (
          <SingleSlider
            {...commonProps}
            minValue={config.min ?? 1}
            maxValue={config.max ?? 10}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            step={config.step}
            onValueChange={NOOP}
          />
        );

      case QuestionType.DOUBLE_SLIDER:
        return (
          <DoubleSlider
            {...commonProps}
            minValue={config.min ?? 0}
            maxValue={config.max ?? 100}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            step={config.step}
            onRangeChange={NOOP}
          />
        );

      case QuestionType.MULTI_SLIDER: {
        // IBuilderQuestionConfig.sliders is IBuilderQuestionOption[] { value, label }
        // MultipleSlider expects SliderItem[] { id, label, minLabel, maxLabel }
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
            selectedValues={{}}
            onValuesChange={NOOP}
          />
        );
      }

      // ── Choice ─────────────────────────────────────────────────────────
      case QuestionType.MCQ_SINGLE: {
        const mcqOptions = resolveOptions(question, lang).map((opt) => {
          const srcOpt = (question.config.options ?? []).find((o) => o.value === opt.value);
          return { ...opt, isIntensePurchase: srcOpt?.isIntensePurchase };
        });
        return (
          <RadioButtons
            {...commonProps}
            options={mcqOptions}
            onValueChange={onAnswerChange ?? NOOP}
            intensePurchaseLabel={config.intensePurchaseLabel}
            intensePurchaseAnswers={{}}
            onIntensePurchaseChange={NOOP}
          />
        );
      }

      case QuestionType.MCQ_MULTIPLE:
        return (
          <Checkboxes
            {...commonProps}
            options={resolveOptions(question, lang)}
            selectedValues={[]}
            onValueChange={(vals: string[]) => onAnswerChange?.(vals.join(','))}
          />
        );

      case QuestionType.RANKING:
        return (
          <Ranking
            {...commonProps}
            items={resolveOptions(question, lang)}
            rankedItems={resolveOptions(question, lang).map((o) => o.value)}
            onRankingChange={NOOP}
          />
        );

      // ── Matrix / Grid ──────────────────────────────────────────────────
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
            selectedValues={{}}
            onValuesChange={NOOP}
            intensePurchaseLabel={config.intensePurchaseLabel}
            intensePurchaseAnswers={{}}
            onIntensePurchaseChange={NOOP}
          />
        );
      }

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
            selections={{}}
            onSelectionChange={NOOP}
          />
        );
      }

      case QuestionType.CONSTANT_SUM:
        return (
          <ConstantSum
            {...commonProps}
            totalPoints={config.total ?? 100}
            options={resolveOptions(question, lang)}
            allocatedPoints={{}}
            onAllocationChange={NOOP}
            mode={config.constantSumMode ?? 'constant-sum'}
            ratingMax={config.ratingConjointMax ?? 10}
            ratings={{}}
            onRatingChange={NOOP}
            quantities={{}}
            onQuantityChange={NOOP}
            volumeMultiplierKey={config.volumeMultiplierKey}
          />
        );

      // ── Text inputs ────────────────────────────────────────────────────
      case QuestionType.TEXT:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="text"
              readOnly
              placeholder={placeholder || 'Enter your answer...'}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.TEXTAREA:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <textarea
              readOnly
              placeholder={placeholder || 'Enter your answer...'}
              rows={6}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg resize-vertical focus:outline-none"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.NUMBER:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="number"
              readOnly
              placeholder="0"
              min={config.min}
              max={config.max}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.EMAIL:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="email"
              readOnly
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.DATE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="date"
              readOnly
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 border-custom-grey-2 text-base md:text-lg focus:outline-none"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.CURRENCY: {
        const currencySymbol = config.currency ?? '₹';
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <div className="flex items-center border-b-2 bg-custom-grey-5 border-custom-grey-2">
              <span className="pl-4 pr-1 text-base md:text-lg font-medium text-text-dark select-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                readOnly
                placeholder="0"
                min={config.min ?? 0}
                className="w-full pr-4 py-3 bg-transparent text-base md:text-lg focus:outline-none"
              />
            </div>
          </SurveyQuestionWrapper>
        );
      }

      // PhoneInputField is a sub-widget rendered inside the wrapper (not a
      // standalone survey question component), matching SurveyDetailComponent.
      case QuestionType.PHONE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <PhoneInputField
              answer={undefined}
              onChange={NOOP}
              placeholder={placeholder || 'Enter phone number'}
            />
          </SurveyQuestionWrapper>
        );

      // ── File ───────────────────────────────────────────────────────────
      case QuestionType.FILE:
        return (
          <FileUpload
            {...commonProps}
            questionId="PREVIEW"
            onFileChange={NOOP}
            maxSizeMB={config.maxFileSizeMb ?? 5}
          />
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

  // Scope the layout context locally so the preview never mutates global state.
  return (
    <SurveyLayoutContext.Provider value={{ layout: previewLayout, setLayout: NOOP }}>
      {renderQuestion()}
    </SurveyLayoutContext.Provider>
  );
};
