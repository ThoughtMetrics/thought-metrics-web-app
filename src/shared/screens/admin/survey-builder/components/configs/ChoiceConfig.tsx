// components/configs/ChoiceConfig.tsx

import React from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const ChoiceConfig: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { addOption, removeOption, updateOption } = useSurveyBuilderStore();
  const options = question.config.options ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">Options</label>
        <button
          onClick={() => addOption(qIdx)}
          className="text-xs text-primary hover:underline font-medium"
        >
          + Add Option
        </button>
      </div>

      <div className="space-y-2">
        {options.map((opt, optIdx) => (
          <div key={optIdx} className="flex gap-2 items-center">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                {optIdx === 0 && <div className="text-xs text-gray-400 mb-1">Value (key)</div>}
                <input
                  type="text"
                  value={opt.value}
                  onChange={(e) => updateOption(qIdx, optIdx, 'value', e.target.value)}
                  placeholder="opt1"
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                {optIdx === 0 && <div className="text-xs text-gray-400 mb-1">Label ({lang})</div>}
                <input
                  type="text"
                  value={lang === 'en' ? opt.label : (question.translations.ta.options?.[optIdx]?.label ?? '')}
                  onChange={(e) => {
                    if (lang === 'en') {
                      updateOption(qIdx, optIdx, 'label', e.target.value);
                    } else {
                      // Update TA translation options
                      const tOpts = [...(question.translations.ta.options ?? options.map(o => ({ ...o, label: '' })))];
                      tOpts[optIdx] = { ...tOpts[optIdx], label: e.target.value };
                      useSurveyBuilderStore.getState().setQuestionTranslation(qIdx, 'ta', { options: tOpts });
                    }
                  }}
                  placeholder={lang === 'en' ? 'Option label' : 'Tamil label'}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <button
              onClick={() => removeOption(qIdx, optIdx)}
              disabled={options.length <= 1}
              className="text-red-400 hover:text-red-600 disabled:opacity-30 flex-shrink-0"
              title="Remove option"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoiceConfig;
