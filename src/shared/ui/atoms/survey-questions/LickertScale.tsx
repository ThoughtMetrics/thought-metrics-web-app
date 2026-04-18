// src/shared/ui/atoms/survey-questions/LickertScale.tsx
import type { LickertScaleProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const LickertScale: React.FC<LickertScaleProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  selectedValue,
  onValueChange,
  description,
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
  const values = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i
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
      <div className="space-y-3">
        {/* Description */}
        {description && (
          <p className="text-sm md:text-base text-black">{description}</p>
        )}

        {/* Lickert Scale Grid */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 md:gap-2">
          {values.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => onValueChange(value)}
              className={`aspect-square flex items-center justify-center text-sm md:text-base font-medium border transition-all ${
                selectedValue === value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-black border-custom-grey-1 hover:border-primary'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        {/* Labels */}
        {(minLabel || maxLabel) && (
          <div className="flex justify-between text-sm md:text-base text-black mb-2">
            <span>{`${minValue} = ${minLabel}` || `Min: ${minValue}`}</span>
            <span>{`${maxValue} = ${maxLabel}` || `Max: ${maxValue}`}</span>
          </div>
        )}


      </div>
    </SurveyQuestionWrapper>
  );
};
