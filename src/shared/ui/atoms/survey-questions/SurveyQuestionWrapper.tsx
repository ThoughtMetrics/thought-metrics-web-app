// src/shared/ui/atoms/survey-questions/SurveyQuestionWrapper.tsx
import React from 'react';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';
import { SurveyLayoutContext } from '@/shared/screens/survey-boards/survey-layout-context';

/** Compact two-button layout switcher rendered in the paginated survey header. */
const LayoutToggle: React.FC = () => {
  const { layout, setLayout } = React.useContext(SurveyLayoutContext);
  return (
    <div className="flex items-center bg-custom-grey-1 rounded-lg p-0.5 gap-0.5">
      <button
        type="button"
        title="One question at a time"
        onClick={() => setLayout('paginated')}
        className={`p-1.5 rounded-md transition-all ${
          layout === 'paginated' ? 'bg-white shadow-sm text-black' : 'text-text-dark hover:text-black'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        title="All questions in a list"
        onClick={() => setLayout('list')}
        className={`p-1.5 rounded-md transition-all ${
          layout === 'list' ? 'bg-white shadow-sm text-black' : 'text-text-dark hover:text-black'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      </button>
    </div>
  );
};

interface SurveyQuestionWrapperProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  surveyId: string;
  surveyLabel?: string;
  children: React.ReactNode;
  comment?: string;
  onCommentChange?: (value: string) => void;
  showComment?: boolean;
  progress: number;
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  error?: string;
  isNextDisabled?: boolean;
  isLastQuestion?: boolean;
  isOptional?: boolean;
  hasAnswer?: boolean;
  /** When true, renders a simplified card without header, nav buttons or progress bar (used in list layout). */
  listMode?: boolean;
}

export const SurveyQuestionWrapper: React.FC<SurveyQuestionWrapperProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  children,
  comment = '',
  onCommentChange,
  showComment = false,
  progress,
  onBack,
  onNext,
  onSaveDraft: _onSaveDraft,
  error,
  isNextDisabled = false,
  isLastQuestion = false,
  isOptional = false,
  hasAnswer = false,
  listMode = false,
}) => {
  const { translations } = useLanguage();
  const { layout } = React.useContext(SurveyLayoutContext);
  const isListMode = listMode || layout === 'list';

  // ── List-mode: simplified card (no header, nav, progress) ──────────────────
  if (isListMode) {
    return (
      <div>
        <p className="text-xs text-primary mb-1 font-medium">
          {translations.surveyDetail.question} {questionNumber}
          {isOptional && (
            <span className="ml-2 font-normal">
              ({translations.surveyDetail.optional})
            </span>
          )}
        </p>
        <h3 className="text-base md:text-lg font-medium text-black mb-4">{question}</h3>
        <div>{children}</div>
        {showComment && (
          <div className="mt-3">
            <label
              htmlFor={`comment-list-${questionNumber}`}
              className="block text-xs md:text-sm text-black mb-1"
            >
              {translations.surveyDetail.comment}
            </label>
            <textarea
              id={`comment-list-${questionNumber}`}
              value={comment}
              onChange={(e) => onCommentChange?.(e.target.value)}
              className="w-full px-2 py-1.5 border border-custom-grey-2 rounded bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors resize-none focus:border-primary text-sm"
              rows={2}
              maxLength={500}
              placeholder={translations.surveyDetail.commentPlaceholder}
            />
          </div>
        )}
        {error && (
          <p className="mt-2 text-xs text-primary font-medium">{error}</p>
        )}
      </div>
    );
  }

  // ── Paginated mode (original) ───────────────────────────────────────────────
  return (
    <div className="common-component flex-col bg-white text-black h-full">
      {/* Survey Label Header */}
      {surveyLabel && (
        <div className="border-b border-custom-grey-2 px-4 py-3 md:px-12 md:pb-4 md:pt-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-base md:text-lg font-semibold text-black truncate">
              {surveyId}: {surveyLabel}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <LayoutToggle />
              <LanguageToggle variant="compact" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 md:px-12 md:py-8 max-w-4xl mx-auto h-full">
          {/* Question Header */}
          <div className="mb-3">
            <p className="text-sm text-text-dark mb-4">
              {translations.surveyDetail.question} {questionNumber}{' '}
              {translations.surveyDetail.of} {totalQuestions}
              {isOptional && (
                <span className="ml-2 text-text-dark">
                  {translations.surveyDetail.optional}
                </span>
              )}
            </p>
            <h2 className="text-base md:text-lg font-medium text-black mb-2">
              {question}
            </h2>
          </div>

          {/* Question Content */}
          <div className="mb-2 h-full">{children}</div>
          {/* <div className="h-full w-full mb-2 bg-primary"/> */}

          {/* Comment Section - Conditional */}
          {showComment && (
            <div className="mb-2 mt-3">
              <label
                htmlFor="comment"
                className="block text-xs md:text-sm text-black mb-1"
              >
                {translations.surveyDetail.comment}
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => onCommentChange?.(e.target.value)}
                className="w-full px-2 py-1.5 border border-custom-grey-2 rounded bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors resize-none focus:border-primary text-sm"
                rows={2}
                maxLength={500}
                placeholder={translations.surveyDetail.commentPlaceholder}
              />
              <p className="mt-0.5 text-xs text-text-dark text-right">
                {comment.length}/500
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-xs text-primary mb-1">{error}</p>}
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="px-4 py-2 md:px-12 md:py-3 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={questionNumber === 1}
          className="px-3 py-1.5 md:px-4 md:py-2 border border-black text-black rounded hover:bg-custom-grey-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
        >
          {translations.common.back}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm ${
            isLastQuestion
              ? 'bg-primary text-white hover:bg-red-700 disabled:bg-custom-grey-3'
              : 'bg-black text-white hover:bg-custom-grey-4 disabled:bg-custom-grey-3'
          }`}
        >
          {isLastQuestion
            ? translations.common.submit
            : isOptional && !hasAnswer
              ? translations.common.skip || 'Skip'
              : translations.common.next}
        </button>
      </div>

      {/* Fixed Bottom Section */}
      <div className="border-t border-primary bg-white" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {/* Progress Indicator */}
        <div className="px-4 pt-2 pb-28 md:pb-2 md:px-12 md:pt-2 border-b border-custom-grey-2">
          <div className="flex justify-center gap-1 mb-1">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const stepProgress = (i + 1) / totalQuestions;
              const isActive = stepProgress <= progress;
              const isCurrent = i + 1 === questionNumber;

              return (
                <div
                  key={i}
                  className={`h-1 md:h-1.5 flex-1 max-w-10 md:max-w-12 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-primary scale-110'
                      : isActive
                        ? 'bg-primary'
                        : 'bg-custom-grey-2'
                  }`}
                  title={`${translations.surveyDetail.question} ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="text-center text-xs text-text-dark">
            {Math.round(progress * 100)}% {translations.surveyDetail.complete}
          </div>
        </div>
      </div>
    </div>
  );
};
