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
  showIntensePurchase,
  intensePurchaseLabel,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
  othersPlaceholder,
  onOthersTextChange,
}) => {
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [othersInputText, setOthersInputText] = useState('');

  const handleCheckboxChange = (value: string, isChecked: boolean) => {
    if (isChecked) {
      onValueChange([...selectedValues, value]);
    } else {
      onValueChange(selectedValues.filter((v) => v !== value));
      if (value === 'others') {
        // Local-only reset. Do NOT also call onOthersTextChange here — that
        // triggers a second, independent setAnswers update in the parent,
        // computed from the same pre-update `answers` snapshot this render
        // captured, which clobbers the values change onValueChange just
        // made instead of building on it. The parent's onValueChange
        // handler already clears othersText itself as part of that single
        // update whenever 'others' isn't in the selected values.
        setOthersInputText('');
      }
    }
  };

  const handleOthersTextChange = (text: string) => {
    setOthersInputText(text);
    onOthersTextChange?.(text);
  };

  const othersSelected = selectedValues.includes('others');

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
      showIntensePurchase={showIntensePurchase}
      intensePurchaseLabel={intensePurchaseLabel}
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
          const isOthersChecked = option.value === 'others' && othersSelected;
          return (
            <div key={option.id}>
              <div
                className={`border rounded transition-colors ${
                  selectedValues.includes(option.value)
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface-container border-custom-grey-1'
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
                    <span className="text-sm md:text-base text-on-surface">{option.label}</span>
                  </label>
                  {hasAttrs && (
                    <button
                      type="button"
                      onClick={() => setExpandedOption(isExpanded ? null : option.value)}
                      className="flex-shrink-0 p-1 text-outline hover:text-primary transition-colors"
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
                {/* Others free-text input — shown inline when "others" is checked */}
                {isOthersChecked && (
                  <div className="px-3 pb-3 pt-2">
                    <input
                      type="text"
                      value={othersInputText}
                      onChange={(e) => handleOthersTextChange(e.target.value)}
                      placeholder={othersPlaceholder || 'Please specify...'}
                      className="w-full text-sm px-3 py-2 border border-primary/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container transition-colors"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
