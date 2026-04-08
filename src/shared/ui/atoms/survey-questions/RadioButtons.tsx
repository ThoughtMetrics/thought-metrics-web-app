// src/shared/ui/atoms/survey-questions/RadioButtons.tsx
import type { RadioButtonProps } from '@/core/types/survey.type';
import React, { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import { ChevronDown } from 'lucide-react';

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
  showIntensePurchase,
  intensePurchaseLabel,
  intensePurchaseAnswers,
  onIntensePurchaseChange,
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
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  // Use dropdown for more than 5 options, radio buttons for 5 or fewer
  const useDropdown = options.length > 5;

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
      {useDropdown ? (
        <select
          value={selectedValue || ''}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full px-3 py-2 border border-custom-grey-1 rounded bg-white focus:bg-white focus:outline-none focus:border-primary transition-colors text-sm md:text-base text-black"
        >
          <option value="">{translations.surveyQuestions.selectOption}</option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="space-y-2">
          {options.map((option) => {
            const hasAttrs = option.attributes && option.attributes.length > 0;
            const isExpanded = expandedOption === option.value;
            const showIP = option.isIntensePurchase && intensePurchaseLabel;
            return (
              <div key={option.id}>
                <div
                  className={`border rounded transition-colors ${
                    selectedValue === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-white border-custom-grey-1'
                  }`}
                >
                  <div className="flex items-center gap-2 p-2.5">
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input
                        type="radio"
                        name={`radio-option-${questionNumber}`}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={() => onValueChange(option.value)}
                        className="h-4 w-4 flex-shrink-0 text-primary focus:ring-primary border-custom-grey-2"
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
                {showIP && (
                  <div className="ml-6 mt-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`ip_${option.value}`}
                      checked={intensePurchaseAnswers?.[option.value] ?? false}
                      onChange={(e) =>
                        onIntensePurchaseChange?.({
                          ...intensePurchaseAnswers,
                          [option.value]: e.target.checked,
                        })
                      }
                      className="w-3.5 h-3.5 accent-primary"
                    />
                    <label htmlFor={`ip_${option.value}`} className="text-xs text-gray-500">
                      {intensePurchaseLabel} <span className="text-gray-400">(optional)</span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </SurveyQuestionWrapper>
  );
};
