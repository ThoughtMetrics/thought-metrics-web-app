// src/shared/ui/atoms/survey-questions/ConstantSum.tsx
import type { ConstantSumProps } from '@/core/types/survey.type';
import React, { useEffect, useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { ChevronDown } from 'lucide-react';

export const ConstantSum: React.FC<ConstantSumProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  comment,
  onCommentChange,
  showComment,
  showIntensePurchase,
  intensePurchaseLabel,
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
  mode = 'constant-sum',
  ratingMax = 10,
  ratings,
  onRatingChange,
  quantities,
  onQuantityChange,
  volumeMultiplierKey,
}) => {
  // ── constant-sum state ───────────────────────────────────────────────────
  const [localAllocation, setLocalAllocation] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((option) => {
      initial[option.value] = allocatedPoints?.[option.value] ?? 0;
    });
    return initial;
  });

  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  // ── rating-conjoint state ────────────────────────────────────────────────
  const [localRatings, setLocalRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((option) => {
      initial[option.value] = ratings?.[option.value] ?? 0;
    });
    return initial;
  });

  // ── volume-conjoint state ────────────────────────────────────────────────
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    options.forEach((option) => {
      initial[option.value] = quantities?.[option.value] ?? 0;
    });
    return initial;
  });

  useEffect(() => {
    if (mode === 'constant-sum') {
      const newAllocation: Record<string, number> = {};
      options.forEach((option) => {
        newAllocation[option.value] = allocatedPoints?.[option.value] ?? localAllocation[option.value] ?? 0;
      });
      setLocalAllocation(newAllocation);
    } else if (mode === 'rating-conjoint') {
      const newRatings: Record<string, number> = {};
      options.forEach((option) => {
        newRatings[option.value] = ratings?.[option.value] ?? localRatings[option.value] ?? 0;
      });
      setLocalRatings(newRatings);
    } else if (mode === 'volume-conjoint') {
      const newQty: Record<string, number> = {};
      options.forEach((option) => {
        newQty[option.value] = quantities?.[option.value] ?? localQuantities[option.value] ?? 0;
      });
      setLocalQuantities(newQty);
    }
  }, [options]);

  // ── constant-sum handlers ────────────────────────────────────────────────
  const currentTotal = Object.values(localAllocation).reduce((sum, val) => sum + (val || 0), 0);
  const remaining = totalPoints - currentTotal;

  const handleChange = (optionId: string, value: string) => {
    if (optionId && optionId !== '') {
      const numValue = parseInt(value) || 0;
      const newAllocation = { ...localAllocation, [optionId]: numValue };
      setLocalAllocation(newAllocation);
      onAllocationChange(newAllocation);
    }
  };

  const increaseVal = (optionId: string) => {
    if (optionId && optionId !== '') {
      const val = localAllocation[optionId] ?? 0;
      if (currentTotal < totalPoints) {
        const newAllocation = { ...localAllocation, [optionId]: val + 1 };
        setLocalAllocation(newAllocation);
        onAllocationChange(newAllocation);
      }
    }
  };

  const decreaseVal = (optionId: string) => {
    if (optionId && optionId !== '') {
      const val = localAllocation[optionId] ?? 0;
      if (val > 0) {
        const newAllocation = { ...localAllocation, [optionId]: val - 1 };
        setLocalAllocation(newAllocation);
        onAllocationChange(newAllocation);
      }
    }
  };

  // ── rating-conjoint handlers ─────────────────────────────────────────────
  const handleRatingChange = (optionId: string, value: string) => {
    const maxVal = ratingMax ?? 10;
    let numValue = parseInt(value) || 0;
    if (numValue < 1) numValue = 1;
    if (numValue > maxVal) numValue = maxVal;
    const newRatings = { ...localRatings, [optionId]: numValue };
    setLocalRatings(newRatings);
    onRatingChange?.(newRatings);
  };

  // ── volume-conjoint handlers ─────────────────────────────────────────────
  const increaseQty = (optionId: string) => {
    const val = localQuantities[optionId] ?? 0;
    const newQty = { ...localQuantities, [optionId]: val + 1 };
    setLocalQuantities(newQty);
    onQuantityChange?.(newQty);
  };

  const decreaseQty = (optionId: string) => {
    const val = localQuantities[optionId] ?? 0;
    if (val > 0) {
      const newQty = { ...localQuantities, [optionId]: val - 1 };
      setLocalQuantities(newQty);
      onQuantityChange?.(newQty);
    }
  };

  const grandTotal = options.reduce((sum, option) => {
    const qty = localQuantities[option.value] ?? 0;
    const priceAttr = option.attributes?.find((a) => a.key === volumeMultiplierKey);
    const price = priceAttr ? parseFloat(priceAttr.value) || 0 : 0;
    return sum + qty * price;
  }, 0);

  // ── Render ───────────────────────────────────────────────────────────────
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
      {/* ── constant-sum mode ── */}
      {mode === 'constant-sum' && (
        <div className="space-y-6">
          {/* Header: instruction + remaining */}
          <div className="flex items-center justify-between">
            <p className="text-md text-text-dark">
              Distribute {totalPoints} points across the options below
            </p>
            <span className="text-sm font-medium text-text-dark whitespace-nowrap">
              Points remaining{' '}
              <span className={remaining < 0 ? 'text-red-600' : 'text-primary'}>{remaining}</span>
            </span>
          </div>

          {/* Point Distribution */}
          <div className="space-y-3">
            {options.map((option) => {
              const hasAttrs = option.attributes && option.attributes.length > 0;
              const isExpanded = expandedOption === option.value;
              return (
                <div
                  key={option.value}
                  className="border border-custom-grey-1 rounded-lg bg-white overflow-hidden"
                >
                  {/* Main option row */}
                  <div className="flex items-center gap-4 p-2 hover:border-primary group">
                    <input
                      type="number"
                      min="0"
                      max={remaining + (localAllocation[option.value] ?? 0)}
                      value={localAllocation[option.value] ?? 0}
                      onChange={(e) => handleChange(option.value, e.target.value)}
                      className="w-16 py-1 border border-custom-grey-1 rounded focus:border-primary outline-none bg-white text-center group-hover:border-primary"
                    />
                    <span className="flex-1 text-base md:text-lg text-black">{option.label}</span>
                    {hasAttrs && (
                      <button
                        type="button"
                        onClick={() => setExpandedOption(isExpanded ? null : option.value)}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                        title="Show details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
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

                  {/* Attributes (expanded) */}
                  {isExpanded && hasAttrs && (
                    <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                      {option.attributes!.map((attr, i) => (
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

          {/* Total Display */}
          <div className="bg-custom-grey-1 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-base md:text-lg">Total Allocated:</span>
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
      )}

      {/* ── rating-conjoint mode ── */}
      {mode === 'rating-conjoint' && (
        <div className="space-y-6">
          <p className="text-md text-text-dark">
            Rate each option from 1 to {ratingMax ?? 10}
          </p>

          <div className="space-y-3">
            {options.map((option) => {
              const hasAttrs = option.attributes && option.attributes.length > 0;
              const isExpanded = expandedOption === option.value;
              return (
                <div
                  key={option.value}
                  className="border border-custom-grey-1 rounded-lg bg-white overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-2">
                    <span className="flex-1 text-base text-black">{option.label}</span>
                    {hasAttrs && (
                      <button
                        type="button"
                        onClick={() => setExpandedOption(isExpanded ? null : option.value)}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                        title="Show details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                    <input
                      type="number"
                      min={1}
                      max={ratingMax ?? 10}
                      value={localRatings[option.value] ?? 0}
                      onChange={(e) => handleRatingChange(option.value, e.target.value)}
                      className="w-16 py-1 border border-custom-grey-1 rounded focus:border-primary outline-none bg-white text-center"
                    />
                  </div>

                  {/* Attributes (expanded) */}
                  {isExpanded && hasAttrs && (
                    <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                      {option.attributes!.map((attr, i) => (
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

          {/* Summary */}
          <div className="bg-custom-grey-1 p-4 rounded-lg">
            <p className="text-sm font-medium text-text-dark mb-2">Your ratings</p>
            <div className="space-y-1">
              {options.map((option) => (
                <div key={option.value} className="flex justify-between text-sm text-text-dark">
                  <span>{option.label}</span>
                  <span className="font-medium text-primary">{localRatings[option.value] ?? 0} / {ratingMax ?? 10}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── volume-conjoint mode ── */}
      {mode === 'volume-conjoint' && (
        <div className="space-y-6">
          <p className="text-md text-text-dark">
            Enter the quantity you would purchase for each option
          </p>

          <div className="space-y-3">
            {options.map((option) => {
              const hasAttrs = option.attributes && option.attributes.length > 0;
              const isExpanded = expandedOption === option.value;
              const qty = localQuantities[option.value] ?? 0;
              return (
                <div
                  key={option.value}
                  className="border border-custom-grey-1 rounded-lg bg-white overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-2">
                    <span className="flex-1 text-base text-black">{option.label}</span>
                    {hasAttrs && (
                      <button
                        type="button"
                        onClick={() => setExpandedOption(isExpanded ? null : option.value)}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                        title="Show details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                    <button
                      className="h-8 w-8 bg-white rounded-lg flex justify-center items-center relative group/button border border-custom-grey-1 focus:border-primary outline-none"
                      onClick={() => decreaseQty(option.value)}
                    >
                      <div className="w-4 h-0.5 bg-custom-grey-1 group-hover/button:bg-primary"></div>
                    </button>
                    <span className="w-10 text-center text-base font-medium text-text-dark">{qty}</span>
                    <button
                      className="h-8 w-8 bg-white rounded-lg flex justify-center items-center relative group/button border border-custom-grey-1 focus:border-primary outline-none"
                      onClick={() => increaseQty(option.value)}
                    >
                      <div className="w-4 h-0.5 bg-custom-grey-1 group-hover/button:bg-primary"></div>
                      <div className="absolute w-0.5 h-4 bg-custom-grey-1 group-hover/button:bg-primary"></div>
                    </button>
                  </div>

                  {/* Attributes (expanded) */}
                  {isExpanded && hasAttrs && (
                    <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                      {option.attributes!.map((attr, i) => (
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

          {/* Grand Total footer */}
          <div className="bg-custom-grey-1 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Grand Total:</span>
              <span className="text-xl font-bold text-primary">&#8377;{grandTotal}</span>
            </div>
          </div>
        </div>
      )}
    </SurveyQuestionWrapper>
  );
};
