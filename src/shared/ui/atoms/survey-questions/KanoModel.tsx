// src/shared/ui/atoms/survey-questions/KanoModel.tsx
import type { KanoModelAnswer, KanoModelProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

// Fixed 5-point Kano response scale — matches KanoModelCanvasEditor.tsx's SCALE_POINTS order
const SCALE_POINTS = [
  { value: 1, label: 'I like it that way' },
  { value: 2, label: 'I expect it that way' },
  { value: 3, label: 'I am neutral' },
  { value: 4, label: 'I can live with it that way' },
  { value: 5, label: 'I dislike it that way' },
];

function applyTemplate(template: string | undefined, feature: string, productName?: string): string {
  if (!template) return feature;
  return template
    .replace(/\[Feature\]/gi, feature)
    .replace(/\[Product\]/gi, productName || 'the product');
}

export const KanoModel: React.FC<KanoModelProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  productName,
  introText,
  functionalTemplate,
  dysfunctionalTemplate,
  features,
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

  const handleChange = (featureKey: string, field: 'functional' | 'dysfunctional', value: number) => {
    const updated: KanoModelAnswer = {
      responses: {
        ...responses,
        [featureKey]: {
          ...(responses[featureKey] ?? { functional: 0, dysfunctional: 0 }),
          [field]: value,
        },
      },
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
      <div className="space-y-8">
        {introText && <p className="text-sm text-text-dark">{introText}</p>}
        {features.map((feature, index) => {
          const featureKey = `feature_${index}`;
          const pair = responses[featureKey];
          return (
            <div key={featureKey} className="space-y-4 border-b border-custom-grey-2 pb-6 last:border-none">
              <p className="font-medium text-on-surface">{feature}</p>

              <div>
                <p className="text-sm text-text-dark mb-2">
                  {applyTemplate(functionalTemplate, feature, productName) ||
                    `If this feature was present, how would you feel?`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SCALE_POINTS.map((point) => (
                    <button
                      key={`func-${point.value}`}
                      type="button"
                      onClick={() => handleChange(featureKey, 'functional', point.value)}
                      className={`px-3 py-1.5 rounded border text-xs md:text-sm transition-colors ${
                        pair?.functional === point.value
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                      }`}
                    >
                      {point.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-text-dark mb-2">
                  {applyTemplate(dysfunctionalTemplate, feature, productName) ||
                    `If this feature was NOT present, how would you feel?`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SCALE_POINTS.map((point) => (
                    <button
                      key={`dysfunc-${point.value}`}
                      type="button"
                      onClick={() => handleChange(featureKey, 'dysfunctional', point.value)}
                      className={`px-3 py-1.5 rounded border text-xs md:text-sm transition-colors ${
                        pair?.dysfunctional === point.value
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container text-on-surface border-custom-grey-2 hover:border-primary'
                      }`}
                    >
                      {point.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
