// src/shared/ui/atoms/survey-questions/Ranking.tsx
import type { RankingProps } from '@/core/types/survey.type';
import React, { useState } from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';
import { useLanguage } from '@/core/hooks/use-language';
import { ChevronDown } from 'lucide-react';

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
  isOptional,
  hasAnswer,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { translations } = useLanguage();

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

  const getItem = (itemValue: string) => items.find((item) => item.value === itemValue);

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
      <div className="mb-8 text-text-dark">({translations.surveyQuestions.dragItems})</div>
      <div className="space-y-3">
        {rankedItems.map((itemId, index) => {
          const item = getItem(itemId);
          const hasAttrs = item?.attributes && item.attributes.length > 0;
          const isExpanded = expandedItem === itemId;
          return (
            <div
              key={itemId}
              draggable
              onDragStart={() => handleDragStart(itemId)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              className="border border-custom-grey-1 rounded-lg cursor-move hover:border-primary transition-colors bg-white overflow-hidden"
            >
              <div className="flex items-center space-x-3 p-4">
                {/* Rank Number */}
                <div className="flex items-center justify-center w-8 h-8 rounded border border-custom-grey-1 bg-white text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                {/* Drag Handle Icon */}
                <div className="flex flex-col space-y-0.5 flex-shrink-0">
                  <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
                  <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
                  <div className="w-1 h-1 bg-custom-grey-3 rounded-full" />
                </div>
                {/* Item Label */}
                <span className="flex-1 text-base md:text-lg text-black">{item?.label}</span>
                {hasAttrs && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setExpandedItem(isExpanded ? null : itemId); }}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-primary transition-colors"
                    title="Show details"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </div>
              {isExpanded && hasAttrs && (
                <div className="border-t border-custom-grey-1 divide-y divide-custom-grey-1">
                  {item!.attributes!.map((attr, i) => (
                    <div key={i} className="px-3 py-1.5 text-sm text-text-dark bg-primary/5">
                      <span className="font-medium">{attr.key}:</span> {attr.value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SurveyQuestionWrapper>
  );
};
