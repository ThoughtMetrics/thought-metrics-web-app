// components/QuestionEditorPanel.tsx
//
// Centre panel of the survey builder (questions section).
//
// Shows a two-part layout when a question is selected:
//   1. Editable card — question type selector, language tabs, question text,
//      and type-specific configuration (placeholder, options, scale params, etc.)
//   2. Answer preview — BuilderQuestionPreview renders how the question looks
//      to respondents (read-only unless "Preview Survey" is active).
//
// Toolbar controls:
//   - Language dropdown (English / Tamil)
//   - Device switch (Desktop | Mobile icon buttons)
//   - Preview Survey toggle (enters interactive walkthrough)
//   - View mode toggle (single card / all questions list)

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, IBuilderShowIfCondition, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { useSetLanguage } from '@/core/stores/language.store';
import { BuilderQuestionPreview } from './BuilderQuestionPreview';
import TextConfig from './configs/TextConfig';
import ChoiceConfig from './configs/ChoiceConfig';
import ScaleConfig from './configs/ScaleConfig';
import SliderConfig from './configs/SliderConfig';
import MatrixConfig from './configs/MatrixConfig';
import FileConfig from './configs/FileConfig';
import DisplayConfig from './configs/DisplayConfig';
import PipeTokenButton from './PipeTokenButton';

// ---------------------------------------------------------------------------
// Type sets for config routing
// ---------------------------------------------------------------------------

const TEXT_TYPES = new Set([
  QuestionType.TEXT, QuestionType.TEXTAREA, QuestionType.NUMBER,
  QuestionType.EMAIL, QuestionType.PHONE, QuestionType.DATE,
  QuestionType.CURRENCY,
]);
const CHOICE_TYPES = new Set([
  QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE, QuestionType.RANKING,
]);
const SCALE_TYPES = new Set([
  QuestionType.RATING, QuestionType.LIKERT_SCALE, QuestionType.SCALE,
]);
const SLIDER_TYPES = new Set([
  QuestionType.DOUBLE_SLIDER, QuestionType.MULTI_SLIDER,
]);
const MATRIX_TYPES = new Set([
  QuestionType.MATRIX, QuestionType.MAX_DIFF, QuestionType.CONSTANT_SUM,
]);

// ---------------------------------------------------------------------------
// View / device types
// ---------------------------------------------------------------------------

type ViewMode = 'single' | 'list';
type DeviceView = 'desktop' | 'mobile';

const LANG_LABELS: Record<SupportedBuilderLanguage, string> = { en: 'English', ta: 'Tamil' };

const QUESTION_TYPE_LABEL: Record<string, string> = {
  [QuestionType.TEXT]:          'Short Text',
  [QuestionType.TEXTAREA]:      'Long Text',
  [QuestionType.NUMBER]:        'Number',
  [QuestionType.EMAIL]:         'Email',
  [QuestionType.PHONE]:         'Phone',
  [QuestionType.DATE]:          'Date',
  [QuestionType.CURRENCY]:      'Currency',
  [QuestionType.MCQ_SINGLE]:    'Single Choice',
  [QuestionType.MCQ_MULTIPLE]:  'Multiple Choice',
  [QuestionType.RANKING]:       'Ranking',
  [QuestionType.RATING]:        'Star Rating',
  [QuestionType.LIKERT_SCALE]:  'Likert Scale',
  [QuestionType.SCALE]:         'Slider Scale',
  [QuestionType.DOUBLE_SLIDER]: 'Double Slider',
  [QuestionType.MULTI_SLIDER]:  'Multi Slider',
  [QuestionType.MATRIX]:        'Matrix',
  [QuestionType.MAX_DIFF]:      'Max Diff',
  [QuestionType.CONSTANT_SUM]:  'Constant Sum',
  [QuestionType.FILE]:          'File Upload',
  [QuestionType.TEXT_DISPLAY]:  'Text / Graphic Display',
  [QuestionType.SMART_FOLLOWUP]: 'Smart Follow-Up (AI)',
};

// ---------------------------------------------------------------------------
// Toolbar icons
// ---------------------------------------------------------------------------

const SingleViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

const DesktopIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="13" rx="2" strokeWidth="2" />
    <path strokeLinecap="round" strokeWidth="2" d="M8 21h8M12 17v4" />
  </svg>
);

