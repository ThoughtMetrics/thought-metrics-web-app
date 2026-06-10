// components/PipeTokenButton.tsx
//
// Reusable "insert answer reference" button for the survey builder.
//
// Renders a small { } icon button. Clicking opens a dropdown listing only the
// eligible previous questions. Selecting one calls onInsert("{{N}}") where N
// is the question's 1-based display order — readable and consistent with how
// questions are numbered in the survey UI.
//
// ELIGIBLE SOURCE TYPES (can be piped from):
//   - Text / Long Text
//   - Single Choice / Multiple Choice
//   - Image Choice  (File question with image file types)
//   - Rating / Likert Scale / Single Slider (Scale) / Double Slider
//
// NOT eligible: Number, Email, Phone, Date, Currency, Multi-Slider, Matrix,
//               Ranking, Max Diff, Constant Sum, plain File upload.

import React, { useRef, useEffect } from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';

// ── Pipeable type gate ───────────────────────────────────────────────────────

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif']);

const ALWAYS_PIPEABLE = new Set<QuestionType>([
  QuestionType.TEXT,
  QuestionType.TEXTAREA,
  QuestionType.MCQ_SINGLE,
  QuestionType.MCQ_MULTIPLE,
  QuestionType.RATING,
  QuestionType.LIKERT_SCALE,
  QuestionType.SCALE,
  QuestionType.DOUBLE_SLIDER,
]);

/** Returns true if this question's answer can be piped into other questions. */
function isPipeable(q: IBuilderQuestion): boolean {
  if (ALWAYS_PIPEABLE.has(q.questionType)) return true;
  // FILE question configured as image choice
  if (q.questionType === QuestionType.FILE) {
    const accepted: string[] = (q.config.acceptedFileTypes ?? []) as string[];
    return accepted.some((ext) => IMAGE_EXTENSIONS.has(ext.toLowerCase()));
  }
  return false;
}

/** Human-readable type label shown beside Q number in the dropdown. */
function typeLabel(q: IBuilderQuestion): string {
  switch (q.questionType) {
    case QuestionType.TEXT:       return 'Text';
    case QuestionType.TEXTAREA:   return 'Long text';
    case QuestionType.MCQ_SINGLE: return 'Single choice';
    case QuestionType.MCQ_MULTIPLE: return 'Multi choice';
    case QuestionType.RATING:     return 'Rating';
    case QuestionType.LIKERT_SCALE: return 'Likert';
    case QuestionType.SCALE:      return 'Scale';
    case QuestionType.DOUBLE_SLIDER: return 'Range';
    case QuestionType.FILE:       return 'Image choice';
    default:                      return q.questionType;
  }
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  /** All questions in the survey (filtered to eligible previous ones internally) */
  questions: IBuilderQuestion[];
  /** 0-based index of the question currently being edited */
  currentQuestionIndex: number;
  /** Called with "{{N}}" where N is the source question's 1-based order */
  onInsert: (token: string) => void;
  disabled?: boolean;
  title?: string;
}

const PipeTokenButton: React.FC<Props> = ({
  questions,
  currentQuestionIndex,
  onInsert,
  disabled = false,
  title = 'Insert answer from a previous question',
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only previous questions that are pipeable
  const eligibleQuestions = questions.filter(
    (q, i) => i < currentQuestionIndex && isPipeable(q)
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (q: IBuilderQuestion) => {
    // Token uses 1-based order so the stored value is human-readable: {{Q1}}, {{Q2}} …
    onInsert(`{{Q${q.order}}}`);
    setOpen(false);
  };

  const isDisabled = disabled || eligibleQuestions.length === 0;

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        type="button"
        title={isDisabled ? 'No eligible previous questions to pipe from' : title}
        disabled={isDisabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-0.5 text-xs px-1.5 py-1 rounded border transition-colors flex-shrink-0 ${
          isDisabled
            ? 'border-outline-variant text-outline/40 cursor-not-allowed'
            : open
            ? 'border-primary text-primary bg-primary/10'
            : 'border-outline-variant text-outline hover:border-primary hover:text-primary'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Link / pipe icon */}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="font-medium leading-none">{'{ }'}</span>
      </button>

      {open && eligibleQuestions.length > 0 && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 right-0 w-64 bg-surface-container border border-outline-variant rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-3 py-1.5 border-b border-outline-variant/50 bg-surface-container-low">
            <p className="text-[10px] font-semibold text-outline uppercase tracking-wide">
              Insert answer from…
            </p>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {eligibleQuestions.map((q) => (
              <button
                key={q.id}
                type="button"
                role="option"
                onClick={() => handleSelect(q)}
                className="w-full text-left px-3 py-2 hover:bg-primary/5 flex items-start gap-2.5 transition-colors group"
              >
                {/* Badge: shows {{N}} — the token that will be inserted */}
                <span className="flex-shrink-0 mt-0.5 text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-primary/10 text-primary leading-none">
                  {`{{Q${q.order}}}`}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs text-on-surface-variant truncate leading-snug">
                    {q.text || q.translations.en.text || `Question ${q.order}`}
                  </span>
                  <span className="block text-[10px] text-outline leading-none mt-0.5">
                    {typeLabel(q)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PipeTokenButton;
