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
  othersPlaceholder,
  onOthersTextChange,
}) => {
  const { translations } = useLanguage();
  const [expandedOption, setExpandedOption] = useState<string | null>(null);
  const [othersInputText, setOthersInputText] = useState('');
  // Use dropdown for more than 5 options, radio buttons for 5 or fewer
  const useDropdown = options.length > 5;

  const handleOthersTextChange = (text: string) => {
    setOthersInputText(text);
    onOthersTextChange?.(text);
  };

  const othersInput = (
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
  );

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
        <div className="space-y-2">
          <select
            value={selectedValue || ''}
            onChange={(e) => {
              onValueChange(e.target.value);
              // Local-only reset (matches the radio variant below) — do NOT
              // route this through handleOthersTextChange, which also calls
              // onOthersTextChange and triggers a second, independent
              // setAnswers update in the parent. That second call computes
              // its own next-state from the same pre-update `answers`
              // snapshot this render captured, so it clobbers the value
              // onValueChange just set instead of building on it — the
              // parent's onValueChange handler already clears othersText
              // itself as part of that single update (see
              // handleMcqSingleChange), so nothing here needs to reach it.
              if (e.target.value !== 'others') setOthersInputText('');
            }}
            className="w-full px-3 py-2 border border-custom-grey-1 rounded bg-surface-container focus:bg-surface-container focus:outline-none focus:border-primary transition-colors text-sm md:text-base text-on-surface"
          >
            <option value="" style={{ color: 'var(--on-surface)', backgroundColor: 'var(--surface-container)' }}>
              {translations.surveyQuestions.selectOption}
            </option>
            {options.map((option) => (
              <option
                key={option.id}
                value={option.value}
                style={{ color: 'var(--on-surface)', backgroundColor: 'var(--surface-container)' }}
              >
                {option.label}
              </option>
            ))}
          </select>
          {selectedValue === 'others' && (
            <input
              type="text"
              value={othersInputText}
              onChange={(e) => handleOthersTextChange(e.target.value)}
              placeholder={othersPlaceholder || 'Please specify...'}
              className="w-full text-sm px-3 py-2 border border-primary/40 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container transition-colors"
              autoFocus
            />
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {options.map((option) => {
            const hasAttrs = option.attributes && option.attributes.length > 0;
            const isExpanded = expandedOption === option.value;
            const showIP = option.isIntensePurchase && intensePurchaseLabel;
            const isOthersSelected = option.value === 'others' && selectedValue === 'others';
            return (
              <div key={option.id}>
                <div
                  className={`border rounded transition-colors ${
                    selectedValue === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface-container border-custom-grey-1'
                  }`}
                >
                  <div className="flex items-center gap-2 p-2.5">
                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                      <input
                        type="radio"
                        name={`radio-option-${questionNumber}`}
                        value={option.value}
                        checked={selectedValue === option.value}
                        onChange={() => {
                          onValueChange(option.value);
                          if (option.value !== 'others') setOthersInputText('');
                        }}
                        className="h-4 w-4 flex-shrink-0 text-primary focus:ring-primary border-custom-grey-2"
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
                  {/* Others free-text input — shown inline when "others" is selected */}
                  {isOthersSelected && othersInput}
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
                    <label htmlFor={`ip_${option.value}`} className="text-xs text-outline">
                      {intensePurchaseLabel} <span className="text-outline">(optional)</span>
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
