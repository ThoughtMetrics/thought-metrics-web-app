// src/shared/screens/survey-boards/SurveyDetailComponent.tsx
import { queryClient } from '@/core/lib/query-client';
import { useSurveyDetailsQuery } from '@/core/hooks/queries/survey/use-survey-details.query';
import { useSubmitSurveyMutation } from '@/core/hooks/mutations/survey/use-submit-survey.mutation';
import { useSaveDraftMutation } from '@/core/hooks/mutations/survey/use-save-draft.mutation';
import { QuestionType } from '@/core/types/survey.type';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { SurveySuccessMessage } from '@/shared/components/survey/SurveySuccessMessage';
import {
  Checkboxes,
  ConstantSum,
  DoubleSlider,
  LickertScale,
  MatrixGrid,
  MaxDiff,
  MultipleSlider,
  RadioButtons,
  Ranking,
  SingleSlider,
  StarRating,
  SurveyQuestionWrapper,
} from '@/shared/ui/atoms/survey-questions';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

interface SurveyDetailSectionProps {
  surveyId: string;
}

const SurveyDetailSection: React.FC<SurveyDetailSectionProps> = ({
  surveyId,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  const { data: surveyData, isLoading } = useSurveyDetailsQuery(surveyId);
  const submitMutation = useSubmitSurveyMutation();

  // Load draft on mount if exists - MUST be before any early returns
  React.useEffect(() => {
    if (surveyData?.data && !isDraftLoaded) {
      const totalQuestions = surveyData.data.template.questions.length;

      // Try to load draft from localStorage
      const draftKey = `survey_draft_${surveyId}`;
      const savedDraft = localStorage.getItem(draftKey);

      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          setAnswers(draftData.answers);

          // Find last answered question
          const lastAnsweredIndex = Object.keys(draftData.answers)
            .map(Number)
            .sort((a, b) => b - a)[0];

          if (lastAnsweredIndex !== undefined && lastAnsweredIndex >= 0) {
            // Resume from next unanswered question
            const nextQuestion = lastAnsweredIndex + 1;
            setCurrentQuestion(
              nextQuestion < totalQuestions ? nextQuestion : lastAnsweredIndex
            );
          }
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }

      setIsDraftLoaded(true);
    }
  }, [surveyData, isDraftLoaded, surveyId]);

  // Validate if current question has a valid answer
  const isCurrentQuestionValid = React.useCallback((): boolean => {
    const currentQuestionData =
      surveyData?.data?.template?.questions[currentQuestion];
    if (!currentQuestionData) return false;

    const answer = answers[currentQuestion];
    if (!answer) return false;

    // Check based on question type
    switch (currentQuestionData.questionType) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.EMAIL:
      case QuestionType.PHONE:
      case QuestionType.DATE:
      case QuestionType.FILE:
        return !!answer.value && answer.value.trim() !== '';

      case QuestionType.NUMBER:
        return (
          answer.value !== undefined &&
          answer.value !== null &&
          !isNaN(answer.value)
        );

      case QuestionType.LIKERT_SCALE:
      case QuestionType.RATING:
      case QuestionType.SCALE:
        return answer.value !== undefined && answer.value !== null;

      case QuestionType.MCQ_SINGLE:
        return !!answer.value;

      case QuestionType.MCQ_MULTIPLE:
        return answer.values && answer.values.length > 0;

      case QuestionType.DOUBLE_SLIDER:
        return answer.range && answer.range.length === 2;

      case QuestionType.MULTI_SLIDER:
        return answer.values && Object.keys(answer.values).length > 0;

      case QuestionType.MATRIX:
        return answer.values && Object.keys(answer.values).length > 0;

      case QuestionType.RANKING:
        return answer.rankedItems && answer.rankedItems.length > 0;

      case QuestionType.MAX_DIFF:
        return (answer.mostImportant && answer.leastImportant) || answer;

      case QuestionType.CONSTANT_SUM:
        return (
          answer.allocatedPoints &&
          Object.keys(answer.allocatedPoints).length > 0
        );

      default:
        return false;
    }
  }, [surveyData, currentQuestion, answers]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-lg text-custom-grey-3">Loading survey...</div>
      </div>
    );
  }

  if (!surveyData?.data) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-lg text-custom-grey-3">Survey not found</div>
      </div>
    );
  }

  const { template } = surveyData.data;
  const questions = template.questions;
  const totalQuestions = questions.length;
  const currentQuestionData = questions[currentQuestion];

  const handleNext = () => {
    // Validate before moving to next question
    if (!isCurrentQuestionValid()) {
      return;
    }

    // Auto-save draft before moving to next question
    handleSaveDraft();

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit survey
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleAnswerChange = (answer: any) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer,
    });
  };

  const handleSaveDraft = () => {
    // Save draft to localStorage (silent save, no toast notification)
    const draftKey = `survey_draft_${surveyId}`;
    const draftData = {
      answers,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(draftKey, JSON.stringify(draftData));
  };

  const handleSubmit = () => {
    const submission = {
      answers: questions.map((q, index) => {
        const answerData = answers[index];
        let answer = null;

        // Extract answer based on question type
        if (answerData) {
          switch (q.questionType) {
            case QuestionType.MCQ_MULTIPLE:
              answer = answerData.values || [];
              break;
            case QuestionType.DOUBLE_SLIDER:
              answer = answerData.range || null;
              break;
            case QuestionType.MULTI_SLIDER:
            case QuestionType.MATRIX:
              answer = answerData.values || null;
              break;
            case QuestionType.RANKING:
              answer = answerData.rankedItems || [];
              break;
            case QuestionType.MAX_DIFF:
              answer = {
                mostImportant: answerData.mostImportant,
                leastImportant: answerData.leastImportant,
              };
              break;
            case QuestionType.CONSTANT_SUM:
              answer = answerData.allocatedPoints || null;
              break;
            default:
              // For single value questions (TEXT, NUMBER, RATING, etc.)
              answer =
                answerData.value !== undefined ? answerData.value : answerData;
              break;
          }
        }

        return {
          questionId: q.id,
          questionType: q.questionType,
          answer,
          comment: answerData?.comment || '',
        };
      }),
    };

    submitMutation.mutate(
      { surveyId, submission },
      {
        onSuccess: () => {
          // Clear draft from localStorage on successful submission
          const draftKey = `survey_draft_${surveyId}`;
          localStorage.removeItem(draftKey);
          setShowSuccess(true);
        },
      }
    );
  };

  const getProgress = () => {
    // Return actual progress from 0 to 1
    return (currentQuestion + 1) / totalQuestions;
  };

  const renderQuestion = () => {
    const config = currentQuestionData.config || {};
    const isValid = isCurrentQuestionValid();
    const isLastQuestion = currentQuestion === totalQuestions - 1;
    const commonProps = {
      questionNumber: currentQuestion + 1,
      totalQuestions,
      question: currentQuestionData.text,
      surveyLabel: surveyData?.data?.survey?.label || '',
      surveyId: surveyData?.data?.survey?.surveyId || '',
      comment: answers[currentQuestion]?.comment || '',
      onCommentChange: (comment: string) => {
        handleAnswerChange({
          ...answers[currentQuestion],
          comment,
        });
      },
      showComment: currentQuestionData.allowComment === true,
      progress: getProgress(),
      onBack: handleBack,
      onNext: handleNext,
      onSaveDraft: handleSaveDraft,
      isNextDisabled: !isValid,
      isLastQuestion,
      error: undefined,
    };

    switch (currentQuestionData.questionType) {
      case QuestionType.LIKERT_SCALE:
        return (
          <LickertScale
            {...commonProps}
            minValue={config.minValue || 1}
            maxValue={config.maxValue || 10}
            minLabel={config.minLabel || ''}
            maxLabel={config.maxLabel || ''}
            description={config.description}
            selectedValue={answers[currentQuestion]?.value}
            onValueChange={(value) =>
              handleAnswerChange({ ...answers[currentQuestion], value })
            }
          />
        );

      case QuestionType.RATING:
        return (
          <StarRating
            {...commonProps}
            maxStars={config.maxStars || 5}
            selectedStars={answers[currentQuestion]?.stars}
            onRatingChange={(stars) =>
              handleAnswerChange({ ...answers[currentQuestion], stars })
            }
            image={config.image}
            ratingLabel={config.ratingLabel}
          />
        );

      case QuestionType.MCQ_SINGLE:
        return (
          <RadioButtons
            {...commonProps}
            options={config.options || []}
            selectedValue={answers[currentQuestion]?.value}
            onValueChange={(value) =>
              handleAnswerChange({ ...answers[currentQuestion], value })
            }
          />
        );

      case QuestionType.MCQ_MULTIPLE:
        return (
          <Checkboxes
            {...commonProps}
            options={config.options || []}
            selectedValues={answers[currentQuestion]?.values || []}
            onValueChange={(values) =>
              handleAnswerChange({ ...answers[currentQuestion], values })
            }
          />
        );

      case QuestionType.SCALE:
        return (
          <SingleSlider
            {...commonProps}
            minValue={config.minValue || 0}
            maxValue={config.maxValue || 10}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            selectedValue={answers[currentQuestion]?.value}
            onValueChange={(value) =>
              handleAnswerChange({ ...answers[currentQuestion], value })
            }
          />
        );

      case QuestionType.DOUBLE_SLIDER:
        return (
          <DoubleSlider
            {...commonProps}
            minValue={config.minValue || 0}
            maxValue={config.maxValue || 100}
            minLabel={config.minLabel}
            maxLabel={config.maxLabel}
            selectedRange={answers[currentQuestion]?.range}
            onRangeChange={(range) =>
              handleAnswerChange({ ...answers[currentQuestion], range })
            }
          />
        );

      case QuestionType.MULTI_SLIDER:
        return (
          <MultipleSlider
            {...commonProps}
            items={config.items || []}
            minValue={config.minValue || 0}
            maxValue={config.maxValue || 10}
            selectedValues={answers[currentQuestion]?.values || {}}
            onValuesChange={(values) =>
              handleAnswerChange({ ...answers[currentQuestion], values })
            }
          />
        );

      case QuestionType.MATRIX:
        return (
          <MatrixGrid
            {...commonProps}
            rows={config.rows || []}
            selectedValues={answers[currentQuestion]?.values || {}}
            onValuesChange={(values) =>
              handleAnswerChange({ ...answers[currentQuestion], values })
            }
          />
        );

      case QuestionType.RANKING:
        return (
          <Ranking
            {...commonProps}
            items={config.items || []}
            rankedItems={
              answers[currentQuestion]?.rankedItems ||
              (config.items || []).map((item: any) => item.id)
            }
            onRankingChange={(rankedItems) =>
              handleAnswerChange({ ...answers[currentQuestion], rankedItems })
            }
          />
        );

      case QuestionType.MAX_DIFF:
        return (
          <MaxDiff
            {...commonProps}
            items={config.items || []}
            mostImportant={answers[currentQuestion]?.mostImportant}
            leastImportant={answers[currentQuestion]?.leastImportant}
            onSelectionChange={(mostImportant, leastImportant) =>
              handleAnswerChange({
                ...answers[currentQuestion],
                mostImportant,
                leastImportant,
              })
            }
          />
        );

      case QuestionType.CONSTANT_SUM:
        return (
          <ConstantSum
            {...commonProps}
            totalPoints={config.totalPoints || 100}
            options={config.options || []}
            allocatedPoints={answers[currentQuestion]?.allocatedPoints || {}}
            onAllocationChange={(allocatedPoints) =>
              handleAnswerChange({
                ...answers[currentQuestion],
                allocatedPoints,
              })
            }
            allowZero={config.allowZero}
            requireTotal={config.requireTotal}
          />
        );

      case QuestionType.TEXT:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <input
              type="text"
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: e.target.value,
                })
              }
              placeholder={config.placeholder || ''}
              minLength={config.minLength}
              maxLength={config.maxLength}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.helpText && (
              <p className="mt-2 text-sm text-custom-grey-3">
                {config.helpText}
              </p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.TEXTAREA:
        return (
          <SurveyQuestionWrapper
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <textarea
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: e.target.value,
                })
              }
              placeholder={config.placeholder || ''}
              maxLength={config.maxLength}
              rows={6}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors resize-vertical border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.maxLength && (
              <p className="mt-1 text-sm text-custom-grey-3 text-right">
                {(answers[currentQuestion]?.value || '').length}/
                {config.maxLength}
              </p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.NUMBER:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <input
              type="number"
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: parseFloat(e.target.value),
                })
              }
              min={config.min}
              max={config.max}
              step={config.step || 1}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.EMAIL:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <input
              type="email"
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: e.target.value,
                })
              }
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.customMessage && (
              <p className="mt-2 text-sm text-custom-grey-3">
                {config.customMessage}
              </p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.PHONE:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <input
              type="tel"
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: e.target.value,
                })
              }
              placeholder="+1234567890"
              minLength={config.minLength}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.customMessage && (
              <p className="mt-2 text-sm text-custom-grey-3">
                {config.customMessage}
              </p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.DATE:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <input
              type="date"
              value={answers[currentQuestion]?.value || ''}
              onChange={(e) =>
                handleAnswerChange({
                  ...answers[currentQuestion],
                  value: e.target.value,
                })
              }
              min={config.minDate}
              max={config.maxDate}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
          </SurveyQuestionWrapper>
        );

      case QuestionType.FILE:
        return (
          <SurveyQuestionWrapper
            surveyId={commonProps.surveyId}
            surveyLabel={commonProps.surveyLabel}
            questionNumber={commonProps.questionNumber}
            totalQuestions={commonProps.totalQuestions}
            question={commonProps.question}
            comment={commonProps.comment}
            onCommentChange={commonProps.onCommentChange}
            progress={commonProps.progress}
            onBack={commonProps.onBack}
            onNext={commonProps.onNext}
            error={commonProps.error}
            isNextDisabled={commonProps.isNextDisabled}
            isLastQuestion={commonProps.isLastQuestion}
          >
            <div className="space-y-4">
              <input
                type="url"
                value={answers[currentQuestion]?.value || ''}
                onChange={(e) =>
                  handleAnswerChange({
                    ...answers[currentQuestion],
                    value: e.target.value,
                  })
                }
                placeholder="Enter file URL"
                className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
              />
              {config.allowedTypes && (
                <p className="text-sm text-custom-grey-3">
                  Allowed types: {config.allowedTypes.join(', ')}
                </p>
              )}
            </div>
          </SurveyQuestionWrapper>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg text-custom-grey-3">
              Question type not supported: {currentQuestionData.questionType}
            </p>
          </div>
        );
    }
  };

  if (showSuccess) {
    return (
      <SurveySuccessMessage
        onClose={() => (window.location.href = '/survey-boards')}
      />
    );
  }

  return <div className="flex bg-white h-full">{renderQuestion()}</div>;
};

interface SurveyDetailWrapperProps {
  surveyId: string;
}

const SurveyDetailWrapper: React.FC<SurveyDetailWrapperProps> = ({
  surveyId,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SurveyDetailSection surveyId={surveyId} />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyDetailWrapper;
