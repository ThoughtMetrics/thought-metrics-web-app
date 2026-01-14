// src/shared/ui/atoms/survey-questions/MultipleSlider.tsx
import type { MultipleSliderProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const MultipleSlider: React.FC<MultipleSliderProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  items,
  minValue,
  maxValue,
  selectedValues,
  onValuesChange,
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
  const handleSliderChange = (itemId: string, value: number) => {
    onValuesChange({
      ...selectedValues,
      [itemId]: value,
    });
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
      <div className="space-y-8">
        {items.map((item) => {
          const itemMinValue = (item as any).min ?? minValue;
          const itemMaxValue = (item as any).max ?? maxValue;
          const currentValue = selectedValues[item.id] ?? itemMinValue;

          return (
            <div key={item.id} className="space-y-3">
              {/* Item Label */}
              <div className="flex justify-between items-center">
                <span className="text-base md:text-lg text-black font-medium">
                  {item.label}
                </span>
                <span className="text-sm md:text-base text-black">
                  {currentValue}
                </span>
              </div>

              {/* Min/Max Labels */}
              <div className="flex justify-between text-xs md:text-sm text-custom-grey-3">
                <span className="text-primary">{item.minLabel || itemMinValue}</span>
                <span className="text-primary">{item.maxLabel || itemMaxValue}</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={itemMinValue}
                max={itemMaxValue}
                value={currentValue}
                onChange={(e) =>
                  handleSliderChange(item.id, Number(e.target.value))
                }
                className="w-full h-2 bg-custom-grey-5 rounded-lg appearance-none cursor-pointer
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
                  background: `linear-gradient(to right, #E63946 0%, #E63946 ${((currentValue - itemMinValue) / (itemMaxValue - itemMinValue) * 100)}%, #E5E5E5 ${((currentValue - itemMinValue) / (itemMaxValue - itemMinValue) * 100)}%, #E5E5E5 100%)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
