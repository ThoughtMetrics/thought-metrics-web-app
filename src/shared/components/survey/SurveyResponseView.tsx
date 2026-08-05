// src/shared/components/survey/SurveyResponseView.tsx
import type React from 'react';
import { useLanguage } from '@/core/hooks/use-language';
import { QuestionType } from '@/core/types/survey.type';

interface SurveyResponseViewProps {
  questions: any[];
  answers: Record<number, any>;
  language: string;
  onClose: () => void;
}

// Resolves an option's stored value (e.g. "12") to its display label (e.g.
// "Perambur") — same lookup order getAnswerSummary uses in
// SurveyDetailComponent.tsx: localized options first, falling back to
// English, then to the template's default config.options.
const resolveOptionLabel = (q: any, value: string, language: string): string => {
  const rawOpts =
    q.translations?.[language]?.options ||
    q.translations?.en?.options ||
    q.config?.options ||
    [];
  const matched = rawOpts.find((o: any) => (o.value ?? o.id) === value);
  return matched?.label || value;
};

const formatAnswer = (q: any, answer: any, language: string): string => {
  if (!answer || Object.keys(answer).length === 0) return '—';

  switch (q.questionType) {
    case QuestionType.MCQ_SINGLE:
      if (answer.displayLabel) return answer.displayLabel;
      if (answer.value == null) return '—';
      return resolveOptionLabel(q, answer.value, language);

    case QuestionType.MCQ_MULTIPLE:
      if (!answer.values?.length) return '—';
      return answer.values
        .map((v: string) => resolveOptionLabel(q, v, language))
        .join(', ');

    case QuestionType.RATING:
      return answer.stars != null ? `${answer.stars} ★` : '—';

    case QuestionType.DOUBLE_SLIDER:
      if (!answer.range) return '—';
      return `${answer.range.min} – ${answer.range.max}`;

    case QuestionType.MULTI_SLIDER:
    case QuestionType.MATRIX:
      if (!answer.values) return '—';
      return Object.entries(answer.values as Record<string, any>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    case QuestionType.RANKING:
      return answer.rankedItems?.join(' → ') ?? '—';

    case QuestionType.MAX_DIFF: {
      if (!answer.selections) return '—';
      const best = Object.entries(answer.selections as Record<string, string>)
        .filter(([, v]) => v === 'best')
        .map(([k]) => k)
        .join(', ');
      const worst = Object.entries(answer.selections as Record<string, string>)
        .filter(([, v]) => v === 'worst')
        .map(([k]) => k)
        .join(', ');
      return `Best: ${best || '—'} | Worst: ${worst || '—'}`;
    }

    case QuestionType.CONSTANT_SUM:
      if (!answer.allocatedPoints) return '—';
      return Object.entries(answer.allocatedPoints as Record<string, number>)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    case QuestionType.FILE:
      return answer.file?.fileName ?? answer.file?.url ?? '—';

    default:
      return answer.value != null ? String(answer.value) : '—';
  }
};

export const SurveyResponseView: React.FC<SurveyResponseViewProps> = ({
  questions,
  answers,
  language,
  onClose,
}) => {
  const { translations } = useLanguage();

  const getQuestionText = (q: any): string =>
    q.translations?.[language]?.text || q.translations?.en?.text || q.text || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-custom-grey-2 shrink-0">
          <h2 className="text-lg font-semibold text-text-dark">
            {translations.surveySuccess.viewButton}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md hover:bg-custom-grey-1 text-custom-grey-3 hover:text-text-dark transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {questions.map((q, idx) => {
            const answer = answers[idx];
            const hasAnswer = answer && Object.keys(answer).length > 0;
            if (!hasAnswer && !q.required) return null;

            return (
              <div key={q.id ?? idx} className="border border-custom-grey-2 rounded-lg p-4">
                <p className="text-sm font-medium text-text-dark mb-1">
                  <span className="text-custom-grey-3 mr-2">{idx + 1}.</span>
                  {getQuestionText(q)}
                  {!q.required && (
                    <span className="ml-2 text-xs text-custom-grey-3">
                      ({translations.surveyDetail.optional})
                    </span>
                  )}
                </p>
                <p className="text-base text-black mt-2 pl-5">
                  {formatAnswer(q, answer, language)}
                </p>
                {answer?.comment && (
                  <p className="text-sm text-custom-grey-3 mt-1 pl-5 italic">
                    {translations.surveyDetail.comment}: {answer.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-custom-grey-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {translations.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
