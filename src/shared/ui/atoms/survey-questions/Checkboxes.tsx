// src/shared/ui/atoms/survey-questions/Checkboxes.tsx
import type { CheckboxProps } from '@/core/types/survey.type';
import React, { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { ChevronDown } from 'lucide-react';

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
  isOptional,
  hasAnswer,
}) => {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

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
      isOptional={isOptional}
      hasAnswer={hasAnswer}
    >
      <div className="space-y-2">
        {options.map((option) => {
          const hasAttrs = option.attributes && option.attributes.length > 0;
          const isExpanded = expandedOption === option.value;
          return (
            <div
              key={option.id}
              className={`border rounded transition-colors ${
                selectedValues.includes(option.value)
                  ? 'bg-primary/10 border-primary'
                  : 'bg-white border-custom-grey-1'
              }`}
            >
              <div className="flex items-center gap-2 p-2.5">
                <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                    className="h-4 w-4 flex-shrink-0 text-primary focus:ring-primary border-custom-grey-2 rounded"
                  />
                  <span className="text-sm md:text-base text-black">{option.label}</span>
                </label>
                {hasAttrs && (
                  <button
                    type="button"
                    onClick={() => setExpandedOption(isExpanded ? null : option.value)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-primary transition-colors"
                    title="Show details"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
              {isExpanded && hasAttrs && (
                <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                  {option.attributes!.map((attr, i) => (
                    <div key={i} className="px-3 py-1.5 text-sm text-text-dark bg-primary/5">
                      <span className="font-medium">{attr.key}:</span> {attr.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
