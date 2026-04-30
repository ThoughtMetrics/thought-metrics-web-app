// components/SkipLogicConfig.tsx
// Navigation-based skip rules — distinct from showIf visibility logic.
// Redirects respondent to a specific question or end of survey.

import React from 'react';
import type {
  IBuilderQuestion,
  IBuilderSkipRule,
  IBuilderShowIfCondition,
} from '@/core/types/survey-builder.type';
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

const emptyCondition = (firstOtherId: string): IBuilderShowIfCondition => ({
  questionId: firstOtherId,
  operator: 'equals',
  value: '',
});

const newRule = (_firstOtherId?: string): IBuilderSkipRule => ({
  id: `skip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  timing: 'post',
  conditions: [],
  conditionMode: 'and',
  jumpToQuestionId: 'END',
});

const SkipLogicConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { questions, setQuestionConfig } = useSurveyBuilderStore();
  const otherQuestions = questions.filter((_, i) => i !== qIdx);

  const rules: IBuilderSkipRule[] = question.config.skipRules ?? [];
  const isEnabled = rules.length > 0;

  const saveRules = (next: IBuilderSkipRule[]) => {
    setQuestionConfig(qIdx, { skipRules: next.length > 0 ? next : undefined });
  };

  const handleToggle = () => {
    if (isEnabled) {
      saveRules([]);
    } else {
      saveRules([newRule()]);
    }
  };

  const addRule = () => saveRules([...rules, newRule()]);
  const removeRule = (rIdx: number) => saveRules(rules.filter((_, i) => i !== rIdx));

  const updateRule = (rIdx: number, partial: Partial<IBuilderSkipRule>) =>
    saveRules(rules.map((r, i) => (i === rIdx ? { ...r, ...partial } : r)));

  const addCondition = (rIdx: number) => {
    const rule = rules[rIdx];
    const conds = rule.conditions ?? [];
    updateRule(rIdx, { conditions: [...conds, emptyCondition(otherQuestions[0]?.id ?? '')] });
  };

  const removeCondition = (rIdx: number, cIdx: number) => {
    const rule = rules[rIdx];
    updateRule(rIdx, { conditions: (rule.conditions ?? []).filter((_, i) => i !== cIdx) });
  };

  const updateCondition = (rIdx: number, cIdx: number, partial: Partial<IBuilderShowIfCondition>) => {
    const rule = rules[rIdx];
    updateRule(rIdx, {
      conditions: (rule.conditions ?? []).map((c, i) => (i === cIdx ? { ...c, ...partial } : c)),
    });
  };

  return (
    <div className="space-y-3 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Skip Logic
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
        <div className="space-y-3">
          {rules.map((rule, rIdx) => {
            const destQuestion = questions.find((q) => q.id === rule.jumpToQuestionId);
            const isBackwardJump =
              destQuestion !== undefined && destQuestion.order < question.order;

            return (
              <div key={rule.id} className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
                {/* Rule header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Rule {rIdx + 1}</span>
                  <button
                    onClick={() => removeRule(rIdx)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Timing */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Timing</label>
                  <div className="flex gap-1">
                    {(['post', 'pre'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateRule(rIdx, { timing: t })}
                        className={`flex-1 text-xs py-1 rounded font-medium border transition-colors ${
                          rule.timing === t
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary/30'
                        }`}
                      >
                        {t === 'post' ? 'After answering' : 'Before showing'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unconditional toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!rule.conditions?.length}
                    onChange={(e) =>
                      updateRule(rIdx, { conditions: e.target.checked ? [] : [emptyCondition(otherQuestions[0]?.id ?? '')] })
                    }
                    className="accent-primary"
                  />
                  <span className="text-xs text-gray-600">Unconditional (always jump)</span>
                </label>

                {/* Conditions */}
                {(rule.conditions?.length ?? 0) > 0 && (
                  <div className="space-y-2 bg-white rounded-md border border-primary/10 p-2">
                    {(rule.conditions ?? []).length >= 2 && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Match:</span>
                        {(['and', 'or'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => updateRule(rIdx, { conditionMode: m })}
                            className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
                              (rule.conditionMode ?? 'and') === m
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {m === 'and' ? 'ALL (AND)' : 'ANY (OR)'}
                          </button>
                        ))}
                      </div>
                    )}

                    {(rule.conditions ?? []).map((cond, cIdx) => {
                      const parentQ = otherQuestions.find((q) => q.id === cond.questionId);
                      return (
                        <div
                          key={cIdx}
                          className="space-y-1.5 pb-2 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          {(rule.conditions ?? []).length > 1 && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Condition {cIdx + 1}</span>
                              <button
                                onClick={() => removeCondition(rIdx, cIdx)}
                                className="text-xs text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          <select
                            value={cond.questionId}
                            onChange={(e) => updateCondition(rIdx, cIdx, { questionId: e.target.value, value: '' })}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                          >
                            <option value="">Select question</option>
                            {otherQuestions.map((q) => (
                              <option key={q.id} value={q.id}>
                                Q{q.order}: {q.text || q.translations.en.text || q.id}
                              </option>
                            ))}
                          </select>

                          <select
                            value={cond.operator}
                            onChange={(e) =>
                              updateCondition(rIdx, cIdx, {
                                operator: e.target.value as IBuilderShowIfCondition['operator'],
                              })
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                          >
                            {OPERATORS.map((op) => (
                              <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                          </select>

                          {getValueField(cond, parentQ, (value) =>
                            updateCondition(rIdx, cIdx, { value }),
                          )}
                        </div>
                      );
                    })}

                    <button
                      onClick={() => addCondition(rIdx)}
                      className="w-full text-xs text-primary hover:text-primary/80 font-medium py-1 border border-dashed border-primary/30 rounded transition-colors"
                    >
                      + Add condition
                    </button>
                  </div>
                )}

                {/* Jump to */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Jump to</label>
                  <select
                    value={rule.jumpToQuestionId}
                    onChange={(e) => updateRule(rIdx, { jumpToQuestionId: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    <option value="END">End of Survey</option>
                    {otherQuestions.map((q) => (
                      <option key={q.id} value={q.id}>
                        Q{q.order}: {q.text || q.translations.en.text || q.id}
                      </option>
                    ))}
                  </select>
                </div>

                {isBackwardJump && (
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-primary/10 border border-primary/30 rounded text-xs text-primary">
                    <span>⚠</span>
                    <span>Backward skip — destination is before this question.</span>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={addRule}
            className="w-full text-xs text-primary hover:text-primary/80 font-medium py-1.5 border border-dashed border-primary/30 rounded hover:border-primary/60 transition-colors"
          >
            + Add skip rule
          </button>
        </div>
      )}
    </div>
  );
};

export default SkipLogicConfig;
