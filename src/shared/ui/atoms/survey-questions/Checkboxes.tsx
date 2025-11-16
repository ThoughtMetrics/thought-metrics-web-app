// src/shared/ui/atoms/survey-questions/Checkboxes.tsx
import type { CheckboxProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const Checkboxes: React.FC<CheckboxProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  options,
  selectedValues,
  onValueChange,
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
  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      onValueChange([...selectedValues, value]);
    } else {
      onValueChange(selectedValues.filter((v) => v !== value));
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
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center space-x-2 p-2.5 border border-custom-grey-2 rounded cursor-pointer hover:border-primary transition-colors bg-custom-grey-5"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={(e) =>
                handleCheckboxChange(option.value, e.target.checked)
              }
              className="h-4 w-4 text-primary focus:ring-primary border-custom-grey-2 rounded"
            />
            <span className="text-sm md:text-base text-black">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </SurveyQuestionWrapper>
  );
};
