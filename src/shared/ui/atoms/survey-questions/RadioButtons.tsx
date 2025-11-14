// src/shared/ui/atoms/survey-questions/RadioButtons.tsx
import type { RadioButtonProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const RadioButtons: React.FC<RadioButtonProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  options,
  selectedValue,
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
  // Use dropdown for more than 2 options, radio buttons for 2 or fewer
  const useDropdown = options.length > 2;

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
      {useDropdown ? (
        <select
          value={selectedValue || ''}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full px-3 py-2 border border-custom-grey-2 rounded bg-custom-grey-5 focus:bg-white focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center space-x-2 p-2.5 border border-custom-grey-2 rounded cursor-pointer hover:border-primary transition-colors bg-custom-grey-5"
            >
              <input
                type="radio"
                name="radio-option"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => onValueChange(option.value)}
                className="h-4 w-4 text-primary focus:ring-primary border-custom-grey-2"
              />
              <span className="text-sm md:text-base text-black">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </SurveyQuestionWrapper>
  );
};
