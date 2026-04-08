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
  rowColumnsMap,
  selectedValues,
  onValuesChange,
  comment,
  onCommentChange,
  showComment,
  showIntensePurchase,
  intensePurchaseLabel,
  intensePurchaseAnswers,
  onIntensePurchaseChange,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
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
      <div className="space-y-6">
        {rows.map((row, index) => {
          const rowCols = rowColumnsMap?.[row.value] ?? columns;
          const selectedColValue = selectedValues[row.value];
          const selectedCol = rowCols.find((c) => c.value === selectedColValue);
          const showIP = intensePurchaseLabel && selectedCol?.isIntensePurchase;
          return (
            <div key={row.value + index} className="space-y-3">
              {/* Row Label */}
              <label className="block text-base md:text-lg text-black font-medium">
                {row.label}
              </label>

              {/* Dropdown/Select */}
              <select
                value={selectedColValue || ''}
                onChange={(e) => handleSelectionChange(row.value, e.target.value)}
                className="w-full px-3 py-2 border-b-2 bg-white focus:bg-white focus:outline-none transition-colors border-custom-grey-1 focus:border-primary text-black"
              >
                <option value=''>{translations.surveyQuestions.selectOption}</option>
                {rowCols.map((column) => (
                  <option key={column.value} value={column.value}>
                    {column.label}
                  </option>
                ))}
              </select>

              {/* Intense purchase checkbox */}
              {showIP && (
                <div className="ml-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`ip_${row.value}`}
                    checked={intensePurchaseAnswers?.[row.value] ?? false}
                    onChange={(e) =>
                      onIntensePurchaseChange?.({
                        ...intensePurchaseAnswers,
                        [row.value]: e.target.checked,
                      })
                    }
                    className="w-3.5 h-3.5 accent-primary"
                  />
                  <label htmlFor={`ip_${row.value}`} className="text-xs text-gray-500">
                    {intensePurchaseLabel} <span className="text-gray-400">(optional)</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
