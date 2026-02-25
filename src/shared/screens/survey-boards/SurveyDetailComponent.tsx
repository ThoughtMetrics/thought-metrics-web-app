// src/shared/screens/survey-boards/SurveyDetailComponent.tsx
import { queryClient } from '@/core/lib/query-client';
import { useSurveyDetailsQuery } from '@/core/hooks/queries/survey/use-survey-details.query';
import { useSubmitSurveyMutation } from '@/core/hooks/mutations/survey/use-submit-survey.mutation';
import { QuestionType, type SurveyFormLayout } from '@/core/types/survey.type';
import { SurveyLayoutContext } from './survey-layout-context';
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
  PhoneInputField,
  RadioButtons,
  Ranking,
  SingleSlider,
  StarRating,
  SurveyQuestionWrapper,
} from '@/shared/ui/atoms/survey-questions';
import { COUNTRY_CODES } from '@/core/constants/country-codes';
import { FileUpload } from '@/shared/ui/atoms/survey-questions/FileUpload';
import { QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useLanguage } from '@/core/hooks/use-language';
import { useProfileQuery } from '@/core/hooks/queries/use-profile.query';
import zoneService from '@/services/api/zone.service';
import { LanguageToggle } from '@/shared/ui/molecules/language-toggle';

/** Two-button toggle that switches between paginated and list layouts. */
const LayoutToggle: React.FC = () => {
  const { layout, setLayout } = React.useContext(SurveyLayoutContext);
  return (
    <div className="flex items-center bg-custom-grey-1 rounded-lg p-0.5 gap-0.5">
      <button
        type="button"
        title="One question at a time"
        onClick={() => setLayout('paginated')}
        className={`p-1.5 rounded-md transition-all ${
          layout === 'paginated' ? 'bg-white shadow-sm text-black' : 'text-custom-grey-3 hover:text-black'
        }`}
      >
        {/* Single card icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        title="All questions in a list"
        onClick={() => setLayout('list')}
        className={`p-1.5 rounded-md transition-all ${
          layout === 'list' ? 'bg-white shadow-sm text-black' : 'text-custom-grey-3 hover:text-black'
        }`}
      >
        {/* List icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
      </button>
    </div>
  );
};

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
  const [listErrors, setListErrors] = useState<Record<number, string>>({});
  const [formLayout, setFormLayout] = useState<SurveyFormLayout>('paginated');
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

  // Indices of questions that are currently visible, evaluated against current answers.
  // Supports showIf (single condition) and showIfAll (AND logic).
  const visibleIndices = React.useMemo(() => {
    const allQs = surveyData?.data?.template?.questions || [];
    const evalCond = (cond: any): boolean => {
      const refIdx = questionIdToIndex[cond.questionId];
      if (refIdx === undefined) return true;
      const actual = answers[refIdx]?.value?.toString();
      const expected = cond.value?.toString();
      switch (cond.operator ?? 'equals') {
        case 'equals':     return actual === expected;
        case 'not_equals': return actual !== expected;
        case 'contains':   return actual?.includes(expected ?? '') ?? false;
        default:           return true;
      }
    };
    return allQs
      .map((_, i) => i)
      .filter(i => {
        const cfg = allQs[i]?.config || {};
        if (cfg.showIf && !evalCond(cfg.showIf)) return false;
        if (cfg.showIfAll?.some((c: any) => !evalCond(c))) return false;
        return true;
      });
  }, [surveyData, questionIdToIndex, answers]);

  const isQuestionVisible = (index: number) => visibleIndices.includes(index);

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

  // Initialise layout from survey/template defaults (only on first load)
  React.useEffect(() => {
    if (surveyData?.data) {
      const { survey, template } = surveyData.data;
      const serverLayout =
        (survey as any).formLayout ||
        template.settings?.defaultFormLayout ||
        'paginated';
      setFormLayout(serverLayout as SurveyFormLayout);
    }
  }, [surveyData]);

  // Validate any question by index — used for both paginated and list mode
  const isQuestionValid = React.useCallback((index: number): boolean => {
    if (!isQuestionVisible(index)) return true;

    const qData = surveyData?.data?.template?.questions[index];
    if (!qData) return false;

    const answer = answers[index];

    if (!qData.required && !answer) return true;
    if (!answer) return false;

    switch (qData.questionType) {
      case QuestionType.TEXT:
      case QuestionType.TEXTAREA:
      case QuestionType.DATE:
        return !!answer.value && answer.value.trim() !== '';

      case QuestionType.EMAIL: {
        const emailVal = answer.value?.trim() ?? '';
        if (!emailVal) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      }

      case QuestionType.PHONE: {
        const digits = (answer.value ?? '').replace(/\D/g, '');
        if (digits.length === 0) return false;
        const countryCode = answer.countryCode as string | undefined;
        const country = countryCode
          ? COUNTRY_CODES.find(c => c.code === countryCode)
          : undefined;
        const expected = country?.length;
        return expected != null ? digits.length === expected : digits.length >= 7 && digits.length <= 15;
      }

      case QuestionType.FILE:
        return !!(answer.file?.fileName && answer.file?.url);

      case QuestionType.NUMBER:
      case QuestionType.CURRENCY:
        return answer.value !== undefined && answer.value !== null && !isNaN(answer.value);

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
          answer.range !== undefined &&
          typeof answer.range.min === 'number' &&
          typeof answer.range.max === 'number'
        );

      case QuestionType.MULTI_SLIDER: {
        const sliders = qData.config.sliders || qData.config.items || [];
        return answer.values && sliders.length > 0 && sliders.every((slider: any) => {
          const sliderId = slider.id ?? slider.value;
          return answer.values[sliderId] !== undefined && answer.values[sliderId] !== null;
        });
      }

      case QuestionType.MATRIX:
        return answer.values && Object.values(answer.values).every((str) => str !== '');

      case QuestionType.RANKING:
        return answer.rankedItems && answer.rankedItems.length > 0;

      case QuestionType.MAX_DIFF: {
        const maxDiffItems =
          qData.config?.items ||
          qData.config?.options ||
          qData.config?.sets?.[0]?.items ||
          qData.translations?.[language]?.items ||
          qData.translations?.en?.items ||
          [];
        if (maxDiffItems.length === 0) return false;
        const hasAnySelection = answer.selections &&
          Object.values(answer.selections).some((v) => v === 'best' || v === 'worst');
        if (!qData.required && !hasAnySelection) return true;
        return answer.selections && maxDiffItems.every((item: any) => {
          const itemId = item.id || item.value;
          return answer.selections[itemId] === 'best' || answer.selections[itemId] === 'worst';
        });
      }

      case QuestionType.CONSTANT_SUM: {
        const totalPoints = qData.config.total;
        const totalAllocated = answer.allocatedPoints &&
          Object.values(answer.allocatedPoints).reduce(
            (acc: any, val: any) => acc + val, 0
          );
        return totalPoints - totalAllocated === 0;
      }

      default:
        return false;
    }
  }, [surveyData, answers, visibleIndices, language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Backward-compat alias for paginated navigation
  const isCurrentQuestionValid = React.useCallback(
    () => isQuestionValid(currentQuestion),
    [isQuestionValid, currentQuestion],
  );

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

  // Visible question ordinal and total (for progress bar and numbering)
  const visibleQuestionNumber = (visibleIndices.indexOf(currentQuestion) + 1) || 1;
  const totalVisibleQuestions = visibleIndices.length || totalQuestions;
  const isLastQuestion = visibleIndices[visibleIndices.length - 1] === currentQuestion;

  // Return translated question text with English fallback
  const getQuestionText = (q: any): string =>
    q.translations?.[language]?.text || q.translations?.en?.text || q.text || '';

  const handleNext = () => {
    if (!isCurrentQuestionValid()) return;
    handleSaveDraft();

    // Skip hidden questions when advancing
    let next = currentQuestion + 1;
    while (next < totalQuestions && !isQuestionVisible(next)) {
      next++;
    }
    if (next < totalQuestions) {
      setCurrentQuestion(next);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    let prev = currentQuestion - 1;
    while (prev >= 0 && !isQuestionVisible(prev)) {
      prev--;
    }
    if (prev >= 0) {
      setCurrentQuestion(prev);
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

  // Answer-change handler for list mode — targets a specific question index
  const handleAnswerChangeForIndex = (idx: number, answer: any) => {
    const currentQ = questions[idx];
    const newAnswers: Record<number, any> = { ...answers, [idx]: answer };

    if (currentQ) {
      questions.forEach((q, i) => {
        const dependsOnCurrent = q.config?.dependsOn === currentQ.id;
        const isInParentChain = (q.config?.parentChain || []).includes(currentQ.id);
        if (dependsOnCurrent || isInParentChain) {
          newAnswers[i] = undefined;
          delete prevParentValues.current[q.id];
          setDynamicOptions(prev => ({ ...prev, [q.id]: [] }));
        }
      });
    }

    // Clear error for this question once the user starts answering
    setListErrors(prev => {
      if (!prev[idx]) return prev;
      const next = { ...prev };
      delete next[idx];
      return next;
    });

    setAnswers(newAnswers);
  };

  // Submit handler for list mode — validates all visible questions first
  const handleListSubmit = () => {
    const errors: Record<number, string> = {};
    let firstErrorIdx: number | null = null;

    visibleIndices.forEach(idx => {
      if (!isQuestionValid(idx)) {
        errors[idx] = 'This field is required';
        if (firstErrorIdx === null) firstErrorIdx = idx;
      }
    });

    if (Object.keys(errors).length > 0) {
      setListErrors(errors);
      if (firstErrorIdx !== null) {
        const el = document.getElementById(`list-q-${firstErrorIdx}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setListErrors({});
    handleSubmit();
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
      // Skip questions hidden by conditional logic (showIf / showIfAll)
      if (!isQuestionVisible(index)) return;

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
    if (totalVisibleQuestions === 0) return 0;
    return visibleQuestionNumber / totalVisibleQuestions;
  };

  // Renders a question for either paginated (default) or list mode.
  // In list mode, qIdx targets any visible question; commonProps adapts accordingly.
  const renderQuestion = (qIdx: number = currentQuestion, isListMode: boolean = false) => {
    const qData = questions[qIdx];
    if (!qData) return null;

    const config = qData.config || {};
    const isValid = isQuestionValid(qIdx);
    const currentAnswer = answers[qIdx];
    const hasAnswer =
      currentAnswer !== undefined &&
      currentAnswer !== null &&
      Object.keys(currentAnswer).length > 0;

    const visPos = visibleIndices.indexOf(qIdx);
    const qNumber = visPos >= 0 ? visPos + 1 : 1;

    const onChange = (newAnswer: any) => {
      if (isListMode) {
        handleAnswerChangeForIndex(qIdx, newAnswer);
      } else {
        handleAnswerChange(newAnswer);
      }
    };

    const commonProps = {
      questionNumber: isListMode ? qNumber : visibleQuestionNumber,
      totalQuestions: totalVisibleQuestions,
      question: getQuestionText(qData),
      surveyLabel: isListMode ? undefined : getSurveyLabel(),
      surveyId: surveyData?.data?.survey?.surveyId || '',
      comment: currentAnswer?.comment || '',
      onCommentChange: (comment: string) => onChange({ ...currentAnswer, comment }),
      showComment: qData.allowComment === true,
      progress: isListMode ? 0 : getProgress(),
      onBack: isListMode ? undefined : handleBack,
      onNext: isListMode ? undefined : handleNext,
      onSaveDraft: isListMode ? undefined : handleSaveDraft,
      isNextDisabled: !isValid,
      isLastQuestion: isListMode ? false : isLastQuestion,
      isOptional: !qData.required,
      hasAnswer,
      error: isListMode ? listErrors[qIdx] : undefined,
      listMode: isListMode,
    };

    switch (qData.questionType) {
      case QuestionType.LIKERT_SCALE:
        return (
          <LickertScale
            {...commonProps}
            minValue={config.min || 1}
            maxValue={config.max || 10}
            minLabel={config.minLabel || (config.labels ? Object.values(config.labels)[0] as string : '')}
            maxLabel={config.maxLabel || (config.labels ? Object.values(config.labels)[1] as string : '')}
            description={config.description}
            selectedValue={currentAnswer?.value}
            onValueChange={(value) => onChange({ ...currentAnswer, value })}
          />
        );

      case QuestionType.RATING:
        return (
          <StarRating
            {...commonProps}
            maxStars={config.maxStars || 5}
            selectedStars={currentAnswer?.stars}
            onRatingChange={(stars) => onChange({ ...currentAnswer, stars })}
            image={config.image}
            ratingLabels={config.labels}
          />
        );

      case QuestionType.MCQ_SINGLE: {
        const hasDynamicSource = !!(config.dataSource || config.autoPopulateFrom);
        const isLoadingDynamic = loadingOptions[qData.id] || false;
        const rawDynOpts = dynamicOptions[qData.id] || [];
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
            selectedValue={currentAnswer?.value}
            onValueChange={(value) => {
              if (isReadOnly) return;
              onChange({ ...currentAnswer, value });
            }}
          />
        );
      }

      case QuestionType.MCQ_MULTIPLE: {
        const mcqMultipleOptions = (config.options || []).map((opt: any) => ({
          ...opt,
          id: opt.id ?? opt.value,
          value: opt.value ?? opt.id,
        }));
        return (
          <Checkboxes
            {...commonProps}
            options={mcqMultipleOptions}
            selectedValues={currentAnswer?.values || []}
            onValueChange={(values) => onChange({ ...currentAnswer, values })}
          />
        );
      }

      case QuestionType.SCALE:
        return (
          <SingleSlider
            {...commonProps}
            minValue={config.min || 1}
            maxValue={config.max || 10}
            minLabel={config.minLabel || (config.labels ? Object.values(config.labels)[0] as string : '')}
            maxLabel={config.maxLabel || (config.labels ? Object.values(config.labels)[1] as string : '')}
            selectedValue={currentAnswer?.value}
            onValueChange={(value) => onChange({ ...currentAnswer, value })}
          />
        );

      case QuestionType.DOUBLE_SLIDER:
        return (
          <DoubleSlider
            {...commonProps}
            minValue={config.min ?? 0}
            maxValue={config.max || 100}
            minLabel={config.labels ? (Array.isArray(config.labels) ? config.labels[0] : (config.labels.start ?? config.labels.min ?? '')) : ''}
            maxLabel={config.labels ? (Array.isArray(config.labels) ? config.labels[1] : (config.labels.end ?? config.labels.max ?? '')) : ''}
            step={config.step}
            selectedRange={currentAnswer?.range}
            onRangeChange={(range) => onChange({ ...currentAnswer, range })}
          />
        );

      case QuestionType.MULTI_SLIDER: {
        const sliderItems = (config.items || config.sliders || []).map((slider: any) => ({
          ...slider,
          id: slider.id ?? slider.value,
          value: slider.value ?? slider.id,
          minLabel: slider.minLabel || '',
          maxLabel: slider.maxLabel || '',
        }));
        const firstSlider = config.sliders?.[0];
        const globalMinValue = config.minValue ?? firstSlider?.min ?? 0;
        const globalMaxValue = config.maxValue ?? firstSlider?.max ?? 100;
        return (
          <MultipleSlider
            {...commonProps}
            items={sliderItems}
            minValue={globalMinValue}
            maxValue={globalMaxValue}
            selectedValues={currentAnswer?.values || {}}
            onValuesChange={(values) => onChange({ ...currentAnswer, values })}
          />
        );
      }

      case QuestionType.MATRIX: {
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
            selectedValues={currentAnswer?.values || {}}
            onValuesChange={(values) => onChange({ ...currentAnswer, values })}
          />
        );
      }

      case QuestionType.RANKING: {
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
              currentAnswer?.rankedItems ?? rankingItems.map((item: any) => item.value)
            }
            onRankingChange={(rankedItems) => onChange({ ...currentAnswer, rankedItems })}
          />
        );
      }

      case QuestionType.MAX_DIFF: {
        const maxDiffItemsSource =
          config.items ||
          config.options ||
          config.sets?.[0]?.items ||
          qData.translations?.[language]?.items ||
          qData.translations?.en?.items ||
          [];
        const maxDiffItems = maxDiffItemsSource.map((item: any) => ({
          id: item.id || item.value,
          label: item.label,
        }));
        return (
          <MaxDiff
            {...commonProps}
            items={maxDiffItems}
            selections={currentAnswer?.selections || {}}
            onSelectionChange={(selections) => onChange({ ...currentAnswer, selections })}
          />
        );
      }

      case QuestionType.CONSTANT_SUM: {
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
            allocatedPoints={currentAnswer?.allocatedPoints || {}}
            onAllocationChange={(allocatedPoints) =>
              onChange({ ...currentAnswer, allocatedPoints })
            }
            allowZero={config.allowZero}
            requireTotal={config.requireTotal}
          />
        );
      }

      case QuestionType.TEXT:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="text"
              value={currentAnswer?.value || ''}
              onChange={(e) => onChange({ ...currentAnswer, value: e.target.value })}
              placeholder={qData.translations?.[language]?.placeholder || config.placeholder || ''}
              minLength={config.minLength}
              maxLength={config.maxLength}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.helpText && (
              <p className="mt-2 text-sm text-custom-grey-3">{config.helpText}</p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.TEXTAREA:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <textarea
              value={currentAnswer?.value || ''}
              onChange={(e) => onChange({ ...currentAnswer, value: e.target.value })}
              placeholder={qData.translations?.[language]?.placeholder || config.placeholder || ''}
              maxLength={config.maxLength}
              rows={6}
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors resize-vertical border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.maxLength && (
              <p className="mt-1 text-sm text-custom-grey-3 text-right">
                {(currentAnswer?.value || '').length}/{config.maxLength}
              </p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.NUMBER:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="number"
              value={currentAnswer?.value || ''}
              onChange={(e) => onChange({ ...currentAnswer, value: parseFloat(e.target.value) })}
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
          <SurveyQuestionWrapper {...commonProps}>
            <div className="flex items-center border-b-2 bg-custom-grey-5 focus-within:bg-white focus-within:border-primary border-custom-grey-2 transition-colors">
              <span className="pl-4 pr-1 text-base md:text-lg font-medium text-custom-grey-3 select-none">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={currentAnswer?.value ?? ''}
                onChange={(e) =>
                  onChange({
                    ...currentAnswer,
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
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="email"
              value={currentAnswer?.value || ''}
              onChange={(e) => onChange({ ...currentAnswer, value: e.target.value })}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary text-base md:text-lg"
            />
            {config.customMessage && (
              <p className="mt-2 text-sm text-custom-grey-3">{config.customMessage}</p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.PHONE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <PhoneInputField
              answer={currentAnswer}
              onChange={(phoneAnswer) => onChange(phoneAnswer)}
              placeholder={config.placeholder ?? 'Enter phone number'}
            />
            {config.customMessage && (
              <p className="mt-2 text-sm text-custom-grey-3">{config.customMessage}</p>
            )}
          </SurveyQuestionWrapper>
        );

      case QuestionType.DATE:
        return (
          <SurveyQuestionWrapper {...commonProps}>
            <input
              type="date"
              value={currentAnswer?.value || ''}
              onChange={(e) => onChange({ ...currentAnswer, value: e.target.value })}
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
            questionId={qData.id}
            value={currentAnswer?.file}
            onFileChange={(file) => onChange({ ...currentAnswer, file })}
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
              Question type not supported: {qData.questionType}
            </p>
          </div>
        );
    }
  };

  // ── List layout ────────────────────────────────────────────────────────────
  const renderListLayout = () => {
    const answeredCount = visibleIndices.filter(i => {
      const a = answers[i];
      return a !== undefined && a !== null && Object.keys(a).length > 0;
    }).length;
    const progress = visibleIndices.length > 0 ? answeredCount / visibleIndices.length : 0;

    return (
      <div className="flex flex-col bg-white text-black h-full accent-primary caret-primary scheme-light">
        {/* Sticky header */}
        <div className="shrink-0 border-b border-custom-grey-2 px-4 py-3 md:px-12 md:py-4 bg-white z-10 sticky top-0">
          <div className="flex items-center justify-between gap-4 mb-3 max-w-4xl mx-auto">
            <h1 className="text-base md:text-lg font-semibold text-black truncate">
              {surveyData?.data?.survey?.surveyId}: {getSurveyLabel()}
            </h1>
            <div className="flex items-center gap-2 shrink-0">
              <LayoutToggle />
              <LanguageToggle variant="compact" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-1.5 bg-custom-grey-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <p className="text-xs text-custom-grey-3 text-right mt-1">
              {answeredCount} / {visibleIndices.length} answered
            </p>
          </div>
        </div>

        {/* Scrollable question list */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 md:px-12 md:py-8 max-w-4xl mx-auto space-y-4">
            {visibleIndices.map((qIdx) => (
              <div
                key={qIdx}
                id={`list-q-${qIdx}`}
                className={`p-4 md:p-6 border rounded-xl transition-colors ${
                  listErrors[qIdx]
                    ? 'border-primary bg-red-50'
                    : 'border-custom-grey-2 bg-white'
                }`}
              >
                {renderQuestion(qIdx, true)}
              </div>
            ))}

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-custom-grey-2">
              <button
                type="button"
                onClick={handleListSubmit}
                disabled={submitMutation.isPending}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm md:text-base"
              >
                {submitMutation.isPending
                  ? translations.common.loading
                  : translations.common.submit}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showSuccess) {
    return (
      <SurveySuccessMessage
        onClose={() => (window.location.href = '/survey-boards')}
      />
    );
  }

  return (
    <SurveyLayoutContext.Provider value={{ layout: formLayout, setLayout: setFormLayout }}>
      {formLayout === 'list' ? (
        renderListLayout()
      ) : (
        <div className="flex bg-white h-full accent-primary caret-primary scheme-light">
          {renderQuestion()}
        </div>
      )}
    </SurveyLayoutContext.Provider>
  );
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
