// components/ConditionalLogicConfig.tsx

import React from 'react';
import type { IBuilderQuestion, IBuilderShowIfCondition } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { QuestionType } from '@/core/types/survey.type';

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

function getValueField(
  cond: IBuilderShowIfCondition,
  parentQ: IBuilderQuestion | undefined,
  onChange: (value: string) => void,
): React.ReactNode {
  const cls =
    'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white';

  const isMcq =
    parentQ?.questionType === QuestionType.MCQ_SINGLE ||
    parentQ?.questionType === QuestionType.MCQ_MULTIPLE;
  if (isMcq && (parentQ?.config.options?.length ?? 0) > 0) {
    return (
      <select value={cond.value} onChange={(e) => onChange(e.target.value)} className={cls}>
        <option value="">Select a value</option>
        {parentQ!.config.options!.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label} ({opt.value})
          </option>
        ))}
      </select>
    );
  }

  const isRating = parentQ?.questionType === QuestionType.RATING;
  const isScale =
    parentQ?.questionType === QuestionType.SCALE ||
    parentQ?.questionType === QuestionType.LIKERT_SCALE;
  if (isRating || isScale) {
    const min = isRating ? 1 : (parentQ?.config.min ?? 1);
    const max = isRating
      ? (parentQ?.config.ratingMax ?? 5)
      : (parentQ?.config.max ?? 10);
    return (
      <input
        type="number"
        value={cond.value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        placeholder={`${min}–${max}`}
        className={cls}
      />
    );
  }

  return (
    <input
      type="text"
      value={cond.value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Expected value"
      className={cls}
    />
  );
}

const ConditionalLogicConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { questions, setQuestionConfig, conditionalLogicHighlight } = useSurveyBuilderStore();
  const otherQuestions = questions.filter((_, i) => i !== qIdx);

  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (conditionalLogicHighlight === 0) return;
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const el = sectionRef.current;
    if (el) {
      el.classList.add('ring-2', 'ring-primary', 'ring-offset-1');
      const timer = setTimeout(() => {
        el.classList.remove('ring-2', 'ring-primary', 'ring-offset-1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [conditionalLogicHighlight]);

  // Derive current mode from stored config
  const isOrMode =
    !!(question.config.showIfAny?.length) && !question.config.showIfAll?.length;

  const conditions: IBuilderShowIfCondition[] =
    question.config.showIfAll?.length  ? question.config.showIfAll  :
    question.config.showIfAny?.length  ? question.config.showIfAny  :
    question.config.showIf             ? [question.config.showIf]   : [];

  const isEnabled = conditions.length > 0;

  const saveConditions = (next: IBuilderShowIfCondition[], mode: 'and' | 'or') => {
    if (next.length === 0) {
      setQuestionConfig(qIdx, { showIf: undefined, showIfAll: undefined, showIfAny: undefined });
    } else if (next.length === 1) {
      setQuestionConfig(qIdx, { showIf: next[0], showIfAll: undefined, showIfAny: undefined });
    } else if (mode === 'or') {
      setQuestionConfig(qIdx, { showIf: undefined, showIfAll: undefined, showIfAny: next });
    } else {
      setQuestionConfig(qIdx, { showIf: undefined, showIfAll: next, showIfAny: undefined });
    }
  };

  const handleToggle = () => {
    if (isEnabled) {
      saveConditions([], 'and');
    } else {
      saveConditions([emptyCondition(otherQuestions[0]?.id ?? '')], 'and');
    }
  };

  const addCondition = () =>
    saveConditions([...conditions, emptyCondition(otherQuestions[0]?.id ?? '')], isOrMode ? 'or' : 'and');

  const removeCondition = (idx: number) =>
    saveConditions(conditions.filter((_, i) => i !== idx), isOrMode ? 'or' : 'and');

  const updateCondition = (idx: number, partial: Partial<IBuilderShowIfCondition>) =>
    saveConditions(
      conditions.map((c, i) => (i === idx ? { ...c, ...partial } : c)),
      isOrMode ? 'or' : 'and',
    );

  const descriptionText = conditions.length > 1
    ? `Show this question if ${isOrMode ? 'ANY of the following are true:' : 'ALL of the following are true:'}`
    : 'Show this question if:';

  return (
    <div ref={sectionRef} className="space-y-3 pt-3 border-t border-gray-200 transition-all rounded">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Conditional Logic
        </span>
        <button
          onClick={handleToggle}
          disabled={!isEnabled && otherQuestions.length === 0}
          title={!isEnabled && otherQuestions.length === 0 ? 'Add more questions first' : ''}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
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
          <p className="text-xs text-gray-500">{descriptionText}</p>

          {conditions.length >= 2 && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-xs text-gray-500">Match:</span>
              <button
                onClick={() => saveConditions(conditions, 'and')}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                  !isOrMode
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ALL (AND)
              </button>
              <button
                onClick={() => saveConditions(conditions, 'or')}
                className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                  isOrMode
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                ANY (OR)
              </button>
            </div>
          )}

          {conditions.map((cond, idx) => {
            const parentQ = otherQuestions.find((q) => q.id === cond.questionId);
            return (
              <div
                key={idx}
                className="space-y-1.5 pb-2 border-b border-gray-200 last:border-0 last:pb-0"
              >
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
                    onChange={(e) => updateCondition(idx, { questionId: e.target.value, value: '' })}
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
                      updateCondition(idx, {
                        operator: e.target.value as IBuilderShowIfCondition['operator'],
                      })
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    {OPERATORS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Value</label>
                  {getValueField(cond, parentQ, (value) => updateCondition(idx, { value }))}
                </div>
              </div>
            );
          })}

          <button
            onClick={addCondition}
            className="w-full text-xs text-primary hover:text-primary/80 font-medium py-1 border border-dashed border-primary/40 rounded hover:border-primary/70 transition-colors"
          >
            + Add condition
          </button>
        </div>
      )}
    </div>
  );
};

export default ConditionalLogicConfig;
