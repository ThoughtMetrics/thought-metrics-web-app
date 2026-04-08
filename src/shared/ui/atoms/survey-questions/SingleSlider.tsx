// src/shared/ui/atoms/survey-questions/SingleSlider.tsx
import type { SingleSliderProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const SingleSlider: React.FC<SingleSliderProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  selectedValue = minValue,
  onValueChange,
  step = 1,
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
      <div className="space-y-6">
        {/* Labels */}
        {(minLabel || maxLabel) && (
          <div className="flex justify-between text-sm md:text-base text-black mb-2">
            <span>{`${minValue} = ${minLabel}` || `Min: ${minValue}`}</span>
            <span>{`${maxValue} = ${maxLabel}` || `Max: ${maxValue}`}</span>
          </div>
        )}

        {/* Slider */}
        <div className="relative">
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={selectedValue}
            onChange={(e) => onValueChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-primary
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:w-6
                       [&::-moz-range-thumb]:h-6
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-primary
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #E8505E 0%, #E8505E ${((selectedValue - minValue) / (maxValue - minValue)) * 100}%, #E5E5E5 ${((selectedValue - minValue) / (maxValue - minValue)) * 100}%, #E5E5E5 100%)`,
            }}
          />
        </div>

        {/* Selected Value Display */}
        <div className="text-center">
          <span className="text-lg md:text-xl font-medium text-black">
            {selectedValue}
          </span>
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
