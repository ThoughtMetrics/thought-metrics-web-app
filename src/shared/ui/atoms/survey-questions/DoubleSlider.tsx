// src/shared/ui/atoms/survey-questions/DoubleSlider.tsx
import type { DoubleSliderProps } from '@/core/types/survey.type';
import type React from 'react';
import { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const DoubleSlider: React.FC<DoubleSliderProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  selectedRange = [minValue, maxValue],
  onRangeChange,
  step = 1,
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
  const [localRange, setLocalRange] = useState<[number, number]>(selectedRange);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localRange[1]);
    const newRange: [number, number] = [newMin, localRange[1]];
    setLocalRange(newRange);
    onRangeChange(newRange);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localRange[0]);
    const newRange: [number, number] = [localRange[0], newMax];
    setLocalRange(newRange);
    onRangeChange(newRange);
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
        {/* Labels */}
        {(minLabel || maxLabel) && (
          <div className="flex justify-between text-sm md:text-base text-black mb-2">
            <span>{minLabel || `Rs. ${minValue}`}</span>
            <span>{maxLabel || `Rs. ${maxValue}`}</span>
          </div>
        )}

        {/* Double Slider */}
        <div className="relative h-16">
          {/* Background Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-custom-grey-5 rounded-lg" />

          {/* Active Range */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-primary rounded-lg"
            style={{
              left: `${((localRange[0] - minValue) / (maxValue - minValue)) * 100}%`,
              right: `${100 - ((localRange[1] - minValue) / (maxValue - minValue)) * 100}%`,
            }}
          />

          {/* Min Slider */}
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={localRange[0]}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-primary
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:pointer-events-auto
                       [&::-moz-range-thumb]:w-6
                       [&::-moz-range-thumb]:h-6
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-primary
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:pointer-events-auto"
          />

          {/* Max Slider */}
          <input
            type="range"
            min={minValue}
            max={maxValue}
            step={step}
            value={localRange[1]}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-6
                       [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-primary
                       [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:pointer-events-auto
                       [&::-moz-range-thumb]:w-6
                       [&::-moz-range-thumb]:h-6
                       [&::-moz-range-thumb]:rounded-full
                       [&::-moz-range-thumb]:bg-primary
                       [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:cursor-pointer
                       [&::-moz-range-thumb]:pointer-events-auto"
          />
        </div>

        {/* Selected Range Display */}
        <div className="text-center">
          <span className="text-lg md:text-xl font-medium text-black">
            Rs. {localRange[0]} - Rs. {localRange[1]}
          </span>
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
