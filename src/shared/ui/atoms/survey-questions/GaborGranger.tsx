// src/shared/ui/atoms/survey-questions/GaborGranger.tsx
import type { GaborGrangerAnswer, GaborGrangerProps } from '@/core/types/survey.type';
import type React from 'react';
import { useMemo } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const GaborGranger: React.FC<GaborGrangerProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  productDescription,
  currency = '₹',
  prices,
  presentationMode,
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
  const responses = answer?.responses ?? {};
  const numericPrices = useMemo(
    () => prices.map((p) => ({ ...p, numeric: Number(p.label) })),
    [prices]
  );

  // Sequential mode: only show up to (and including) the first "no" response.
  const firstNoIndex = numericPrices.findIndex((p) => responses[p.value] === 'no');
  const visiblePrices =
    presentationMode === 'sequential' && firstNoIndex !== -1
      ? numericPrices.slice(0, firstNoIndex + 1)
      : numericPrices;

  const recordResponse = (priceValue: string, value: 'yes' | 'no') => {
    const updatedResponses = { ...responses, [priceValue]: value };
    const yesPrices = numericPrices.filter((p) => updatedResponses[p.value] === 'yes').map((p) => p.numeric);
    const noPrices = numericPrices.filter((p) => updatedResponses[p.value] === 'no').map((p) => p.numeric);

    const updated: GaborGrangerAnswer = {
      mode: presentationMode,
      responses: updatedResponses,
      lastYesPrice: yesPrices.length ? Math.max(...yesPrices) : undefined,
      firstNoPrice: noPrices.length ? Math.min(...noPrices) : undefined,
    };
    onAnswerChange(updated);
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
      <div className="space-y-4">
        {productDescription && <p className="text-sm text-text-dark">{productDescription}</p>}

        {presentationMode === 'sequential' ? (
          <div className="space-y-3">
            {visiblePrices.map((price, idx) => {
              const isAnswered = responses[price.value] !== undefined;
              const isCurrent = idx === visiblePrices.length - 1 && !isAnswered;
              if (!isCurrent && !isAnswered) return null; // don't reveal future prices
              return (
                <div
                  key={price.value}
                  className={`p-4 rounded border ${
                    isCurrent ? 'border-primary' : 'border-custom-grey-2'
                  } flex items-center justify-between gap-4`}
                >
                  <span className="text-on-surface">
                    Would you buy this at {currency}
                    {price.numeric}?
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => recordResponse(price.value, 'yes')}
                      className={`px-4 py-1.5 rounded border text-sm font-medium transition-colors ${
                        responses[price.value] === 'yes'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => recordResponse(price.value, 'no')}
                      className={`px-4 py-1.5 rounded border text-sm font-medium transition-colors ${
                        responses[price.value] === 'no'
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {numericPrices.map((price) => (
              <div
                key={price.value}
                className="p-4 rounded border border-custom-grey-2 flex items-center justify-between gap-4"
              >
                <span className="text-on-surface">
                  {currency}
                  {price.numeric}
                </span>
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => recordResponse(price.value, 'yes')}
                    className={`px-4 py-1.5 rounded border text-sm font-medium transition-colors ${
                      responses[price.value] === 'yes'
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => recordResponse(price.value, 'no')}
                    className={`px-4 py-1.5 rounded border text-sm font-medium transition-colors ${
                      responses[price.value] === 'no'
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SurveyQuestionWrapper>
  );
};
