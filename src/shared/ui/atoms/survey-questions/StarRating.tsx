// src/shared/ui/atoms/survey-questions/StarRating.tsx
import type { StarRatingProps } from '@/core/types/survey.type';
import type React from 'react';
import { SurveyQuestionWrapper } from './SurveyQuestionWrapper';

export const StarRating: React.FC<StarRatingProps> = ({
  questionNumber,
  totalQuestions,
  question,
  surveyId,
  surveyLabel,
  maxStars = 5,
  selectedStars,
  onRatingChange,
  image,
  video,
  ratingLabels,
  comment,
  onCommentChange,
  showComment,
  showIntensePurchase,
  intensePurchaseLabel,
  progress,
  onBack,
  onNext,
  error,
  isNextDisabled,
  isLastQuestion,
  isOptional,
  hasAnswer,
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);
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
      <div className="space-y-6 flex flex-col">
        {/* Image */}
        {image && (
          <div className="w-full flex justify-center">
            <img
              src={image}
              alt="Rating content"
              className="w-auto max-h-80 rounded-lg"
            />
          </div>
        )}

        {/* Video */}
        {video && !image && (
          <div className="w-full flex justify-center">
            <video src={video} controls className="w-auto max-h-80 rounded-lg" />
          </div>
        )}

        {/* Rating Label */}
        {ratingLabels && (
          <p className="text-base md:text-lg text-on-surface text-center">
            {Object.entries(ratingLabels)
              .map((ratingLabel) => `${ratingLabel[0]}=${ratingLabel[1]}`)
              .join(', ')}
          </p>
        )}

        {/* Star Rating */}
        <div className="flex justify-center gap-2 md:gap-4">
          {stars.map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onRatingChange(star)}
              className="transition-transform hover:scale-110"
            >
              <svg
                className={`w-10 h-10 md:w-12 md:h-12 ${
                  selectedStars && star <= selectedStars
                    ? 'fill-primary stroke-primary'
                    : 'fill-none stroke-custom-grey-3'
                }`}
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </SurveyQuestionWrapper>
  );
};
