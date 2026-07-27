// src/shared/ui/atoms/survey-questions/VanWestendorp.tsx
import type { VanWestendorpAnswer, VanWestendorpProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

const DEFAULT_PROMPTS = {
  tooCheap: 'At what price would you consider this product to be so cheap that you would question its quality?',
  goodValue: 'At what price would you consider this product to be a bargain — a great buy for the money?',
  expensive: 'At what price would you consider this product starting to get expensive, but still worth considering?',
  tooExpensive: 'At what price would you consider this product to be so expensive that you would not consider buying it?',
};

export const VanWestendorp: React.FC<VanWestendorpProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  productDescription,
  currency = '₹',
  minPrice,
  maxPrice,
  q1Text,
  q2Text,
  q3Text,
  q4Text,
  showNMS,
  nmsGoodValueQuestion,
  nmsExpensiveQuestion,
  answer,
  onAnswerChange,
  comment,
  onCommentChange,
  showComment,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
}) => {
  const updateField = (field: keyof VanWestendorpAnswer, value: number) => {
    const updated: VanWestendorpAnswer = {
      tooCheap: answer?.tooCheap ?? NaN,
      goodValue: answer?.goodValue ?? NaN,
      expensive: answer?.expensive ?? NaN,
      tooExpensive: answer?.tooExpensive ?? NaN,
      nmsGoodValueLikelihood: answer?.nmsGoodValueLikelihood,
      nmsExpensiveLikelihood: answer?.nmsExpensiveLikelihood,
      [field]: value,
    };
    onAnswerChange(updated);
  };

  const priceField = (
    field: 'tooCheap' | 'goodValue' | 'expensive' | 'tooExpensive',
    label: string
  ) => (
    <div>
      <label className="block text-sm text-on-surface mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <span className="text-text-dark">{currency}</span>
        <input
          type="number"
          min={minPrice}
          max={maxPrice}
          value={Number.isNaN(answer?.[field]) ? '' : answer?.[field] ?? ''}
          onChange={(e) => updateField(field, Number(e.target.value))}
          className="w-full px-3 py-2 border-b-2 bg-surface-container focus:outline-none transition-colors border-custom-grey-1 focus:border-primary text-on-surface"
        />
      </div>
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
        {productDescription && <p className="text-sm text-text-dark">{productDescription}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priceField('tooCheap', q1Text || DEFAULT_PROMPTS.tooCheap)}
          {priceField('goodValue', q2Text || DEFAULT_PROMPTS.goodValue)}
          {priceField('expensive', q3Text || DEFAULT_PROMPTS.expensive)}
          {priceField('tooExpensive', q4Text || DEFAULT_PROMPTS.tooExpensive)}
        </div>

        {showNMS && (
          <div className="border-t border-custom-grey-2 pt-4 space-y-4">
            <div>
              <label className="block text-sm text-on-surface mb-1">
                {nmsGoodValueQuestion || 'How likely are you to purchase at the "good value" price?'}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateField('nmsGoodValueLikelihood', v)}
                    className={`w-9 h-9 rounded border text-sm transition-colors ${
                      answer?.nmsGoodValueLikelihood === v
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-on-surface mb-1">
                {nmsExpensiveQuestion || 'How likely are you to purchase at the "expensive" price?'}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updateField('nmsExpensiveLikelihood', v)}
                    className={`w-9 h-9 rounded border text-sm transition-colors ${
                      answer?.nmsExpensiveLikelihood === v
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SurveyQuestionWrapper>
  );
};
