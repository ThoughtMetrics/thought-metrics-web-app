// components/QuestionListPanel.tsx

import React, { useState } from 'react';
import { QuestionType } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

const QUESTION_GROUPS: { label: string; types: { type: QuestionType; label: string }[] }[] = [
  {
    label: 'Text',
    types: [
      { type: QuestionType.TEXT, label: 'Short Text' },
      { type: QuestionType.TEXTAREA, label: 'Long Text' },
      { type: QuestionType.NUMBER, label: 'Number' },
      { type: QuestionType.EMAIL, label: 'Email' },
      { type: QuestionType.PHONE, label: 'Phone' },
      { type: QuestionType.DATE, label: 'Date' },
      { type: QuestionType.CURRENCY, label: 'Currency' },
      { type: QuestionType.FILE, label: 'File Upload' },
    ],
  },
  {
    label: 'Choice',
    types: [
      { type: QuestionType.MCQ_SINGLE, label: 'Single Choice' },
      { type: QuestionType.MCQ_MULTIPLE, label: 'Multiple Choice' },
      { type: QuestionType.RANKING, label: 'Ranking' },
    ],
  },
  {
    label: 'Scale',
    types: [
      { type: QuestionType.RATING, label: 'Star Rating' },
      { type: QuestionType.LIKERT_SCALE, label: 'Likert Scale' },
      { type: QuestionType.SCALE, label: 'Slider Scale' },
      { type: QuestionType.DOUBLE_SLIDER, label: 'Range Slider' },
      { type: QuestionType.MULTI_SLIDER, label: 'Multi Slider' },
    ],
  },
  {
    label: 'Grid',
    types: [
      { type: QuestionType.MATRIX, label: 'Matrix Grid' },
      { type: QuestionType.MAX_DIFF, label: 'Max Diff' },
      { type: QuestionType.CONSTANT_SUM, label: 'Constant Sum' },
    ],
  },
];

const TYPE_BADGE_COLORS: Partial<Record<QuestionType, string>> = {
  [QuestionType.TEXT]: 'bg-blue-100 text-blue-700',
  [QuestionType.TEXTAREA]: 'bg-blue-100 text-blue-700',
  [QuestionType.NUMBER]: 'bg-purple-100 text-purple-700',
  [QuestionType.EMAIL]: 'bg-blue-100 text-blue-700',
  [QuestionType.PHONE]: 'bg-blue-100 text-blue-700',
  [QuestionType.DATE]: 'bg-blue-100 text-blue-700',
  [QuestionType.CURRENCY]: 'bg-green-100 text-green-700',
  [QuestionType.MCQ_SINGLE]: 'bg-orange-100 text-orange-700',
  [QuestionType.MCQ_MULTIPLE]: 'bg-orange-100 text-orange-700',
  [QuestionType.RATING]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.LIKERT_SCALE]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.SCALE]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.DOUBLE_SLIDER]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.MULTI_SLIDER]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.MATRIX]: 'bg-pink-100 text-pink-700',
  [QuestionType.RANKING]: 'bg-orange-100 text-orange-700',
  [QuestionType.MAX_DIFF]: 'bg-pink-100 text-pink-700',
  [QuestionType.CONSTANT_SUM]: 'bg-pink-100 text-pink-700',
  [QuestionType.FILE]: 'bg-gray-100 text-gray-700',
};

const QuestionListPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    selectQuestion,
    addQuestion,
    removeQuestion,
    duplicateQuestion,
    moveQuestionUp,
    moveQuestionDown,
  } = useSurveyBuilderStore();

  const [addMenuOpen, setAddMenuOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Template Settings link */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => selectQuestion(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedQuestionIndex === null
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Template Settings
        </button>
      </div>

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {questions.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6 px-3">
            No questions yet. Add one below.
          </p>
        )}
        {questions.map((q, idx) => {
          const isSelected = selectedQuestionIndex === idx;
          const displayText = q.translations.en.text || q.text || `Question ${idx + 1}`;
          const badgeColor = TYPE_BADGE_COLORS[q.questionType] ?? 'bg-gray-100 text-gray-600';

          return (
            <div
              key={q.id}
              onClick={() => selectQuestion(idx)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'border-l-4 border-primary bg-primary/5'
                  : 'border-l-4 border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 mt-0.5 flex-shrink-0">
                  {q.order}
                </span>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium mb-1 ${badgeColor}`}>
                    {q.questionType}
                  </span>
                  <p className="text-xs text-gray-700 truncate">{displayText || '(no text)'}</p>
                </div>
              </div>

              {/* Action buttons — visible on hover or when selected */}
              <div className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); moveQuestionUp(idx); }}
                  disabled={idx === 0}
                  title="Move up"
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveQuestionDown(idx); }}
                  disabled={idx === questions.length - 1}
                  title="Move down"
                  className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); duplicateQuestion(idx); }}
                  title="Duplicate"
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}
                  title="Delete"
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add question button */}
      <div className="p-3 border-t border-gray-200 relative">
        <button
          onClick={() => setAddMenuOpen((v) => !v)}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors font-medium"
        >
          + Add Question
        </button>

        {addMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-72 overflow-y-auto z-10">
            {QUESTION_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                  {group.label}
                </div>
                {group.types.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => { addQuestion(type); setAddMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionListPanel;
