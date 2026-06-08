// components/configs/AudioConfig.tsx
import React from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const AudioConfig: React.FC<Props> = ({ question }) => {
  const maxSec = question.config.maxAudioDurationSec;

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 text-center select-none pointer-events-none">
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 3a4 4 0 014 4v4a4 4 0 01-8 0V7a4 4 0 014-4z" />
      </svg>
      <span className="text-sm text-gray-400">Respondent records or uploads an audio clip</span>
      {maxSec && (
        <span className="text-xs text-gray-300">Max {maxSec}s</span>
      )}
    </div>
  );
};

export default AudioConfig;
