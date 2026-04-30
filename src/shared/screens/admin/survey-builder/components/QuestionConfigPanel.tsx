// components/QuestionConfigPanel.tsx
//
// Right panel in the question builder section.
// Shows behaviour-level settings for the selected question:
//   - Required toggle
//   - Allow Comment toggle
//   - Option Filter (MCQ types only)
//   - Conditional Logic
//
// Type-specific config (options, scale range, etc.) lives in the centre editor panel.

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import ConditionalLogicConfig from './ConditionalLogicConfig';
import SkipLogicConfig from './SkipLogicConfig';
import OptionFilterConfig from './configs/OptionFilterConfig';

const QuestionConfigPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    setQuestionField,
  } = useSurveyBuilderStore();

  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-500">Select a question</p>
          <p className="text-xs text-gray-400 mt-1">Question settings will appear here</p>
        </div>
      </div>
    );
  }

  const question = questions[selectedQuestionIndex];
  if (!question) return null;

  const hasOptions =
    question.questionType === QuestionType.MCQ_SINGLE ||
    question.questionType === QuestionType.MCQ_MULTIPLE ||
    question.questionType === QuestionType.RANKING;

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Question Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Required / Allow Comment */}
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-700">Required</span>
              <p className="text-xs text-gray-400 mt-0.5">Respondents must answer this question</p>
            </div>
            <button
              onClick={() => setQuestionField(selectedQuestionIndex, 'required', !question.required)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ml-3 ${
                question.required ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                  question.required ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-sm font-medium text-gray-700">Allow Comment</span>
              <p className="text-xs text-gray-400 mt-0.5">Add an optional comment field</p>
            </div>
            <button
              onClick={() => setQuestionField(selectedQuestionIndex, 'allowComment', !question.allowComment)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ml-3 ${
                question.allowComment ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                  question.allowComment ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {/* Option Filter — MCQ / Ranking (any question with options) */}
        {hasOptions && (
          <OptionFilterConfig question={question} qIdx={selectedQuestionIndex} />
        )}

        {/* Conditional Logic */}
        <ConditionalLogicConfig question={question} qIdx={selectedQuestionIndex} />

        {/* Skip Logic */}
        <SkipLogicConfig question={question} qIdx={selectedQuestionIndex} />
      </div>
    </div>
  );
};

export default QuestionConfigPanel;