const MobileIcon: React.FC = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
    <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>
);

// ---------------------------------------------------------------------------
// Conditional visibility helpers (for interactive preview)
// ---------------------------------------------------------------------------

function evalCond(cond: IBuilderShowIfCondition, answers: Record<string, string>): boolean {
  const actual = answers[cond.questionId];
  const expected = cond.value;
  switch (cond.operator ?? 'equals') {
    case 'equals':     return actual === expected;
    case 'not_equals': return actual !== expected;
    case 'contains':   return actual?.includes(expected) ?? false;
    default:           return true;
  }
}

function isVisible(cfg: Record<string, any>, answers: Record<string, string>): boolean {
  if (cfg.showIf && !evalCond(cfg.showIf, answers)) return false;
  if (cfg.showIfAll?.length && cfg.showIfAll.some((c: IBuilderShowIfCondition) => !evalCond(c, answers))) return false;
  if (cfg.showIfAny?.length && !cfg.showIfAny.some((c: IBuilderShowIfCondition) => evalCond(c, answers))) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Answer-pipe helpers
// ---------------------------------------------------------------------------

/**
 * Replace {{N}} tokens in text with actual preview answers (or a placeholder).
 * N is the question's 1-based order number. Runs up to 3 passes to resolve
 * nested chains (e.g. a resolved answer that itself contains a token).
 * Answers map is keyed by question ID; we look up Q by order then use its ID.
 */
function resolvePipes(
  text: string,
  answers: Record<string, string>,
  questions: IBuilderQuestion[]
): string {
  if (!text.includes('{{')) return text;
  let result = text;
  for (let pass = 0; pass < 3; pass++) {
    result = result.replace(/\{\{Q(\d+)\}\}/g, (match, numStr) => {
      const order = parseInt(numStr, 10);
      const q = questions.find((q) => q.order === order);
      if (!q) return match; // unknown order — leave token as-is
      const answer = answers[q.id];
      if (answer !== undefined && answer !== '') return answer;
      return `[Q${order}]`; // unanswered placeholder
    });
    if (!result.includes('{{')) break;
  }
  return result;
}

/**
 * Returns a shallow-cloned question with {{N}} pipe tokens resolved in the
 * question text AND in all option labels, based on current preview answers.
 */
function resolveQuestionForPreview(
  question: IBuilderQuestion,
  lang: SupportedBuilderLanguage,
  answers: Record<string, string>,
  allQuestions: IBuilderQuestion[]
): IBuilderQuestion {
  const t = question.translations[lang];
  const resolvedText = resolvePipes(t.text, answers, allQuestions);

  // Resolve pipe tokens inside option labels (inline — no separate piped entries)
  const rawOptions = question.config.options ?? [];
  const resolvedOptions = rawOptions.map((opt) => ({
    ...opt,
    label: resolvePipes(opt.label, answers, allQuestions),
  }));

  return {
    ...question,
    translations: {
      ...question.translations,
      [lang]: { ...t, text: resolvedText },
    },
    config: { ...question.config, options: resolvedOptions },
  };
}

/**
 * Insert a token string at the current cursor position in a textarea.
 * Falls back to appending if no selection data is available.
 */
function insertTokenAtCursor(
  textarea: HTMLTextAreaElement,
  token: string,
  currentValue: string,
  onChange: (newValue: string) => void
): void {
  const start = textarea.selectionStart ?? currentValue.length;
  const end = textarea.selectionEnd ?? currentValue.length;
  const newValue = currentValue.slice(0, start) + token + currentValue.slice(end);
  onChange(newValue);
  // Restore focus and move cursor after the inserted token
  requestAnimationFrame(() => {
    textarea.focus();
    const pos = start + token.length;
    textarea.setSelectionRange(pos, pos);
  });
}

// ---------------------------------------------------------------------------
// QuestionEditorPanel
// ---------------------------------------------------------------------------

const QuestionEditorPanel: React.FC = () => {
  const {
    questions,
    selectedQuestionIndex,
    activeLanguage,
    setActiveLanguage,
    selectQuestion,
    setQuestionField,
    setQuestionTranslation,
    changeQuestionType,
  } = useSurveyBuilderStore();

  const setGlobalLanguage = useSetLanguage();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');

  // Refs for textarea cursor-based pipe insertion (single-question editor)
  const singleTextareaRef = useRef<HTMLTextAreaElement>(null);
  // Refs for list-view textarea cursor insertion (keyed by question index)
  const listTextareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  // Preview mode state
  const [showPreview, setShowPreview] = useState(false);
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});
  const [previewNavIdx, setPreviewNavIdx] = useState(0);
  const [previewDone, setPreviewDone] = useState(false);

  const visiblePreviewIndices = useMemo(
    () => questions.map((_, i) => i).filter((i) => isVisible(questions[i].config as Record<string, any>, previewAnswers)),
    [questions, previewAnswers]
  );

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setPreviewAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const exitPreview = () => {
    setShowPreview(false);
    setPreviewAnswers({});
    setPreviewNavIdx(0);
    setPreviewDone(false);
  };

  const enterPreview = () => {
    setPreviewAnswers({});
    setPreviewNavIdx(0);
    setPreviewDone(false);
    setViewMode('list');
    setShowPreview(true);
  };

  // ── Type-specific config renderer ────────────────────────────────────────

  const renderTypeConfig = (qIdx: number) => {
    const question = questions[qIdx];
    const lang = activeLanguage;
    if (TEXT_TYPES.has(question.questionType)) {
      return <TextConfig question={question} qIdx={qIdx} lang={lang} />;
    }
    if (CHOICE_TYPES.has(question.questionType)) {
      return <ChoiceConfig question={question} qIdx={qIdx} lang={lang} />;
    }
    if (SCALE_TYPES.has(question.questionType)) {
      return <ScaleConfig question={question} qIdx={qIdx} lang={lang} />;
    }
    if (SLIDER_TYPES.has(question.questionType)) {
      return <SliderConfig question={question} qIdx={qIdx} />;
    }
    if (MATRIX_TYPES.has(question.questionType)) {
      return <MatrixConfig question={question} qIdx={qIdx} />;
    }
    if (question.questionType === QuestionType.FILE) {
      return <FileConfig question={question} qIdx={qIdx} />;
    }
    if (question.questionType === QuestionType.TEXT_DISPLAY) {
      return <DisplayConfig question={question} qIdx={qIdx} />;
    }
    return null;
  };

  // ── Mobile frame wrapper ─────────────────────────────────────────────────

  const withDeviceFrame = (children: React.ReactNode) => {
    if (deviceView === 'desktop') return <>{children}</>;
    return (
      <div className="flex-1 overflow-y-auto flex items-start justify-center bg-gray-100 py-6">
        <div
          className="relative bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col"
          style={{ width: 390, minHeight: 720 }}
        >
          <div className="flex items-center justify-center pt-3 pb-1 shrink-0">
            <div className="w-24 h-5 bg-gray-800 rounded-full" />
          </div>
          <div className="mx-2 mb-2 rounded-[1.75rem] bg-white overflow-hidden flex flex-col" style={{ flex: 1 }}>
            {children}
          </div>
          <div className="flex items-center justify-center py-2 shrink-0">
            <div className="w-20 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  // ── Toolbar ──────────────────────────────────────────────────────────────

  const toolbar = (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shrink-0">
      {/* Left: Device switch */}
      <div className="flex items-center gap-2">
        {/* Device switch — icon buttons */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            title="Desktop view"
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <DesktopIcon />
          </button>
          <button
            type="button"
            title="Mobile view"
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MobileIcon />
          </button>
        </div>
      </div>

      {/* Right: Preview Survey + View mode toggle (toggle only in preview mode) */}
      <div className="flex items-center gap-2">
        {/* View mode toggle — only visible during preview */}
        {showPreview && (
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              type="button"
              title="Single question view"
              onClick={() => setViewMode('single')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'single' ? 'bg-white shadow-sm' : 'hover:text-black'}`}
            >
              <SingleViewIcon active={viewMode === 'single'} />
            </button>
            <button
              type="button"
              title="All questions list view"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:text-black'}`}
            >
              <ListViewIcon active={viewMode === 'list'} />
            </button>
          </div>
        )}

        {/* Preview Survey toggle */}
        {!showPreview ? (
          <button
            type="button"
            onClick={enterPreview}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Play size={11} />
            Preview Survey
          </button>
        ) : (
          <button
            type="button"
            onClick={exitPreview}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <X size={11} />
            Exit Preview
          </button>
        )}
      </div>
    </div>
  );

  // ── Interactive preview walkthrough ──────────────────────────────────────

  if (showPreview) {
    const renderWalkthrough = () => {
      if (questions.length === 0) {
        return (
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-gray-400">No questions added yet.</p>
          </div>
        );
      }
      if (viewMode === 'list') {
        const displayIndices = visiblePreviewIndices;
        return (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 font-medium">
                  Preview mode: answers update conditional logic in real-time.
                </p>
              </div>
              {displayIndices.map((qIdx, displayIdx) => {
                const question = resolveQuestionForPreview(
                  questions[qIdx],
                  activeLanguage,
                  previewAnswers,
                  questions
                );
                return (
                  <div key={question.id} className="p-4 md:p-6 border border-custom-grey-2 bg-white rounded-xl">
                    <BuilderQuestionPreview
                      question={question}
                      lang={activeLanguage}
                      questionNumber={displayIdx + 1}
                      totalQuestions={displayIndices.length}
                      previewLayout="list"
                      interactive={true}
                      onAnswerChange={(v) => handleAnswerChange(question.id, v)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // Paginated walkthrough
      if (previewDone) {
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 mb-1">Preview complete!</p>
                <p className="text-sm text-gray-500">This is how the survey would look to respondents.</p>
              </div>
              <button
                onClick={() => { setPreviewAnswers({}); setPreviewNavIdx(0); setPreviewDone(false); }}
                className="mt-2 px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Restart
              </button>
            </div>
          </div>
        );
      }

      if (visiblePreviewIndices.length === 0) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">No visible questions based on current answers.</p>
          </div>
        );
      }

      const safeIdx = Math.min(previewNavIdx, visiblePreviewIndices.length - 1);
      const qIdx = visiblePreviewIndices[safeIdx];
      const question = resolveQuestionForPreview(
        questions[qIdx],
        activeLanguage,
        previewAnswers,
        questions
      );
      const isFirst = safeIdx === 0;
      const isLast = safeIdx === visiblePreviewIndices.length - 1;

      return (
        <div className="flex-1 overflow-hidden flex flex-col accent-primary caret-primary scheme-light">
          <div className="flex-1 max-w-3xl w-full mx-auto overflow-hidden [&_.common-component]:min-w-0 [&_.common-component]:w-full">
            <BuilderQuestionPreview
              question={question}
              lang={activeLanguage}
              questionNumber={safeIdx + 1}
              totalQuestions={visiblePreviewIndices.length}
              previewLayout="paginated"
              interactive={true}
              isFirst={isFirst}
              isLast={isLast}
              onAnswerChange={(v) => handleAnswerChange(question.id, v)}
              onBack={() => { if (!isFirst) setPreviewNavIdx(safeIdx - 1); }}
              onNext={() => { if (isLast) { setPreviewDone(true); } else { setPreviewNavIdx(safeIdx + 1); } }}
            />
          </div>
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-hidden flex flex-col bg-gray-100">{renderWalkthrough()}</div>
        ) : (
          withDeviceFrame(<div className="flex-1 overflow-hidden flex flex-col">{renderWalkthrough()}</div>)
        )}
      </div>
    );
  }

  // ── List view (editable) ─────────────────────────────────────────────────

  if (viewMode === 'list') {
    const content = questions.length === 0 ? (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-gray-400">No questions added yet.</p>
      </div>
    ) : (
      <div className="space-y-3">
        {questions.map((question, qIdx) => {
          const isSelected = selectedQuestionIndex === qIdx;
          const t = question.translations[activeLanguage];
          const hasCondition = !!(
            question.config.showIf ||
            question.config.showIfAll?.length ||
            question.config.showIfAny?.length
          );
          const hasSkipRules = !!(question.config.skipRules?.length);
          return (
            <div
              key={question.id}
              onClick={() => selectQuestion(qIdx)}
              className={`bg-white rounded-xl border transition-colors cursor-pointer ${
                isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Single row: Q-number | textarea | pipe button | type selector */}
              <div className="flex items-center gap-2 px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-400">Q{question.order}</span>
                  {hasCondition && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">IF</span>
                  )}
                  {hasSkipRules && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SKIP</span>
                  )}
                </div>
                <textarea
                  ref={(el) => { listTextareaRefs.current[qIdx] = el; }}
                  value={t.text}
                  onChange={(e) => {
                    setQuestionTranslation(qIdx, activeLanguage, { text: e.target.value });
                    if (activeLanguage === 'en') {
                      setQuestionField(qIdx, 'text', e.target.value);
                    }
                  }}
                  onFocus={() => selectQuestion(qIdx)}
                  placeholder="Enter question text..."
                  rows={1}
                  className="flex-1 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none bg-transparent leading-snug py-0.5"
                />
                <PipeTokenButton
                  questions={questions}
                  currentQuestionIndex={qIdx}
                  onInsert={(token) => {
                    const el = listTextareaRefs.current[qIdx];
                    if (el) {
                      insertTokenAtCursor(el, token, t.text, (newVal) => {
                        setQuestionTranslation(qIdx, activeLanguage, { text: newVal });
                        if (activeLanguage === 'en') setQuestionField(qIdx, 'text', newVal);
                      });
                    }
                  }}
                />
                <select
                  value={question.questionType}
                  onChange={(e) => changeQuestionType(qIdx, e.target.value as QuestionType)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white text-gray-600"
                >
                  <optgroup label="Text">
                    <option value={QuestionType.TEXT}>Short Text</option>
                    <option value={QuestionType.TEXTAREA}>Long Text</option>
                    <option value={QuestionType.NUMBER}>Number</option>
                    <option value={QuestionType.EMAIL}>Email</option>
                    <option value={QuestionType.PHONE}>Phone</option>
                    <option value={QuestionType.DATE}>Date</option>
                    <option value={QuestionType.CURRENCY}>Currency</option>
                  </optgroup>
                  <optgroup label="Choice">
                    <option value={QuestionType.MCQ_SINGLE}>Single Choice (MCQ)</option>
                    <option value={QuestionType.MCQ_MULTIPLE}>Multiple Choice</option>
                    <option value={QuestionType.RANKING}>Ranking</option>
                  </optgroup>
                  <optgroup label="Scale">
                    <option value={QuestionType.RATING}>Star Rating</option>
                    <option value={QuestionType.LIKERT_SCALE}>Likert Scale</option>
                    <option value={QuestionType.SCALE}>Slider Scale</option>
                    <option value={QuestionType.DOUBLE_SLIDER}>Double Slider</option>
                    <option value={QuestionType.MULTI_SLIDER}>Multi Slider</option>
                  </optgroup>
                  <optgroup label="Grid">
                    <option value={QuestionType.MATRIX}>Matrix</option>
                    <option value={QuestionType.MAX_DIFF}>Max Diff</option>
                    <option value={QuestionType.CONSTANT_SUM}>Constant Sum</option>
                    <option value={QuestionType.FILE}>File Upload</option>
                  </optgroup>
                  <optgroup label="Display">
                    <option value={QuestionType.TEXT_DISPLAY}>Text / Graphic Display</option>
                  </optgroup>
                </select>
              </div>

              {/* Type-specific config — shown inline when card is selected */}
              {isSelected && (
                <div className="px-4 pb-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <div className="pt-3">
                    {renderTypeConfig(qIdx)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-y-auto"><div className="p-4">{content}</div></div>
        ) : (
          withDeviceFrame(<div className="overflow-y-auto flex-1"><div className="p-4">{content}</div></div>)
        )}
      </div>
    );
  }

  // ── Single / editor mode ─────────────────────────────────────────────────

  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {toolbar}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">No question selected</p>
            <p className="text-xs text-gray-400">Select a question from the sidebar to edit it, or add a new question below.</p>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[selectedQuestionIndex];
  if (!question) return null;

  const lang = activeLanguage;
  const t = question.translations[lang];

  const hasCondition = !!(
    question.config.showIf ||
    question.config.showIfAll?.length ||
    question.config.showIfAny?.length
  );
  const hasSkipRulesSingle = !!(question.config.skipRules?.length);

  const editorContent = (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Conditional logic indicator */}
      {hasCondition && (
        <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">IF</span>
          <span className="text-xs text-amber-700">
            This question has conditional logic — it may be hidden for some respondents.
          </span>
        </div>
      )}
      {hasSkipRulesSingle && (
        <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SKIP</span>
          <span className="text-xs text-blue-700">
            This question has skip rules — respondents may be navigated to a different question.
          </span>
        </div>
      )}

      {/* ── Editable question card ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Card header: Q-number + pipe button (left) | type select (right) */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-xs font-semibold text-gray-400">Q{question.order}</span>
              <span className="block text-[10px] text-gray-400 mt-0.5 leading-none">
                {QUESTION_TYPE_LABEL[question.questionType] ?? question.questionType}
              </span>
            </div>
            <PipeTokenButton
              questions={questions}
              currentQuestionIndex={selectedQuestionIndex}
              onInsert={(token) => {
                const el = singleTextareaRef.current;
                if (el) {
                  insertTokenAtCursor(el, token, t.text, (newVal) => {
                    setQuestionTranslation(selectedQuestionIndex, lang, { text: newVal });
                    if (lang === 'en') setQuestionField(selectedQuestionIndex, 'text', newVal);
                  });
                }
              }}
              title="Insert answer from a previous question into this text"
            />
          </div>

          {/* Question type select */}
          <select
            value={question.questionType}
            onChange={(e) => changeQuestionType(selectedQuestionIndex, e.target.value as QuestionType)}
            className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <optgroup label="Text">
              <option value={QuestionType.TEXT}>Short Text</option>
              <option value={QuestionType.TEXTAREA}>Long Text</option>
              <option value={QuestionType.NUMBER}>Number</option>
              <option value={QuestionType.EMAIL}>Email</option>
              <option value={QuestionType.PHONE}>Phone</option>
              <option value={QuestionType.DATE}>Date</option>
              <option value={QuestionType.CURRENCY}>Currency</option>
            </optgroup>
            <optgroup label="Choice">
              <option value={QuestionType.MCQ_SINGLE}>Single Choice (MCQ)</option>
              <option value={QuestionType.MCQ_MULTIPLE}>Multiple Choice</option>
              <option value={QuestionType.RANKING}>Ranking</option>
            </optgroup>
            <optgroup label="Scale">
              <option value={QuestionType.RATING}>Star Rating</option>
              <option value={QuestionType.LIKERT_SCALE}>Likert Scale</option>
              <option value={QuestionType.SCALE}>Slider Scale</option>
              <option value={QuestionType.DOUBLE_SLIDER}>Double Slider</option>
              <option value={QuestionType.MULTI_SLIDER}>Multi Slider</option>
            </optgroup>
            <optgroup label="Grid">
              <option value={QuestionType.MATRIX}>Matrix</option>
              <option value={QuestionType.MAX_DIFF}>Max Diff</option>
              <option value={QuestionType.CONSTANT_SUM}>Constant Sum</option>
              <option value={QuestionType.FILE}>File Upload</option>
            </optgroup>
          </select>
        </div>

        {/* Question text */}
        <div className="p-4 space-y-4">
          {/* Language tabs */}
          <div className="flex gap-1">
            {(['en', 'ta'] as SupportedBuilderLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => { setActiveLanguage(l); setGlobalLanguage(l as 'en' | 'ta'); }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  lang === l ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>

          <textarea
            ref={singleTextareaRef}
            value={t.text}
            onChange={(e) => {
              setQuestionTranslation(selectedQuestionIndex, lang, { text: e.target.value });
              if (lang === 'en') {
                setQuestionField(selectedQuestionIndex, 'text', e.target.value);
              }
            }}
            placeholder="Enter question text..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />

          {/* Type-specific config */}
          {renderTypeConfig(selectedQuestionIndex)}
        </div>
      </div>

      {/* ── Answer preview ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Answer Preview</span>
        </div>
        <div className="accent-primary caret-primary scheme-light [&_.common-component]:min-w-0 [&_.common-component]:w-full">
          <BuilderQuestionPreview
            question={question}
            lang={activeLanguage}
            questionNumber={question.order}
            totalQuestions={questions.length}
            previewLayout="paginated"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {toolbar}
      {deviceView === 'desktop' ? (
        <div className="flex-1 overflow-hidden flex flex-col">{editorContent}</div>
      ) : (
        withDeviceFrame(<div className="flex-1 overflow-hidden flex flex-col">{editorContent}</div>)
      )}
    </div>
  );
};

export default QuestionEditorPanel;
