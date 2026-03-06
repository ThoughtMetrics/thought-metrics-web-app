import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SurveyQuestion {
  id: string;
  order: number;
  questionType: string;
  text: string;
  config: {
    options?: Array<{ label: string; value: string }>;
    minSelections?: number;
    maxSelections?: number;
  };
  required: boolean;
  translations?: {
    en?: {
      text: string;
      options?: Array<{ label: string; value: string }>;
    };
    ta?: {
      text: string;
      options?: Array<{ label: string; value: string }>;
    };
  };
}

interface SurveyTemplate {
  _id: string;
  surveyId?: string;
  name: string;
  label: string;
  description?: string;
  questions: SurveyQuestion[];
  translations?: {
    en?: {
      label: string;
      description?: string;
      instructions?: string;
    };
    ta?: {
      label: string;
      description?: string;
      instructions?: string;
    };
  };
}

interface OnboardingSurveyFormProps {
  template: SurveyTemplate;
  surveyId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
  onSubmit?: (answers: Array<{ questionId: string; questionType: any; answer: any }>) => Promise<void>;
}

const OnboardingSurveyForm: React.FC<OnboardingSurveyFormProps> = ({
  template,
  surveyId,
  userId,
  userEmail,
  userName,
  onSubmitSuccess,
  onSubmitError,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = template.questions.sort((a, b) => a.order - b.order);
  const totalQuestions = questions.length;
  const question = questions[currentQuestion];

  // Get localized content (default to English)
  const getQuestionText = (q: SurveyQuestion) => {
    return q.translations?.en?.text || q.text;
  };

  const getOptions = (q: SurveyQuestion) => {
    return q.translations?.en?.options || q.config.options || [];
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setError(null);
  };

  const handleNext = () => {
    // Validate current question
    if (question.required && !answers[question.id]) {
      setError('This question is required');
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (question.required && !answers[question.id]) {
      setError('This question is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        questionType: q.questionType,
        answer: answers[q.id] ?? null,
      }));

      if (onSubmit) {
        await onSubmit(formattedAnswers);
      }

      onSubmitSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit survey';
      setError(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentAnswer = answers[question.id];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            {getQuestionText(question)}
            {question.required && <span className="text-primary ml-1">*</span>}
          </h3>
          {question.questionType === 'mcq-multiple' && (
            <p className="text-sm text-gray-600">Select all that apply</p>
          )}
        </div>

        {/* Single Choice (MCQ) */}
        {question.questionType === 'mcq-single' && (
          <div className="space-y-3">
            {getOptions(question).map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${
                    currentAnswer === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }
                `}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={currentAnswer === option.value}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                />
                <span className="ml-3 text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple Choice */}
        {question.questionType === 'mcq-multiple' && (
          <div className="space-y-3">
            {getOptions(question).map((option) => {
              const selectedValues = currentAnswer || [];
              const isChecked = selectedValues.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      isChecked
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v: string) => v !== option.value);
                      handleAnswer(question.id, newValues);
                    }}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-900">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>

        {currentQuestion < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Next Question
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Survey
              </>
            )}
          </button>
        )}
      </div>

      {/* Question Dots Navigation */}
      <div className="mt-8 flex justify-center gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentQuestion(index);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`
              w-3 h-3 rounded-full transition-all
              ${
                index === currentQuestion
                  ? 'bg-primary w-8'
                  : answers[questions[index].id]
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }
            `}
            aria-label={`Go to question ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default OnboardingSurveyForm;
