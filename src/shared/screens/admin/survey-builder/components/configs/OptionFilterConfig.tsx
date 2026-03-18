import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props { question: IBuilderQuestion; qIdx: number; }

const MCQ_TYPES = new Set([QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE]);

const OptionFilterConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { questions, setQuestionConfig } = useSurveyBuilderStore();

  const parentCandidates = questions.filter(
    (q, i) => i !== qIdx && MCQ_TYPES.has(q.questionType) && (q.config.options?.length ?? 0) > 0
  );

  const filter = question.config.optionFilter;
  const isEnabled = !!filter;
  const childOptions = question.config.options ?? [];

  const handleToggle = () => {
    if (isEnabled) {
      setQuestionConfig(qIdx, { optionFilter: undefined });
    } else {
      const firstParent = parentCandidates[0];
      if (!firstParent) return;
      setQuestionConfig(qIdx, { optionFilter: { questionId: firstParent.id, map: {} } });
    }
  };

  const handleParentChange = (questionId: string) => {
    setQuestionConfig(qIdx, { optionFilter: { questionId, map: {} } });
  };

  const toggleChildOption = (parentValue: string, childValue: string) => {
    const currentMap = { ...(filter?.map ?? {}) };
    const current: string[] = currentMap[parentValue] ?? [];
    const next = current.includes(childValue)
      ? current.filter((v) => v !== childValue)
      : [...current, childValue];
    if (next.length === 0) {
      delete currentMap[parentValue];
    } else {
      currentMap[parentValue] = next;
    }
    setQuestionConfig(qIdx, { optionFilter: { ...filter!, map: currentMap } });
  };

  const parentQ = filter ? questions.find((q) => q.id === filter.questionId) : undefined;
  const parentOptions = parentQ?.config.options ?? [];

  return (
    <div className="space-y-3 pt-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          Option Filter
        </span>
        <button
          onClick={handleToggle}
          disabled={!isEnabled && parentCandidates.length === 0}
          title={parentCandidates.length === 0 ? 'No MCQ questions available as parent' : ''}
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
        <div className="space-y-3 bg-gray-50 rounded-lg p-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Based on question</label>
            <select
              value={filter.questionId}
              onChange={(e) => handleParentChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
            >
              {parentCandidates.map((q) => (
                <option key={q.id} value={q.id}>
                  Q{q.order}: {q.translations.en.text || q.text || q.id}
                </option>
              ))}
            </select>
          </div>

          {childOptions.length === 0 && (
            <p className="text-xs text-amber-600">Add options to this question first.</p>
          )}

          {childOptions.length > 0 &&
            parentOptions.map((parentOpt) => {
              const allowedValues: string[] = filter.map[parentOpt.value] ?? [];
              return (
                <div
                  key={parentOpt.value}
                  className="space-y-1.5 pb-2 border-b border-gray-200 last:border-0 last:pb-0"
                >
                  <p className="text-xs font-medium text-gray-700">
                    When &quot;{parentOpt.label}&quot;
                    <span className="ml-1 text-gray-400 font-normal">({parentOpt.value})</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {childOptions
                      .filter((o) => o.value !== 'others')
                      .map((childOpt) => (
                        <label key={childOpt.value} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allowedValues.includes(childOpt.value)}
                            onChange={() => toggleChildOption(parentOpt.value, childOpt.value)}
                            className="w-3.5 h-3.5 accent-primary"
                          />
                          <span className="text-xs text-gray-700">{childOpt.label}</span>
                        </label>
                      ))}
                  </div>
                  {allowedValues.length === 0 && (
                    <p className="text-[10px] text-gray-400 italic">No options selected → all shown</p>
                  )}
                </div>
              );
            })}
          <p className="text-[10px] text-gray-400">
            If parent answer has no mapping, all options are shown.
          </p>
        </div>
      )}
    </div>
  );
};

export default OptionFilterConfig;
