// components/configs/ScaleConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const ScaleConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const { config, questionType } = question;

  if (questionType === QuestionType.RATING) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Max Rating</label>
        <input
          type="number"
          min={2}
          max={10}
          value={config.ratingMax ?? 5}
          onChange={(e) => setQuestionConfig(qIdx, { ratingMax: Number(e.target.value) })}
          className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
          <input
            type="number"
            value={config.min ?? 1}
            onChange={(e) => setQuestionConfig(qIdx, { min: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
          <input
            type="number"
            value={config.max ?? 5}
            onChange={(e) => setQuestionConfig(qIdx, { max: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Step</label>
          <input
            type="number"
            min={1}
            value={config.step ?? 1}
            onChange={(e) => setQuestionConfig(qIdx, { step: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min Label ({lang})</label>
          <input
            type="text"
            value={config.minLabel ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { minLabel: e.target.value })}
            placeholder="e.g. Strongly Disagree"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Max Label ({lang})</label>
          <input
            type="text"
            value={config.maxLabel ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { maxLabel: e.target.value })}
            placeholder="e.g. Strongly Agree"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ScaleConfig;
