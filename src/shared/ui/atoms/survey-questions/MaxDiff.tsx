// src/shared/ui/atoms/survey-questions/MaxDiff.tsx
import type { MaxDiffProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import { cn } from '@/core/utils/cn';
import { ThumbsUpIcon } from 'lucide-react';
import { BackwardIcon } from '@/assets';

export const MaxDiff: React.FC<MaxDiffProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  items,
  selections,
  onSelectionChange,
  comment,
  onCommentChange,
  showComment,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
}) => {
  const { translations } = useLanguage();

  const handleSelectionChange = (itemId: string, value: 'best' | 'worst') => {
    const currentSelection = selections[itemId];
    // Toggle: if already selected, clear it; otherwise set it
    const newValue = currentSelection === value ? null : value;
    onSelectionChange({
      ...selections,
      [itemId]: newValue,
    });
  };

  return (
    <SurveyQuestionWrapper
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      question={question}
      surveyId={surveyId}
      surveyLabel={surveyLabel}
      comment={comment}
      onCommentChange={onCommentChange}
      showComment={showComment}
      progress={progress}
      onBack={onBack}
      onNext={onNext}
      error={error}
      isNextDisabled={isNextDisabled}
      isLastQuestion={isLastQuestion}
      isOptional={isOptional}
      hasAnswer={hasAnswer}
    >
      <div className="space-y-4 md:space-y-5 lg:space-y-6 w-full relative">
        {/* Desktop: Rotated side labels (hidden on mobile & tablet) */}
        <div className="hidden lg:block -rotate-90 w-max text-center absolute -left-14 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-base xl:text-xl text-primary font-medium p-4">
            {translations.surveyQuestions.selectLeast}
          </div>
          <div className="w-full h-0.5 bg-black" />
        </div>
        <div className="hidden lg:block rotate-90 w-max text-center absolute -right-14 top-1/2 transform translate-x-1/2 -translate-y-1/2">
          <div className="text-base xl:text-xl text-primary font-medium p-4">
            {translations.surveyQuestions.selectMost}
          </div>
          <div className="w-full h-0.5 bg-black" />
        </div>

        {/* Mobile & Tablet: Header row with labels (hidden on desktop) */}
        <div className="flex lg:hidden justify-between items-center px-2 sm:px-4 md:px-8 mb-2">
          <div className="text-xs sm:text-sm text-primary font-medium">
            {translations.surveyQuestions.selectLeast}
          </div>
          <div className="text-xs sm:text-sm text-primary font-medium">
            {translations.surveyQuestions.selectMost}
          </div>
        </div>

        <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
          {items.map((item) => {
            const itemSelection = selections[item.id];
            return (
              <div
                key={item.id}
                className={cn(
                  'flex justify-between gap-2 sm:gap-3 md:gap-4 items-center p-3 sm:p-3.5 md:p-4 rounded bg-white border border-custom-grey-1',
                  'mx-2 sm:mx-4 md:mx-8 lg:mx-40 transition-all duration-300 ease-in-out',
                  itemSelection === 'best' ? 'lg:ml-10 lg:mr-70' : '',
                  itemSelection === 'worst' ? 'lg:ml-70 lg:mr-10' : ''
                )}
              >
                {/* Best Selection Icon */}
                <div
                  className="cursor-pointer shrink-0 p-1 sm:p-1.5 hover:bg-custom-grey-3 rounded-full transition-colors"
                  onClick={() => handleSelectionChange(item.id, 'best')}
                >
                  {itemSelection === 'best' && (
                    <ThumbsUpIcon className="rotate-180 stroke-primary transition-all duration-300 ease-in-out w-5 h-6 sm:w-6 sm:h-7 md:w-7 md:h-8" />
                  )}
                  {itemSelection !== 'best' && (
                    <BackwardIcon className="transition-all duration-300 ease-in-out w-5 h-4 sm:w-6 sm:h-5 md:w-7 md:h-5" />
                  )}
                </div>

                {/* Item Label */}
                <div className="text-center text-sm sm:text-base md:text-base lg:text-lg text-black flex-1 min-w-0 wrap-break-word px-1 sm:px-2">
                  {item.label}
                </div>

                {/* Worst Selection Icon */}
                <div
                  className="cursor-pointer shrink-0 p-1 sm:p-1.5 hover:bg-custom-grey-3 rounded-full transition-colors"
                  onClick={() => handleSelectionChange(item.id, 'worst')}
                >
                  {itemSelection === 'worst' && (
                    <ThumbsUpIcon className="stroke-primary transition-all duration-300 ease-in-out w-5 h-6 sm:w-6 sm:h-7 md:w-7 md:h-8" />
                  )}
                  {itemSelection !== 'worst' && (
                    <BackwardIcon className="rotate-180 transition-all duration-300 ease-in-out w-5 h-4 sm:w-6 sm:h-5 md:w-7 md:h-5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
