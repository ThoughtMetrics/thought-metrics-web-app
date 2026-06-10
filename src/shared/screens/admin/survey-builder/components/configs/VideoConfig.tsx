// components/configs/VideoConfig.tsx
import React from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const VideoConfig: React.FC<Props> = ({ question }) => {
  const maxSec = question.config.maxVideoDurationSec;

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-outline-variant rounded-xl px-6 py-8 text-center select-none pointer-events-none">
      <svg className="w-8 h-8 text-outline/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
      </svg>
      <span className="text-sm text-outline">Respondent records or uploads a video</span>
      {maxSec && (
        <span className="text-xs text-outline/40">Max {maxSec}s</span>
      )}
    </div>
  );
};

export default VideoConfig;
