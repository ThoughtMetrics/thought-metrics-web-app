// src/shared/ui/atoms/survey-questions/MaxDiff.tsx
import type { MaxDiffProps } from '@/core/types/survey.type';
import React, { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { ChevronDown } from 'lucide-react';

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
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleSelectionChange = (itemId: string, value: 'best' | 'worst') => {
    const currentSelection = selections[itemId];
    const newValue = currentSelection === value ? null : value;
    onSelectionChange({ ...selections, [itemId]: newValue });
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
        {/* Column header */}
        <div className="flex justify-between items-center px-1 mb-1">
          <span className="text-xs font-medium text-gray-500">← Least important</span>
          <span className="text-xs font-medium text-gray-500">Most important →</span>
        </div>

        {items.map((item) => {
          const itemSelection = selections[item.id];
          const hasAttrs = item.attributes && item.attributes.length > 0;
          const isExpanded = expandedItem === item.id;

          return (
            <div
              key={item.id}
              className={`border rounded transition-colors overflow-hidden ${
                itemSelection === 'best'
                  ? 'bg-primary/10 border-primary'
                  : itemSelection === 'worst'
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-white border-custom-grey-1'
              }`}
            >
              <div className="flex items-center gap-2 p-2.5">
                {/* WORST / Least button */}
                <button
                  type="button"
                  onClick={() => handleSelectionChange(item.id, 'worst')}
                  className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    itemSelection === 'worst'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-gray-300 text-gray-500 hover:border-rose-400 hover:text-rose-500'
                  }`}
                >
                  Least
                </button>

                {/* Item label */}
                <span className="flex-1 text-sm md:text-base text-black text-center px-1 min-w-0 break-words">
                  {item.label}
                </span>

                {/* Attributes expand toggle */}
                {hasAttrs && (
                  <button
                    type="button"
                    onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-primary transition-colors"
                    title="Show details"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}

                {/* BEST / Most button */}
                <button
                  type="button"
                  onClick={() => handleSelectionChange(item.id, 'best')}
                  className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                    itemSelection === 'best'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-500 hover:border-primary hover:text-primary'
                  }`}
                >
                  Most
                </button>
              </div>

              {/* Expanded attributes */}
              {isExpanded && hasAttrs && (
                <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                  {item.attributes!.map((attr, i) => (
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
