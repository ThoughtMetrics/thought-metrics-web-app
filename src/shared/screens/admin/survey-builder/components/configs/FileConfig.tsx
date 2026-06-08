// components/configs/FileConfig.tsx
// Visual-only dropzone placeholder for the FILE question canvas.
// Accepted types and max size are configured in the right QuestionConfigPanel.

import React from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const FileConfig: React.FC<Props> = ({ question }) => {
  const accepted = question.config.acceptedFileTypes ?? [];
  const maxMb = question.config.maxFileSizeMb ?? 10;

  return (
    <div className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-6 py-8 text-center select-none pointer-events-none">
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span className="text-sm text-gray-400">Drop files here or click to browse</span>
      <div className="flex flex-col items-center gap-0.5">
        {accepted.length > 0 && (
          <span className="text-xs text-gray-300 uppercase tracking-wide">{accepted.join(' · ')}</span>
        )}
        <span className="text-xs text-gray-300">Max {maxMb} MB</span>
      </div>
    </div>
  );
};

export default FileConfig;
