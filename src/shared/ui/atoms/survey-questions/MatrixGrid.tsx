// src/shared/ui/atoms/survey-questions/MatrixGrid.tsx
import type { MatrixGridProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';

export const MatrixGrid: React.FC<MatrixGridProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  rows,
  columns,
  selectedValues,
  onValuesChange,
  comment,
  onCommentChange,
  showComment,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
}) => {
  const { translations } = useLanguage();

  const handleSelectionChange = (rowId: string, optionId: string) => {
    onValuesChange({
      ...selectedValues,
      [rowId]: optionId,
    });
  };

  return (
    <SurveyQuestionWrapper
      surveyId={surveyId}
      surveyLabel={surveyLabel}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      question={question}
      comment={comment}
      onCommentChange={onCommentChange}
      showComment={showComment}
      progress={progress}
      onBack={onBack}
      onNext={onNext}
      error={error}
      isNextDisabled={isNextDisabled}
      isLastQuestion={isLastQuestion}
    >
      <div className="space-y-6">
        {rows.map((row, index) => (
          <div key={row.value + index} className="space-y-3">
            {/* Row Label */}
            <label className="block text-base md:text-lg text-black font-medium">
              {row.label}
            </label>

            {/* Dropdown/Select */}
            <select
              value={selectedValues[row.value] || ''}
              onChange={(e) => handleSelectionChange(row.value, e.target.value)}
              className="w-full px-3 py-2 border-b-2 bg-custom-grey-5 focus:bg-white focus:outline-none transition-colors border-custom-grey-2 focus:border-primary"
            >
              <option value=''>{translations.surveyQuestions.selectOption}</option>
              {columns.map((column) => (
                <option key={column.value} value={column.value}>
                  {column.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </SurveyQuestionWrapper>
  );
};
