// src/shared/ui/atoms/survey-questions/SurveyQuestionWrapper.tsx
import type React from 'react';
import { useLanguage } from '@/core/hooks/use-language';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';

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
  error?: string;
  isNextDisabled?: boolean;
  isLastQuestion?: boolean;
  isOptional?: boolean; // Indicates if the question is optional
  hasAnswer?: boolean; // Indicates if user has provided an answer
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
  error,
  isNextDisabled = false,
  isLastQuestion = false,
  isOptional = false,
  hasAnswer = false,
}) => {
  const { translations } = useLanguage();

  return (
    <div className="common-component flex-col bg-white text-black h-full">
      {/* Survey Label Header */}
      {surveyLabel && (
        <div className="border-b border-custom-grey-2 px-4 py-3 md:px-12 md:pb-4 md:pt-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-base md:text-lg font-semibold text-black truncate">
              {surveyId}: {surveyLabel}
            </h1>
            <LanguageToggle variant="compact" />
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
                <span className="ml-2 text-custom-grey-3">
                  ({translations.surveyDetail.optional})
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
              <p className="mt-0.5 text-xs text-custom-grey-3 text-right">
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
      <div className="border-t border-custom-grey-2 bg-white">
        {/* Progress Indicator */}
        <div className="px-4 py-2 md:px-12 md:py-2 border-b border-custom-grey-2">
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
          <div className="text-center text-xs text-custom-grey-3">
            {Math.round(progress * 100)}% {translations.surveyDetail.complete}
          </div>
        </div>
      </div>
    </div>
  );
};
