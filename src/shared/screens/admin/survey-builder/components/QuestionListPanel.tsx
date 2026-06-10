// components/QuestionListPanel.tsx

import React, { useEffect, useRef, useState } from 'react';
import { QuestionType } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

const QUESTION_GROUPS: {
  label: string;
  types: { type: QuestionType; label: string }[];
}[] = [
  {
    label: 'Text',
    types: [
      { type: QuestionType.TEXT, label: 'Short Text' },
      { type: QuestionType.TEXTAREA, label: 'Long Text' },
      { type: QuestionType.NUMBER, label: 'Number' },
      { type: QuestionType.EMAIL, label: 'Email' },
      { type: QuestionType.PHONE, label: 'Phone' },
      { type: QuestionType.DATE, label: 'Date' },
      { type: QuestionType.CURRENCY, label: 'Currency' },
      { type: QuestionType.FILE, label: 'File Upload' },
    ],
  },
  {
    label: 'Choice',
    types: [
      { type: QuestionType.MCQ_SINGLE, label: 'Single Choice' },
      { type: QuestionType.MCQ_MULTIPLE, label: 'Multiple Choice' },
      { type: QuestionType.RANKING, label: 'Ranking' },
    ],
  },
  {
    label: 'Scale',
    types: [
      { type: QuestionType.RATING, label: 'Star Rating' },
      { type: QuestionType.LIKERT_SCALE, label: 'Likert Scale' },
      { type: QuestionType.SCALE, label: 'Slider Scale' },
      { type: QuestionType.DOUBLE_SLIDER, label: 'Range Slider' },
      { type: QuestionType.MULTI_SLIDER, label: 'Multi Slider' },
    ],
  },
  {
    label: 'Grid',
    types: [
      { type: QuestionType.MATRIX, label: 'Matrix Grid' },
      { type: QuestionType.MAX_DIFF, label: 'Max Diff' },
      { type: QuestionType.CONSTANT_SUM, label: 'Constant Sum' },
    ],
  },
  {
    label: 'Pricing',
    types: [
      { type: QuestionType.GABOR_GRANGER, label: 'Gabor-Granger' },
    ],
  },
  {
    label: 'Display',
    types: [
      { type: QuestionType.TEXT_DISPLAY, label: 'Text / Graphic Display' },
    ],
  },
];

const TYPE_BADGE_COLORS: Partial<Record<QuestionType, string>> = {
  [QuestionType.TEXT]: 'bg-blue-100 text-blue-700',
  [QuestionType.TEXTAREA]: 'bg-blue-100 text-blue-700',
  [QuestionType.NUMBER]: 'bg-purple-100 text-purple-700',
  [QuestionType.EMAIL]: 'bg-blue-100 text-blue-700',
  [QuestionType.PHONE]: 'bg-blue-100 text-blue-700',
  [QuestionType.DATE]: 'bg-blue-100 text-blue-700',
  [QuestionType.CURRENCY]: 'bg-green-100 text-green-700',
  [QuestionType.MCQ_SINGLE]: 'bg-orange-100 text-orange-700',
  [QuestionType.MCQ_MULTIPLE]: 'bg-orange-100 text-orange-700',
  [QuestionType.RATING]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.LIKERT_SCALE]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.SCALE]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.DOUBLE_SLIDER]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.MULTI_SLIDER]: 'bg-yellow-100 text-yellow-700',
  [QuestionType.MATRIX]: 'bg-pink-100 text-pink-700',
  [QuestionType.RANKING]: 'bg-orange-100 text-orange-700',
  [QuestionType.MAX_DIFF]: 'bg-pink-100 text-pink-700',
  [QuestionType.CONSTANT_SUM]: 'bg-pink-100 text-pink-700',
  [QuestionType.GABOR_GRANGER]: 'bg-violet-100 text-violet-700',
  [QuestionType.FILE]: 'bg-surface-container-high text-on-surface-variant',
  [QuestionType.TEXT_DISPLAY]: 'bg-teal-100 text-teal-700',
};

const QuestionListPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    selectQuestion,
    addQuestion,
    insertQuestion,
    removeQuestion,
    duplicateQuestion,
    reorderQuestions,
  } = useSurveyBuilderStore();

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [insertMenuOpenAt, setInsertMenuOpenAt] = useState<number | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close add menu when clicking outside
  useEffect(() => {
    if (!addMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [addMenuOpen]);

  // Drag state
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    dragIndexRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    // Transparent 1×1 drag image so the card itself acts as the ghost
    const ghost = document.createElement('div');
    ghost.style.position = 'absolute';
    ghost.style.top = '-9999px';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragIndexRef.current !== null && idx !== dragOverIndex) {
      setDragOverIndex(idx);
    }
  };

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    const fromIdx = dragIndexRef.current;
    if (fromIdx !== null && fromIdx !== toIdx) {
      reorderQuestions(fromIdx, toIdx);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="h-full flex flex-col bg-surface-container border-r border-outline-variant">
      {/* Question counter header */}
      <div className="px-4 py-4">
        <div className="px-4 py-2 w-full h-full border-b border-outline-variant flex items-center justify-between bg-primary/10 rounded-lg">
          <p className="text-sm font-semibold text-primary tracking-wide leading-tight">
            Add and edit questions
          </p>
          <p className="text-sm text-primary mt-0.5">
            {selectedQuestionIndex === null ? '—' : selectedQuestionIndex + 1}/
            {questions.length}
          </p>
        </div>
      </div>

      {/* Questions list */}
      <div
        className="flex-1 overflow-y-auto px-2"
        onClick={() => setInsertMenuOpenAt(null)}
      >
        {questions.length === 0 && (
          <p className="text-xs text-outline text-center py-6 px-3">
            No questions yet. Add one below.
          </p>
        )}
        {questions.map((q, idx) => {
          const isSelected = selectedQuestionIndex === idx;
          const isDragOver =
            dragOverIndex === idx && dragIndexRef.current !== idx;
          const displayText =
            q.translations.en.text || q.text || `Question ${idx + 1}`;
          const badgeColor =
            TYPE_BADGE_COLORS[q.questionType] ?? 'bg-surface-container-high text-on-surface-variant';

          return (
            <React.Fragment key={q.id}>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => selectQuestion(idx)}
                className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-l-4 border-primary bg-primary/5'
                    : 'border-l-4 border-transparent hover:bg-surface-container-high'
                } ${isDragOver ? 'ring-2 ring-primary/40 bg-primary/5' : ''}`}
              >
                <div className="flex items-start gap-2">
                  {/* Drag handle + order number */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5 gap-0.5">
                    {/* Grip handle — click-stop so dragging doesn't select */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-outline/40 hover:text-outline transition-colors"
                      onMouseDown={(e) => e.stopPropagation()}
                      title="Drag to reorder"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-outline">
                      {q.order}
                    </span>
                    {(q.config.showIf ||
                      q.config.showIfAll?.length ||
                      q.config.showIfAny?.length) && (
                      <span
                        className="text-[10px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-700 flex-shrink-0 leading-tight"
                        title="Has conditional logic"
                      >
                        IF
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block text-xs px-1.5 py-0.5 rounded font-medium mb-1 ${badgeColor}`}
                    >
                      {q.questionType}
                    </span>
                    <p className="text-xs text-on-surface-variant truncate">
                      {displayText || '(no text)'}
                    </p>
                  </div>
                </div>

                {/* Action buttons — visible on hover or when selected */}
                <div
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 ${isSelected ? 'flex' : 'hidden group-hover:flex'}`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateQuestion(idx);
                    }}
                    title="Duplicate"
                    className="p-1 text-outline hover:text-on-surface-variant"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(idx);
                    }}
                    title="Delete"
                    className="p-1 text-outline hover:text-red-600"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Insert zone — visible on hover between consecutive questions */}
              {idx < questions.length - 1 && (
                <div
                  className="relative flex items-center justify-center h-4 group/insert mx-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-transparent group-hover/insert:bg-primary/30 transition-colors" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsertMenuOpenAt(
                        insertMenuOpenAt === idx ? null : idx
                      );
                    }}
                    title={`Insert question after Q${idx + 1}`}
                    className="relative z-10 w-5 h-5 rounded-full bg-surface-container border border-outline-variant text-outline hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover/insert:opacity-100 flex items-center justify-center text-sm font-bold leading-none shadow-sm"
                  >
                    +
                  </button>

                  {/* Insert type picker */}
                  {insertMenuOpenAt === idx && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container rounded-lg shadow-lg border border-outline-variant max-h-64 overflow-y-auto z-20">
                      {QUESTION_GROUPS.map((group) => (
                        <div key={group.label}>
                          <div className="px-3 py-1.5 text-xs font-semibold text-outline bg-surface-container-low sticky top-0">
                            {group.label}
                          </div>
                          {group.types.map(({ type, label }) => (
                            <button
                              key={type}
                              onClick={() => {
                                insertQuestion(type, idx);
                                setInsertMenuOpenAt(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Add question button */}
      <div ref={addMenuRef} className="p-3 border-t border-outline-variant relative">
        <button
          onClick={() => {
            setAddMenuOpen((v) => !v);
            setInsertMenuOpenAt(null);
          }}
          className="w-full py-2 border-2 border-dashed border-outline-variant rounded-lg text-sm text-outline hover:border-primary hover:text-primary transition-colors font-medium"
        >
          + Add Question
        </button>

        {addMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-surface-container rounded-lg shadow-lg border border-outline-variant max-h-72 overflow-y-auto z-10">
            {QUESTION_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-1.5 text-xs font-semibold text-outline bg-surface-container-low sticky top-0">
                  {group.label}
                </div>
                {group.types.map(({ type, label }) => (
                  <button
                    key={type}
                    onClick={() => {
                      addQuestion(type);
                      setAddMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionListPanel;
