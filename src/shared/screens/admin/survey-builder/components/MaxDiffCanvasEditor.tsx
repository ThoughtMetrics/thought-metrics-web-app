// components/MaxDiffCanvasEditor.tsx
//
// Typeform-style canvas editor for MAX_DIFF questions.
// Full-width choice cards with letter labels, drag handles, and inline editing.

import React, { useState, useRef } from 'react';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const slugifyKey = (v: string) =>
  v.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 30);

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const MaxDiffCanvasEditor: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { addOption, removeOption } = useSurveyBuilderStore();
  const { setQuestionConfig, setQuestionTranslation } = useSurveyBuilderStore.getState();

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const canDragRef = useRef<number | null>(null);

  const options = question.config.options ?? [];

  const handleLabelChange = (optIdx: number, value: string) => {
    if (lang === 'en') {
      const next = [...options];
      next[optIdx] = {
        ...next[optIdx],
        label: value,
        value: slugifyKey(value) || `opt${optIdx + 1}`,
      };
      setQuestionConfig(qIdx, { options: next });
    } else {
      const tOpts = [...(question.translations.ta.options ?? options.map((o) => ({ ...o, label: '' })))];
      tOpts[optIdx] = { ...tOpts[optIdx], label: value };
      setQuestionTranslation(qIdx, 'ta', { options: tOpts });
    }
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...options];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    setQuestionConfig(qIdx, { options: next });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  return (
    <div className="space-y-1.5">
      {options.map((opt, i) => {
        const label = lang === 'en'
          ? opt.label
          : (question.translations.ta.options?.[i]?.label ?? '');
        const letter = LETTERS[i] ?? String(i + 1);
        const isDragOver = dragOverIdx === i && dragIdx !== null && dragIdx !== i;

        return (
          <div
            key={i}
            className="flex items-center gap-2 group"
            draggable
            onDragStart={(e) => {
              if (canDragRef.current !== i) { e.preventDefault(); return; }
              e.dataTransfer.effectAllowed = 'move';
              setDragIdx(i);
            }}
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverIdx(i); }}
            onDrop={(e) => { e.preventDefault(); handleDrop(i); }}
            onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); canDragRef.current = null; }}
          >
            {/* Drag handle — mousedown arms the drag */}
            <button
              type="button"
              className="text-outline/40 hover:text-outline cursor-grab active:cursor-grabbing flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              tabIndex={-1}
              title="Drag to reorder"
              onMouseDown={() => { canDragRef.current = i; }}
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

            {/* Choice card — full width */}
            <div className={`flex-1 min-w-0 flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 transition-colors ${
              isDragOver ? 'border border-primary shadow-sm' : 'border border-outline-variant hover:border-outline'
            }`}>
              <span className="flex-shrink-0 text-sm font-medium text-primary/70 w-4 text-center">
                {letter}
              </span>
              <input
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(i, e.target.value)}
                placeholder={lang === 'en' ? `Choice ${letter}` : 'Tamil label'}
                className="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder-outline/40 focus:outline-none"
              />
            </div>

            {/* Remove icon — outside card, right, visible on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => removeOption(qIdx, i)}
                disabled={options.length <= 1}
                title="Remove choice"
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

      {/* Add choice link */}
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

export default MaxDiffCanvasEditor;
