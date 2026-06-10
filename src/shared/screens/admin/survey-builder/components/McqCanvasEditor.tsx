// components/McqCanvasEditor.tsx
//
// Typeform-style canvas editor for MCQ_SINGLE and MCQ_MULTIPLE questions.
// Fixed-width option cards with letter labels, drag handles, and inline editing.

import React, { useState, useRef } from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SPECIAL_VALUES = new Set(['others', 'all_of_above']);

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const McqCanvasEditor: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { addOption, removeOption } = useSurveyBuilderStore();
  const { setQuestionConfig, setQuestionTranslation } = useSurveyBuilderStore.getState();

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  // Tracks which displayIdx's drag handle is currently pressed — only that row may initiate a drag
  const canDragRef = useRef<number | null>(null);

  const options = question.config.options ?? [];
  const regularOptions = options.filter((o) => !SPECIAL_VALUES.has(o.value));
  const specialOptions = options.filter((o) => SPECIAL_VALUES.has(o.value));

  const handleLabelChange = (optIdx: number, value: string) => {
    if (lang === 'en') {
      const next = [...options];
      next[optIdx] = { ...next[optIdx], label: value };
      setQuestionConfig(qIdx, { options: next });
    } else {
      const tOpts = [...(question.translations.ta.options ?? options.map((o) => ({ ...o, label: '' })))];
      tOpts[optIdx] = { ...tOpts[optIdx], label: value };
      setQuestionTranslation(qIdx, 'ta', { options: tOpts });
    }
  };

  const handleDrop = (targetDisplayIdx: number) => {
    if (dragIdx === null || dragIdx === targetDisplayIdx) return;
    const newRegular = [...regularOptions];
    const [moved] = newRegular.splice(dragIdx, 1);
    newRegular.splice(targetDisplayIdx, 0, moved);
    setQuestionConfig(qIdx, { options: [...newRegular, ...specialOptions] });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="space-y-1.5">
      {regularOptions.map((opt, displayIdx) => {
        const optIdx = options.indexOf(opt);
        const label =
          lang === 'en'
            ? opt.label
            : (question.translations.ta.options?.[optIdx]?.label ?? '');
        const letter = LETTERS[displayIdx] ?? String(displayIdx + 1);
        const isDragOver = dragOverIdx === displayIdx && dragIdx !== null && dragIdx !== displayIdx;

        return (
          <div
            key={optIdx}
            className="flex items-center gap-2 group"
            draggable
            onDragStart={(e) => {
              if (canDragRef.current !== displayIdx) { e.preventDefault(); return; }
              e.dataTransfer.effectAllowed = 'move';
              setDragIdx(displayIdx);
            }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverIdx(displayIdx); }}
            onDrop={(e) => { e.preventDefault(); handleDrop(displayIdx); }}
            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); canDragRef.current = null; }}
          >
            {/* Drag handle — mousedown arms the drag; only this row may start dragging */}
            <button
              type="button"
              className="text-outline/40 hover:text-outline cursor-grab active:cursor-grabbing flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              tabIndex={-1}
              title="Drag to reorder"
              onMouseDown={() => { canDragRef.current = displayIdx; }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="5" cy="3" r="1.2" />
                <circle cx="11" cy="3" r="1.2" />
                <circle cx="5" cy="8" r="1.2" />
                <circle cx="11" cy="8" r="1.2" />
                <circle cx="5" cy="13" r="1.2" />
                <circle cx="11" cy="13" r="1.2" />
              </svg>
            </button>

            {/* Option card — fluid up to 240px */}
            <div className={`flex-1 min-w-0 max-w-[240px] flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 transition-colors ${
              isDragOver ? 'border border-primary shadow-sm' : 'border border-outline-variant hover:border-outline-variant'
            }`}>
              {/* Letter label — plain text, no box */}
              <span className="flex-shrink-0 text-sm font-medium text-primary/70 w-4 text-center">
                {letter}
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(optIdx, e.target.value)}
                placeholder={lang === 'en' ? `Option ${displayIdx + 1}` : 'Tamil label'}
                className="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder-gray-300 focus:outline-none"
              />
            </div>

            {/* Remove icon — outside card, right, visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => removeOption(qIdx, optIdx)}
                disabled={regularOptions.length <= 1}
                title="Remove option"
                className="text-outline hover:text-red-500 p-0.5 rounded transition-colors disabled:opacity-20"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeWidth={1.5} d="M9 9l6 6M15 9l-6 6" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      {/* Special options (All of above / Others) — read-only pinned rows */}
      {specialOptions.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2 pl-[1.375rem]">
          <div className="flex-1 min-w-0 max-w-[240px] flex items-center gap-2 bg-surface-container-low border border-dashed border-outline-variant rounded-lg px-3 py-2 opacity-60">
            <span className="flex-shrink-0 text-sm font-medium text-outline/50 w-4 text-center">—</span>
            <span className="text-sm text-outline">{opt.label}</span>
          </div>
        </div>
      ))}

      {/* Exclusive "None of the above" row */}
      {question.config.hasExclusiveOption && (
        <div className="flex items-center gap-2 pl-[1.375rem]">
          <div className="flex-1 min-w-0 max-w-[240px] flex items-center gap-2 bg-surface-container-low border border-dashed border-outline-variant rounded-lg px-3 py-2 opacity-60">
            <span className="flex-shrink-0 text-sm font-medium text-outline/50 w-4 text-center">—</span>
            <span className="text-sm text-outline">
              {question.config.exclusiveOptionLabel || 'None of the above'}
            </span>
          </div>
        </div>
      )}

      {/* Add choice link — aligned with card left edge */}
      <div className="pl-[1.375rem] pt-1">
        <button
          type="button"
          onClick={() => addOption(qIdx)}
          className="text-sm text-blue-400 hover:text-blue-600 underline underline-offset-2 transition-colors"
        >
          Add choice
        </button>
      </div>
    </div>
  );
};

export default McqCanvasEditor;
