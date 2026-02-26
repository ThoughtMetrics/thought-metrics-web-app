// src/shared/ui/atoms/survey-questions/ConstantSum.tsx
import type { ConstantSumProps } from '@/core/types/survey.type';
import type React from 'react';
import { useEffect, useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const ConstantSum: React.FC<ConstantSumProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  comment,
  onCommentChange,
  showComment,
  progress,
  onBack,
  onNext,
  onSaveDraft: _onSaveDraft,
  error,
  totalPoints,
  options,
  allocatedPoints,
  onAllocationChange,
  allowZero: _allowZero = true,
  requireTotal = true,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
}) => {
  // Initialize all options with 0 if not already set
  const getInitialAllocation = (): Record<string, number> => {
    const initial: Record<string, number> = {};
    options.forEach((option) => {
      initial[option.value] = allocatedPoints?.[option.value] ?? 0;
    });
    return initial;
  };

  const [localAllocation, setLocalAllocation] = useState<
    Record<string, number>
  >(getInitialAllocation);

  useEffect(() => {
    // Re-initialize when options change (e.g., language switch)
    const newAllocation: Record<string, number> = {};
    options.forEach((option) => {
      newAllocation[option.value] = allocatedPoints?.[option.value] ?? localAllocation[option.value] ?? 0;
    });
    setLocalAllocation(newAllocation);
  }, [options]);

  const currentTotal = Object.values(localAllocation).reduce(
    (sum, val) => sum + (val || 0),
    0
  );
  const remaining = totalPoints - currentTotal;

  const handleChange = (optionId: string, value: string) => {
    if (optionId && optionId !== '') {
      const numValue = parseInt(value) || 0;
      const newAllocation = {
        ...localAllocation,
        [optionId]: numValue,
      };
      setLocalAllocation(newAllocation);
      onAllocationChange(newAllocation);
    }
  };

  const increaseVal = (optionId: string) => {
    if (optionId && optionId !== '') {
      const val = localAllocation[optionId] ?? 0;
      if (currentTotal < totalPoints) {
        const numValue = val + 1;
        const newAllocation = {
          ...localAllocation,
          [optionId]: numValue,
        };
        setLocalAllocation(newAllocation);
        onAllocationChange(newAllocation);
      }
    }
  };

  const decreaseVal = (optionId: string) => {
    if (optionId && optionId !== '') {
      const val = localAllocation[optionId] ?? 0;
      if (val > 0) {
        const numValue = val - 1;
        const newAllocation = {
          ...localAllocation,
          [optionId]: numValue,
        };
        setLocalAllocation(newAllocation);
        onAllocationChange(newAllocation);
      }
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
      <div className="space-y-6">
        {/* Instruction */}
        <p className="text-md text-text-dark">
          Distribute {totalPoints} points across the options below
        </p>

        {/* Point Distribution */}
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-4 p-2 border border-custom-grey-1 rounded-lg bg-white hover:border-primary group"
            >
              <input
                type="number"
                min="0"
                max={remaining + (localAllocation[option.value] ?? 0)}
                value={localAllocation[option.value] ?? 0}
                onChange={(e) => handleChange(option.value, e.target.value)}
                className="w-16 py-1 border border-custom-grey-1 rounded focus:border-primary outline-none bg-white text-center group-hover:border-primary"
              />
              <label className="flex-1 text-base md:text-lg text-black">
                {option.label}
              </label>
              <button
                className="h-8 w-8 bg-white rounded-lg flex justify-center items-center relative group/button border border-custom-grey-1 focus:border-primary outline-none"
                onClick={() => decreaseVal(option.value)}
              >
                <div className="w-4 h-0.5 bg-custom-grey-1 group-hover/button:bg-primary"></div>
              </button>
              <button
                className="h-8 w-8 bg-white rounded-lg flex justify-center items-center relative group/button border border-custom-grey-1 focus:border-primary outline-none"
                onClick={() => increaseVal(option.value)}
              >
                <div className="w-4 h-0.5 bg-custom-grey-1 group-hover/button:bg-primary"></div>
                <div className="absolute w-0.5 h-4 bg-custom-grey-1 group-hover/button:bg-primary"></div>
              </button>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="bg-custom-grey-1 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-base md:text-lg">
              Total Allocated:
            </span>
            <span
              className={`text-xl md:text-2xl font-bold ${
                currentTotal > totalPoints
                  ? 'text-red-600'
                  : currentTotal === totalPoints
                    ? 'text-green-600'
                    : 'text-text-dark'
              }`}
            >
              {currentTotal} / {totalPoints}
            </span>
          </div>
          {requireTotal && remaining !== 0 && (
            <p className="text-sm text-text-dark mt-2">
              {remaining > 0
                ? `${remaining} points remaining`
                : `${Math.abs(remaining)} points over limit`}
            </p>
          )}
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
