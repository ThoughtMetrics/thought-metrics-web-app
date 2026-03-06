// components/ConditionalLogicConfig.tsx

import React from 'react';
import type { IBuilderQuestion, IBuilderShowIfCondition } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const OPERATORS: { value: IBuilderShowIfCondition['operator']; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
];

const emptyCondition = (firstOtherId: string): IBuilderShowIfCondition => ({
  questionId: firstOtherId,
  operator: 'equals',
  value: '',
});

const ConditionalLogicConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { questions, setQuestionConfig } = useSurveyBuilderStore();
  const otherQuestions = questions.filter((_, i) => i !== qIdx);

  // Normalise: always work with an array of conditions internally
  const conditions: IBuilderShowIfCondition[] = question.config.showIfAll?.length
    ? question.config.showIfAll
    : question.config.showIf
    ? [question.config.showIf]
    : [];

  const isEnabled = conditions.length > 0;

  const saveConditions = (next: IBuilderShowIfCondition[]) => {
    if (next.length === 0) {
      setQuestionConfig(qIdx, { showIf: undefined, showIfAll: undefined });
    } else if (next.length === 1) {
      setQuestionConfig(qIdx, { showIf: next[0], showIfAll: undefined });
    } else {
      setQuestionConfig(qIdx, { showIf: undefined, showIfAll: next });
    }
  };

  const handleToggle = () => {
    if (isEnabled) {
      saveConditions([]);
    } else {
      saveConditions([emptyCondition(otherQuestions[0]?.id ?? '')]);
    }
  };

  const updateCondition = (idx: number, partial: Partial<IBuilderShowIfCondition>) => {
    const next = conditions.map((c, i) => (i === idx ? { ...c, ...partial } : c));
    saveConditions(next);
  };

  const addCondition = () => {
    saveConditions([...conditions, emptyCondition(otherQuestions[0]?.id ?? '')]);
  };

  const removeCondition = (idx: number) => {
    const next = conditions.filter((_, i) => i !== idx);
    saveConditions(next);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Conditional Logic</span>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            isEnabled ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
              isEnabled ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-2 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">
            Show this question if {conditions.length > 1 ? 'ALL of the following are true:' : ':'}
          </p>

          {conditions.map((cond, idx) => (
            <div key={idx} className="space-y-1.5 pb-2 border-b border-gray-200 last:border-0 last:pb-0">
              {conditions.length > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Condition {idx + 1}</span>
                  <button
                    onClick={() => removeCondition(idx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-600 mb-1">Question</label>
                <select
                  value={cond.questionId}
                  onChange={(e) => updateCondition(idx, { questionId: e.target.value })}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="">Select a question</option>
                  {otherQuestions.map((q) => (
                    <option key={q.id} value={q.id}>
                      Q{q.order}: {q.text || q.translations.en.text || q.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Operator</label>
                <select
                  value={cond.operator}
                  onChange={(e) =>
                    updateCondition(idx, { operator: e.target.value as IBuilderShowIfCondition['operator'] })
                  }
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Value</label>
                <input
                  type="text"
                  value={cond.value}
                  onChange={(e) => updateCondition(idx, { value: e.target.value })}
                  placeholder="Expected value"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addCondition}
            className="w-full text-xs text-primary hover:text-primary/80 font-medium py-1 border border-dashed border-primary/40 rounded hover:border-primary/70 transition-colors"
          >
            + Add condition (AND)
          </button>
        </div>
      )}
    </div>
  );
};

export default ConditionalLogicConfig;
