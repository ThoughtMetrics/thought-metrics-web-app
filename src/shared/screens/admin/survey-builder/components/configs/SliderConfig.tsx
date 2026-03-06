// components/configs/SliderConfig.tsx

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const SliderConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const { config, questionType } = question;

  if (questionType === QuestionType.MULTI_SLIDER) {
    const sliders = config.sliders ?? [];
    return (
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">Sliders</label>
            <button
              onClick={() => {
                const n = sliders.length + 1;
                setQuestionConfig(qIdx, {
                  sliders: [...sliders, { value: `s${n}`, label: `Slider ${n}` }],
                });
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              + Add Slider
            </button>
          </div>
          <div className="space-y-2">
            {sliders.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => {
                    const next = [...sliders];
                    next[i] = { ...next[i], value: e.target.value };
                    setQuestionConfig(qIdx, { sliders: next });
                  }}
                  placeholder="key"
                  className="w-20 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  type="text"
                  value={s.label}
                  onChange={(e) => {
                    const next = [...sliders];
                    next[i] = { ...next[i], label: e.target.value };
                    setQuestionConfig(qIdx, { sliders: next });
                  }}
                  placeholder="Label"
                  className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => {
                    setQuestionConfig(qIdx, { sliders: sliders.filter((_, idx) => idx !== i) });
                  }}
                  disabled={sliders.length <= 1}
                  className="text-red-400 hover:text-red-600 disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
            <input
              type="number"
              value={config.min ?? 0}
              onChange={(e) => setQuestionConfig(qIdx, { min: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
            <input
              type="number"
              value={config.max ?? 100}
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
      </div>
    );
  }

  // DOUBLE_SLIDER
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
        <input
          type="number"
          value={config.min ?? 0}
          onChange={(e) => setQuestionConfig(qIdx, { min: Number(e.target.value) })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
        <input
          type="number"
          value={config.max ?? 100}
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
  );
};

export default SliderConfig;
