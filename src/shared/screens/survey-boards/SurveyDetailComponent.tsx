// src/shared/screens/survey-boards/SurveyDetailComponent.tsx
import { queryClient } from '@/core/lib/query-client';
import { useSurveyDetailsQuery } from '@/core/hooks/queries/survey/use-survey-details.query';
import { useSubmitSurveyMutation } from '@/core/hooks/mutations/survey/use-submit-survey.mutation';
import { QuestionType } from '@/core/types/survey.type';
import { AuthProvider } from '@/shared/providers/auth-provider';
import { UserRouteGuard } from '@/shared/components/guards/UserRouteGuard';
import { SurveySuccessMessage } from '@/shared/components/survey/SurveySuccessMessage';
import { toast } from 'sonner';
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
import { FileUpload } from '@/shared/ui/atoms/survey-questions/FileUpload';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLanguage } from '@/core/hooks/use-language';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import zoneService from '@/services/api/zone.service';

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
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{ label: string; value: string }>>>({});
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>({});
  const prevParentValues = React.useRef<Record<string, string>>({});

  const { data: surveyData, isLoading } = useSurveyDetailsQuery(surveyId);
  const { data: userProfile } = useProfileQuery();
  const submitMutation = useSubmitSurveyMutation();
  const { translations, language } = useLanguage();

  // Map questionId → array index for cascade resolution
  const questionIdToIndex = React.useMemo(() => {
    const map: Record<string, number> = {};
    (surveyData?.data?.template?.questions || []).forEach((q, idx) => {
      map[q.id] = idx;
    });
    return map;
  }, [surveyData]);

  // Get translated survey label based on current language
  const getSurveyLabel = () => {
    const template = surveyData?.data?.template;
    if (!template) return '';

    // Try to get translated label
    const translatedLabel = template.translations?.[language]?.label;
    // Fallback to English translation or legacy label
    return translatedLabel || template.translations?.en?.label || template.label || '';
  };

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

  // Auto-populate questions from user profile (e.g., AC from zonalInfo)
  // Runs after draft is loaded to avoid overwriting saved draft answers
  React.useEffect(() => {
    if (!surveyData?.data || !userProfile || !isDraftLoaded) return;
    const qs = surveyData.data.template.questions;

    qs.forEach((q, idx) => {
      const cfg = q.config || {};
      if (cfg.autoPopulateFrom === 'user.zonalInfo.assemblyConstituency') {
        const zonalList = ((userProfile as any).zonalInfo || []) as any[];
        if (zonalList.length === 1) {
          const ac = zonalList[0];
          const label = ac.translations?.[language]?.assemblyConstituency || ac.assemblyConstituency;
          // Always set dynamic options for display
          setDynamicOptions(prev => ({ ...prev, [q.id]: [{ label, value: String(ac.acNo) }] }));
          // Only auto-set answer if not already answered (e.g. from draft)
          setAnswers(prev => {
            if (prev[idx]?.value) return prev;
            return { ...prev, [idx]: { value: String(ac.acNo), displayLabel: label } };
          });
        } else if (zonalList.length > 1) {
          const opts = zonalList.map((ac: any) => ({
            label: ac.translations?.[language]?.assemblyConstituency || ac.assemblyConstituency,
            value: String(ac.acNo),
          }));
          setDynamicOptions(prev => ({ ...prev, [q.id]: opts }));
        }
      }
    });
  }, [surveyData, userProfile, isDraftLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cascade loading: fetch dependent options when parent answer changes
  React.useEffect(() => {
    if (!surveyData?.data) return;
    const qs = surveyData.data.template.questions;

    qs.forEach((q) => {
      const cfg = q.config || {};
      if (!cfg.dependsOn || !cfg.dataSource) return;

      const parentIdx = questionIdToIndex[cfg.dependsOn];
      const parentValue = parentIdx !== undefined ? answers[parentIdx]?.value : undefined;
      if (!parentValue) return;

      const parentValueStr = String(parentValue);
      // Skip if parent value hasn't changed since last fetch
      if (prevParentValues.current[q.id] === parentValueStr) return;
      prevParentValues.current[q.id] = parentValueStr;

      if (cfg.dataSource === 'zones:local_bodies') {
        const acNo = parseInt(parentValueStr, 10);
        if (isNaN(acNo)) return;
        setLoadingOptions(prev => ({ ...prev, [q.id]: true }));
        zoneService.getLocalBodies(acNo)
          .then(localBodies => {
            const opts = localBodies.map((lb: any) => ({
              label: (lb.translations as any)?.[language] || lb.name,
              value: lb.name,
            }));
            setDynamicOptions(prev => ({ ...prev, [q.id]: opts }));
            setLoadingOptions(prev => ({ ...prev, [q.id]: false }));
          })
          .catch(() => setLoadingOptions(prev => ({ ...prev, [q.id]: false })));
      }

      if (cfg.dataSource === 'zones:villages') {
        const parentChain: string[] = cfg.parentChain || [];
        const grandParentIdx = parentChain.length > 0 ? questionIdToIndex[parentChain[0]] : undefined;
        const grandParentValue = grandParentIdx !== undefined ? answers[grandParentIdx]?.value : undefined;
        if (!grandParentValue) return;
        const acNo = parseInt(String(grandParentValue), 10);
        if (isNaN(acNo)) return;
        setLoadingOptions(prev => ({ ...prev, [q.id]: true }));
        zoneService.getVillages(acNo, parentValueStr)
          .then(villages => {
            const opts = villages.map((v: any) => ({
              label: (v.translations as any)?.[language] || v.name,
              value: v.name,
            }));
            setDynamicOptions(prev => ({ ...prev, [q.id]: opts }));
            setLoadingOptions(prev => ({ ...prev, [q.id]: false }));
          })
          .catch(() => setLoadingOptions(prev => ({ ...prev, [q.id]: false })));
      }
    });
  }, [answers, surveyData, questionIdToIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate if current question has a valid answer
  const isCurrentQuestionValid = React.useCallback((): boolean => {
    const currentQuestionData =
      surveyData?.data?.template?.questions[currentQuestion];
    if (!currentQuestionData) return false;

    const answer = answers[currentQuestion];

    // If question is NOT required and has no answer, it's valid (can skip)
    if (!currentQuestionData.required && !answer) return true;

    // If question is required but no answer provided, invalid
    if (!answer) return false;

    // Check based on question type
    switch (currentQuestionData.questionType) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.EMAIL:
      case QuestionType.PHONE:
      case QuestionType.DATE:
        return !!answer.value && answer.value.trim() !== '';

      case QuestionType.FILE:
        // Check if file object exists with required properties (url from Azure Blob)
        return !!(answer.file?.fileName && answer.file?.url);

      case QuestionType.NUMBER:
      case QuestionType.CURRENCY:
        return (
          answer.value !== undefined &&
          answer.value !== null &&
          !isNaN(answer.value)
        );

      case QuestionType.LIKERT_SCALE:
      case QuestionType.SCALE:
        return answer.value && answer.value > 0;
      case QuestionType.RATING:
        return answer.stars && answer.stars > 0;
      case QuestionType.MCQ_SINGLE:
        return !!answer.value;

      case QuestionType.MCQ_MULTIPLE:
        return answer.values && answer.values.length > 0;

      case QuestionType.DOUBLE_SLIDER:
        return (
          answer.range &&
          Object.values(answer.range).every((val) =>
            typeof val === 'number' ? val > 0 : false
          )
        );

      case QuestionType.MULTI_SLIDER:
        // Check if all sliders have values
        // Use same normalization as render: slider.id ?? slider.value
        const sliders = currentQuestionData.config.sliders || currentQuestionData.config.items || [];
        return answer.values && sliders.length > 0 && sliders.every((slider: any) => {
          const sliderId = slider.id ?? slider.value;
          return answer.values[sliderId] !== undefined && answer.values[sliderId] !== null;
        });

      case QuestionType.MATRIX:
        return (
          answer.values &&
          Object.values(answer.values).every((str) => str !== '')
        );

      case QuestionType.RANKING:
        return answer.rankedItems && answer.rankedItems.length > 0;

      case QuestionType.MAX_DIFF:
        // Get items from config (support multiple formats) or translations
        const maxDiffValidationItems =
          currentQuestionData.config?.items ||
          currentQuestionData.config?.options ||
          currentQuestionData.config?.sets?.[0]?.items ||
          currentQuestionData.translations?.[language]?.items ||
          currentQuestionData.translations?.en?.items ||
          [];

        // If no items configured, invalid
        if (maxDiffValidationItems.length === 0) return false;

        // Check if any selection has been made
        const hasAnySelection =
          answer.selections &&
          Object.values(answer.selections).some(
            (v) => v === 'best' || v === 'worst'
          );

        // If optional and no selections made, can skip
        if (!currentQuestionData.required && !hasAnySelection) return true;

        // Check that ALL items have a selection (either 'best' or 'worst')
        return (
          answer.selections &&
          maxDiffValidationItems.every((item: any) => {
            const itemId = item.id || item.value;
            return (
              answer.selections[itemId] === 'best' ||
              answer.selections[itemId] === 'worst'
            );
          })
        );

      case QuestionType.CONSTANT_SUM:
        const totalPoints =
          surveyData?.data?.template?.questions[currentQuestion].config.total;
        const totalAllocatedPoints =
          answer.allocatedPoints &&
          Object.values(answer.allocatedPoints).reduce(
            (accumulator: any, currentValue: any) => accumulator + currentValue,
            0
          );
        return totalPoints - totalAllocatedPoints === 0;

      default:
        return false;
    }
  }, [surveyData, currentQuestion, answers]);

  if (isLoading) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-lg text-custom-grey-3">{translations.common.loading}</div>
      </div>
    );
  }

  if (!surveyData?.data) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-lg text-custom-grey-3">{translations.errors.notFound}</div>
      </div>
    );
  }

  const { survey, template } = surveyData.data;

  // Check if user has already completed this survey
  if (survey.userResponse?.isCompleted && !survey.userResponse?.canUpdate) {
    return (
      <div className="min-h-full bg-white flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <div className="text-6xl mb-6">✓</div>
          <h2 className="text-2xl font-semibold mb-4 text-custom-text-dark">
            {translations.surveyDetail.alreadyCompleted}
          </h2>
          <p className="text-lg text-custom-grey-3 mb-6">
            {survey.userResponse?.status === 'submitted' &&
              translations.surveyDetail.submittedMessage}
            {survey.userResponse?.status === 'approved' &&
              translations.surveyDetail.approvedMessage}
            {survey.userResponse?.status === 'declined' &&
              translations.surveyDetail.declinedMessage}
          </p>
          <button
            onClick={() => (window.location.href = '/survey-boards')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {translations.surveyDetail.backToSurveys}
          </button>
        </div>
      </div>
    );
  }
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
    const currentQ = questions[currentQuestion];
    const newAnswers: Record<number, any> = {
      ...answers,
      [currentQuestion]: answer,
    };

    // Reset dependent question answers when parent changes
    if (currentQ) {
      questions.forEach((q, idx) => {
        const dependsOnCurrent = q.config?.dependsOn === currentQ.id;
        const isInParentChain = (q.config?.parentChain || []).includes(currentQ.id);
        if (dependsOnCurrent || isInParentChain) {
          newAnswers[idx] = undefined;
          delete prevParentValues.current[q.id];
          setDynamicOptions(prev => ({ ...prev, [q.id]: [] }));
        }
      });
    }

    setAnswers(newAnswers);
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
    // Build submission data - only include answered questions
    const answersArray: Array<{
      questionId: string;
      questionType: QuestionType;
      answer: any;
      comment: string;
    }> = [];

    questions.forEach((q, index) => {
      const answerData = answers[index];

      // Skip unanswered optional questions
      if (!answerData || Object.keys(answerData).length === 0) {
        // Only skip if not required
        if (!q.required) {
          return;
        }
      }

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
            // Send selections as object: { itemId: 'best' | 'worst' | null }
            answer = answerData.selections || {};
            break;
          case QuestionType.CONSTANT_SUM:
            answer = answerData.allocatedPoints || null;
            break;
          case QuestionType.RATING:
            answer = answerData.stars || null;
            break;
          case QuestionType.FILE:
            // Backend expects just the URL string
            answer = answerData.file?.url || null;
            break;
          default:
            // For single value questions (TEXT, NUMBER, etc.)
            answer =
              answerData.value !== undefined ? answerData.value : answerData;
            break;
        }
      }

      answersArray.push({
        questionId: q.id,
        questionType: q.questionType,
        answer,
        comment: answerData?.comment || '',
      });
    });

    const submission = { answers: answersArray };

    submitMutation.mutate(
      { surveyId, submission },
      {
        onSuccess: () => {
          // Clear draft from localStorage on successful submission
          const draftKey = `survey_draft_${surveyId}`;
          localStorage.removeItem(draftKey);
          toast.success(translations.toast.surveySubmittedSuccess);
          setShowSuccess(true);
        },
        onError: (error: any) => {
          toast.error(
            error?.details?.error?.message || translations.toast.surveySubmittedError
          );
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
    // Check if user has provided any answer for this question
    const currentAnswer = answers[currentQuestion];
    const hasAnswer = currentAnswer !== undefined && currentAnswer !== null && Object.keys(currentAnswer).length > 0;
    const commonProps = {
      questionNumber: currentQuestion + 1,
      totalQuestions,
      question: currentQuestionData.text,
      surveyLabel: getSurveyLabel(),
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
      isOptional: !currentQuestionData.required, // Pass optional indicator
      hasAnswer, // Pass whether user has answered
      error: undefined,
    };

    switch (currentQuestionData.questionType) {
      case QuestionType.LIKERT_SCALE:
        return (
          <LickertScale
            {...commonProps}
            minValue={config.min || 1}
            maxValue={config.max || 10}
            minLabel={config.minLabel || (config.labels ? Object.values(config.labels)[0] as string : '')}
            maxLabel={config.maxLabel || (config.labels ? Object.values(config.labels)[1] as string : '')}
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
            ratingLabels={config.labels}
          />
        );

      case QuestionType.MCQ_SINGLE: {
        const hasDynamicSource = !!(config.dataSource || config.autoPopulateFrom);
        const isLoadingDynamic = loadingOptions[currentQuestionData.id] || false;

        // readOnly: if config.readOnly=true AND only 1 dynamic option (single-AC case)
        // For multi-AC case, allow selection even if readOnly is set in config
        const rawDynOpts = dynamicOptions[currentQuestionData.id] || [];
        const isReadOnly = !!config.readOnly && rawDynOpts.length <= 1;

        const rawOptions = hasDynamicSource ? rawDynOpts : (config.options || []);
        const mcqSingleOptions = rawOptions.map((opt: any) => ({
          ...opt,
          id: opt.id ?? opt.value,
          value: opt.value ?? opt.id,
        }));

        if (isLoadingDynamic) {
          return (
            <SurveyQuestionWrapper {...commonProps} isNextDisabled={true}>
              <div className="flex items-center gap-2 py-4 text-gray-500">
                <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Loading options...</span>
              </div>
            </SurveyQuestionWrapper>
          );
        }

        return (
          <RadioButtons
            {...commonProps}
            options={mcqSingleOptions}
            selectedValue={answers[currentQuestion]?.value}
            onValueChange={(value) => {
              if (isReadOnly) return;
              handleAnswerChange({ ...answers[currentQuestion], value });
            }}
          />
        );
      }

      case QuestionType.MCQ_MULTIPLE:
        // Normalize options to have BOTH 'id' and 'value'
        const mcqMultipleOptions = (config.options || []).map((opt: any) => ({
          ...opt,
          id: opt.id ?? opt.value,
          value: opt.value ?? opt.id,
        }));

        return (
          <Checkboxes
            {...commonProps}
            options={mcqMultipleOptions}
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
            minValue={config.min || 1}
            maxValue={config.max || 10}
            minLabel={config.minLabel || (config.labels ? Object.values(config.labels)[0] as string : '')}
            maxLabel={config.maxLabel || (config.labels ? Object.values(config.labels)[1] as string : '')}
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
            minValue={config.min || 1}
            maxValue={config.max || 100}
            minLabel={config.labels ? (Array.isArray(config.labels) ? config.labels[0] : config.labels.min) : ''}
            maxLabel={config.labels ? (Array.isArray(config.labels) ? config.labels[1] : config.labels.max) : ''}
            selectedRange={answers[currentQuestion]?.range}
            onRangeChange={(range) =>
              handleAnswerChange({ ...answers[currentQuestion], range })
            }
          />
        );

      case QuestionType.MULTI_SLIDER:
        // Support both 'items' (old format) and 'sliders' (new format)
        // Preserve all slider properties including individual min/max
        const sliderItems = (config.items || config.sliders || []).map((slider: any) => ({
          ...slider,
          id: slider.id ?? slider.value,
          value: slider.value ?? slider.id,
          minLabel: slider.minLabel || '',
          maxLabel: slider.maxLabel || '',
        }));

        // For global min/max, use first slider's values if available
        const firstSlider = config.sliders?.[0];
        const globalMinValue = config.minValue ?? firstSlider?.min ?? 0;
        const globalMaxValue = config.maxValue ?? firstSlider?.max ?? 100;

        return (
          <MultipleSlider
            {...commonProps}
            items={sliderItems}
            minValue={globalMinValue}
            maxValue={globalMaxValue}
            selectedValues={answers[currentQuestion]?.values || {}}
            onValuesChange={(values) =>
              handleAnswerChange({ ...answers[currentQuestion], values })
            }
          />
        );

      case QuestionType.MATRIX:
        // Normalize rows and columns to have BOTH 'id' and 'value' properties
        const matrixRows = (config.rows || []).map((row: any) => ({
          ...row,
          id: row.id ?? row.value,
          value: row.value ?? row.id,
        }));
        const matrixColumns = (config.columns || []).map((col: any) => ({
          ...col,
          id: col.id ?? col.value,
          value: col.value ?? col.id,
        }));

        return (
          <MatrixGrid
            {...commonProps}
            rows={matrixRows}
            columns={matrixColumns}
            selectedValues={answers[currentQuestion]?.values || {}}
            onValuesChange={(values) =>
              handleAnswerChange({ ...answers[currentQuestion], values })
            }
          />
        );

      case QuestionType.RANKING:
        // Support both 'options' (old) and 'items' (new) formats
        // Normalize to have BOTH 'id' and 'value' properties
        const rankingItems = (config.options || config.items || []).map((item: any) => ({
          ...item,
          id: item.id ?? item.value,
          value: item.value ?? item.id,
        }));

        return (
          <Ranking
            {...commonProps}
            items={rankingItems}
            rankedItems={
              answers[currentQuestion]?.rankedItems ??
              rankingItems.map((item: any) => item.value)
            }
            onRankingChange={(rankedItems) =>
              handleAnswerChange({ ...answers[currentQuestion], rankedItems })
            }
          />
        );

      case QuestionType.MAX_DIFF:
        // Support multiple formats: config.items, config.options, config.sets[0].items, or translations
        // Also normalize to ensure 'id' property exists (backend may use 'value')
        const maxDiffItemsSource =
          config.items ||
          config.options ||
          config.sets?.[0]?.items ||
          currentQuestionData.translations?.[language]?.items ||
          currentQuestionData.translations?.en?.items ||
          [];
        const maxDiffItems = maxDiffItemsSource.map((item: any) => ({
          id: item.id || item.value,
          label: item.label,
        }));
        return (
          <MaxDiff
            {...commonProps}
            items={maxDiffItems}
            selections={answers[currentQuestion]?.selections || {}}
            onSelectionChange={(selections) =>
              handleAnswerChange({
                ...answers[currentQuestion],
                selections,
              })
            }
          />
        );

      case QuestionType.CONSTANT_SUM:
        // Support both 'options' (old) and 'items' (new) formats
        // Normalize to have BOTH 'id' and 'value' properties
        const constantSumOptions = (config.options || config.items || []).map((item: any) => ({
          ...item,
          id: item.id ?? item.value,
          value: item.value ?? item.id,
        }));

        return (
          <ConstantSum
            {...commonProps}
            totalPoints={config.totalPoints ?? config.total ?? 100}
            options={constantSumOptions}
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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

      case QuestionType.CURRENCY: {
        const currencySymbol = config.currency || '₹';
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
          >
            <div className="flex items-center border-b-2 bg-custom-grey-5 focus-within:bg-white focus-within:border-primary border-custom-grey-2 transition-colors">
              <span className="pl-4 pr-1 text-base md:text-lg font-medium text-custom-grey-3 select-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={answers[currentQuestion]?.value ?? ''}
                onChange={(e) =>
                  handleAnswerChange({
                    ...answers[currentQuestion],
                    value: e.target.value === '' ? undefined : parseFloat(e.target.value),
                  })
                }
                min={config.min ?? 0}
                step={config.step || 1}
                placeholder="0"
                className="w-full pr-4 py-3 bg-transparent focus:outline-none text-base md:text-lg"
              />
            </div>
          </SurveyQuestionWrapper>
        );
      }

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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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
            isOptional={commonProps.isOptional}
            hasAnswer={commonProps.hasAnswer}
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
          <FileUpload
            {...commonProps}
            questionId={currentQuestionData.id}
            value={answers[currentQuestion]?.file}
            onFileChange={(file) =>
              handleAnswerChange({
                ...answers[currentQuestion],
                file,
              })
            }
            maxSizeMB={config.maxSizeMB ?? 5}
            allowedTypes={config.allowedTypes ?? ['image/jpeg', 'image/png', 'application/pdf']}
            accept={config.accept}
            subLabel={config.subLabel}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-lg text-text-dark">
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

  return <div className="flex bg-white h-full accent-primary caret-primary scheme-light">{renderQuestion()}</div>;
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
        <UserRouteGuard>
          <SurveyDetailSection surveyId={surveyId} />
        </UserRouteGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default SurveyDetailWrapper;
