// src/shared/ui/atoms/survey-questions/MaxDiff.tsx
import type { MaxDiffProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import { cn } from '@/core/utils/cn';

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
    >
      <div className="space-y-6 w-full relative">
        <div className="-rotate-90 w-max text-center absolute -left-14 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-sm md:text-base xl:text-xl text-primary font-medium p-4">
            {translations.surveyQuestions.selectLeast}
          </div>
          <div className="w-full h-0.5 bg-black" />
        </div>
        <div className="rotate-90 w-max text-center absolute -right-14 top-1/2 transform translate-x-1/2 -translate-y-1/2">
          <div className="text-sm md:text-base xl:text-xl text-primary font-medium p-4">
            {translations.surveyQuestions.selectMost}
          </div>
          <div className="w-full h-0.5 bg-black" />
        </div>
        <div className="space-y-3">
          {items.map((item) => {
            const itemSelection = selections[item.id];
            return (
              <div
                key={item.id}
                className={cn(
                  'flex justify-between gap-4 items-center p-4 rounded bg-custom-grey-5 mx-40',
                  itemSelection === 'best' ? 'ml-10 mr-70' : '',
                  itemSelection === 'worst' ? 'ml-70 mr-10' : ''
                )}
              >
                <input
                  type="radio"
                  name={`maxdiff-${item.id}`}
                  checked={itemSelection === 'best'}
                  onChange={() => handleSelectionChange(item.id, 'best')}
                  className="h-5 w-5 text-primary focus:ring-primary border-custom-grey-2"
                />

                <div className="">
                  
                </div>

                {/* Item Label */}
                <div className="text-center text-base md:text-lg text-black whitespace-nowrap">
                  {item.label}
                </div>
                <input
                  type="radio"
                  name={`maxdiff-${item.id}`}
                  checked={itemSelection === 'worst'}
                  onChange={() => handleSelectionChange(item.id, 'worst')}
                  className="h-5 w-5 text-primary focus:ring-primary border-custom-grey-2"
                />
              </div>
            );
          })}
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
