// src/shared/ui/atoms/survey-questions/Ranking.tsx
import type { RankingProps } from '@/core/types/survey.type';
import type React from 'react';
import { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const Ranking: React.FC<RankingProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  items,
  rankedItems,
  onRankingChange,
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
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggedItem) return;

    const draggedIndex = rankedItems.indexOf(draggedItem);
    if (draggedIndex === -1) return;

    const newRankedItems = [...rankedItems];
    newRankedItems.splice(draggedIndex, 1);
    newRankedItems.splice(targetIndex, 0, draggedItem);

    onRankingChange(newRankedItems);
    setDraggedItem(null);
  };

  const getItemLabel = (itemValue: string) => {
    return items.find((item) => item.value === itemValue)?.label || '';
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
    >
      <div className="mb-8 text-text-dark">
        (click and drag to reorder)
      </div>
      <div className="space-y-3">
        {rankedItems.map((itemId, index) => (
          <div
            key={itemId}
            draggable
            onDragStart={() => handleDragStart(itemId)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className="flex items-center space-x-3 p-4 border-2 border-custom-grey-2 rounded-lg cursor-move hover:border-primary transition-colors bg-custom-grey-5"
          >
            {/* Rank Number */}
            <div className="flex items-center justify-center w-8 h-8 rounded border border-custom-grey-2 bg-white text-sm font-medium">
              {index + 1}
            </div>

            {/* Drag Handle Icon */}
            <div className="flex flex-col space-y-0.5">
              <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
              <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
              <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
            </div>

            {/* Item Label */}
            <span className="flex-1 text-base md:text-lg text-black">
              {getItemLabel(itemId)}
            </span>
          </div>
        ))}
      </div>
    </SurveyQuestionWrapper>
  );
};
