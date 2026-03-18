// src/shared/components/survey/SurveySuccessMessage.tsx
import type React from 'react';
import { useLanguage } from '@/core/hooks/use-language';

interface SurveySuccessMessageProps {
  onView?: () => void;
  onEdit?: () => void;
  onClose?: () => void; // "Back to Survey Boards" — hidden if undefined
}

export const SurveySuccessMessage: React.FC<SurveySuccessMessageProps> = ({
  onView,
  onEdit,
  onClose,
}) => {
  const { translations } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-text-dark">
            {translations.surveySuccess.title}
          </h2>
          <p className="text-text-dark mb-6">
            {translations.surveySuccess.message}
          </p>
          <p className="text-sm text-text-dark mb-6">
            {translations.surveySuccess.subMessage}
          </p>

          <div className="flex flex-col gap-3">
            {onView && (
              <button
                onClick={onView}
                className="bg-white border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-red-50 transition w-full font-medium"
              >
                {translations.surveySuccess.viewButton}
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="bg-white border-2 border-primary text-primary px-6 py-3 rounded-lg hover:bg-red-50 transition w-full font-medium"
              >
                {translations.surveySuccess.editButton}
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition w-full"
              >
                {translations.surveySuccess.backButton}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
