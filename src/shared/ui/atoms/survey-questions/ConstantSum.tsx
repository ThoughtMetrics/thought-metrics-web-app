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
  onSaveDraft,
  error,
  totalPoints,
  options,
  allocatedPoints,
  onAllocationChange,
  allowZero = true,
  requireTotal = true,
  isNextDisabled,
  isLastQuestion,
}) => {
  const [localAllocation, setLocalAllocation] = useState<Record<string, number>>(
    allocatedPoints || {}
  );

  useEffect(() => {
    setLocalAllocation(allocatedPoints);
  }, [allocatedPoints]);

  const currentTotal = Object.values(localAllocation).reduce(
    (sum, val) => sum + (val || 0),
    0
  );
  const remaining = totalPoints - currentTotal;

  const handleChange = (optionId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newAllocation = {
      ...localAllocation,
      [optionId]: numValue,
    };
    setLocalAllocation(newAllocation);
    onAllocationChange(newAllocation);
  };

  const isValid = () => {
    if (requireTotal && currentTotal !== totalPoints) return false;
    if (!allowZero && Object.values(localAllocation).some((v) => v === 0))
      return false;
    return currentTotal <= totalPoints;
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
        {/* Instruction */}
        <p className="text-md text-custom-grey-3">
          Distribute {totalPoints} points across the options below
        </p>

        {/* Point Distribution */}
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-4 p-4 border-2 border-custom-grey-2 rounded-lg bg-custom-grey-5"
            >
              <label className="flex-1 text-base md:text-lg text-black">
                {option.label}
              </label>
              <input
                type="number"
                min="0"
                max={totalPoints}
                value={localAllocation[option.id] || 0}
                onChange={(e) => handleChange(option.id, e.target.value)}
                className="w-24 px-3 py-2 border-2 border-custom-grey-2 rounded focus:border-primary outline-none bg-white text-center"
              />
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
                    : 'text-custom-grey-3'
              }`}
            >
              {currentTotal} / {totalPoints}
            </span>
          </div>
          {requireTotal && remaining !== 0 && (
            <p className="text-sm text-custom-grey-3 mt-2">
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
