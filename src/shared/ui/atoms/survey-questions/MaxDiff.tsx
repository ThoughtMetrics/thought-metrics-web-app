// src/shared/ui/atoms/survey-questions/MaxDiff.tsx
import type { MaxDiffProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const MaxDiff: React.FC<MaxDiffProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  items,
  mostImportant,
  leastImportant,
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
  const handleMostImportantChange = (itemId: string) => {
    // If selecting the same as least important, clear least important
    if (itemId === leastImportant) {
      onSelectionChange(itemId, '');
    } else {
      onSelectionChange(itemId, leastImportant || '');
    }
  };

  const handleLeastImportantChange = (itemId: string) => {
    // If selecting the same as most important, clear most important
    if (itemId === mostImportant) {
      onSelectionChange('', itemId);
    } else {
      onSelectionChange(mostImportant || '', itemId);
    }
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
      <div className="space-y-6">
        {/* Header Row */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
          <div className="text-center text-sm md:text-base font-medium text-primary">
            Most important
          </div>
          <div className="w-px" />
          <div className="text-center text-sm md:text-base font-medium text-primary">
            Least important
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center p-4 border-2 border-custom-grey-2 rounded-lg bg-custom-grey-5"
            >
              {/* Most Important Radio */}
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="most-important"
                  checked={mostImportant === item.id}
                  onChange={() => handleMostImportantChange(item.id)}
                  className="h-5 w-5 text-primary focus:ring-primary border-custom-grey-2"
                />
              </div>

              {/* Item Label */}
              <div className="text-center text-base md:text-lg text-black whitespace-nowrap">
                {item.label}
              </div>

              {/* Least Important Radio */}
              <div className="flex justify-center">
                <input
                  type="radio"
                  name="least-important"
                  checked={leastImportant === item.id}
                  onChange={() => handleLeastImportantChange(item.id)}
                  className="h-5 w-5 text-primary focus:ring-primary border-custom-grey-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
