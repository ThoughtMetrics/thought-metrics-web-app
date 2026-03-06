// components/configs/TextConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const TextConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { setQuestionTranslation, setQuestionConfig } = useSurveyBuilderStore();
  const t = question.translations[lang];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Placeholder</label>
        <input
          type="text"
          value={t.placeholder ?? ''}
          onChange={(e) => setQuestionTranslation(qIdx, lang, { placeholder: e.target.value })}
          placeholder="e.g. Enter your answer..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {question.questionType === QuestionType.NUMBER && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
            <input
              type="number"
              value={question.config.min ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { min: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
            <input
              type="number"
              value={question.config.max ?? ''}
              onChange={(e) => setQuestionConfig(qIdx, { max: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {question.questionType === QuestionType.CURRENCY && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Currency Code</label>
          <input
            type="text"
            value={question.config.currency ?? ''}
            onChange={(e) => setQuestionConfig(qIdx, { currency: e.target.value })}
            placeholder="e.g. INR, USD"
            maxLength={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
};

export default TextConfig;
