// src/shared/components/survey/SurveySuccessMessage.tsx
import type React from 'react';

interface SurveySuccessMessageProps {
  onClose?: () => void;
}

export const SurveySuccessMessage: React.FC<SurveySuccessMessageProps> = ({
  onClose,
}) => {
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
            Thank you for your responses!
          </h2>
          <p className="text-text-dark mb-6">
            Our team will review your answers. If you meet the criteria for
            this study, a Thought Metrics representative will contact you for
            next steps.
          </p>
          <p className="text-sm text-text-dark mb-6">
            Stay tuned — your opinions help shape tomorrow's decisions!
          </p>
          <button
            onClick={onClose || (() => (window.location.href = '/survey-boards'))}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition w-full"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    </div>
  );
};
