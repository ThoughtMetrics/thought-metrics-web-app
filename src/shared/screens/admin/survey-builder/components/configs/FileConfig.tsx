// components/configs/FileConfig.tsx

import React from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const FILE_TYPES = ['pdf', 'jpg', 'png', 'doc', 'mp4'];

const FileConfig: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const accepted = question.config.acceptedFileTypes ?? [];

  const toggle = (type: string) => {
    const next = accepted.includes(type)
      ? accepted.filter((t) => t !== type)
      : [...accepted, type];
    setQuestionConfig(qIdx, { acceptedFileTypes: next });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">Accepted File Types</label>
        <div className="flex flex-wrap gap-2">
          {FILE_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted.includes(type)}
                onChange={() => toggle(type)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-xs font-medium text-gray-700 uppercase">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Max File Size (MB)</label>
        <input
          type="number"
          min={1}
          max={100}
          value={question.config.maxFileSizeMb ?? 10}
          onChange={(e) => setQuestionConfig(qIdx, { maxFileSizeMb: Number(e.target.value) })}
          className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
};

export default FileConfig;
