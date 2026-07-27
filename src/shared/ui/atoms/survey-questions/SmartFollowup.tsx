// src/shared/ui/atoms/survey-questions/SmartFollowup.tsx
import type { SmartFollowupAnswer, SmartFollowupProps } from '@/core/types/survey.type';
import type React from 'react';
import { useEffect, useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

const FALLBACK_QUESTION = 'Can you tell us more about your answer?';

export const SmartFollowup: React.FC<SmartFollowupProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  sourceAnswer,
  answer,
  onAnswerChange,
  fetchFollowupQuestion,
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
  const [followupQuestion, setFollowupQuestion] = useState<string | undefined>(answer?.generatedFollowupQuestion);
  const [loading, setLoading] = useState(!answer?.generatedFollowupQuestion);

  useEffect(() => {
    if (answer?.generatedFollowupQuestion || !sourceAnswer) return;

    let cancelled = false;
    setLoading(true);
    fetchFollowupQuestion(sourceAnswer)
      .then((generated) => {
        if (cancelled) return;
        setFollowupQuestion(generated);
        onAnswerChange({ sourceAnswer, generatedFollowupQuestion: generated, followupAnswer: '' });
      })
      .catch(() => {
        if (cancelled) return;
        setFollowupQuestion(FALLBACK_QUESTION);
        onAnswerChange({ sourceAnswer, generatedFollowupQuestion: FALLBACK_QUESTION, followupAnswer: '' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceAnswer]);

  const handleFollowupAnswerChange = (value: string) => {
    const updated: SmartFollowupAnswer = {
      sourceAnswer: sourceAnswer ?? '',
      generatedFollowupQuestion: followupQuestion ?? FALLBACK_QUESTION,
      followupAnswer: value,
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
        {sourceAnswer && (
          <blockquote className="text-sm text-text-dark border-l-2 border-custom-grey-2 pl-3 italic">
            &ldquo;{sourceAnswer}&rdquo;
          </blockquote>
        )}

        {loading ? (
          <p className="text-sm text-text-dark">Generating a follow-up question…</p>
        ) : (
          <>
            <p className="font-medium text-on-surface">{followupQuestion}</p>
            <textarea
              value={answer?.followupAnswer ?? ''}
              onChange={(e) => handleFollowupAnswerChange(e.target.value)}
              className="w-full px-3 py-2 border-b-2 bg-surface-container focus:outline-none transition-colors border-custom-grey-1 focus:border-primary text-on-surface resize-none"
              rows={3}
            />
          </>
        )}
      </div>
    </SurveyQuestionWrapper>
  );
};
