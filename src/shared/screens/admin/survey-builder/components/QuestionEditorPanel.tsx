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
import ChoiceConfig from './configs/ChoiceConfig';
import ScaleConfig from './configs/ScaleConfig';
import SliderConfig from './configs/SliderConfig';
import MatrixConfig from './configs/MatrixConfig';
import FileConfig from './configs/FileConfig';
import VideoConfig from './configs/VideoConfig';
import AudioConfig from './configs/AudioConfig';
import DisplayConfig from './configs/DisplayConfig';
import PipeTokenButton from './PipeTokenButton';
import McqCanvasEditor from './McqCanvasEditor';
import RankingCanvasEditor from './RankingCanvasEditor';
import MaxDiffCanvasEditor from './MaxDiffCanvasEditor';
import GaborGrangerCanvasEditor from './GaborGrangerCanvasEditor';
import VanWestendorpCanvasEditor from './VanWestendorpCanvasEditor';
import KanoModelCanvasEditor from './KanoModelCanvasEditor';

// ---------------------------------------------------------------------------
// Type sets for config routing
// ---------------------------------------------------------------------------

const TEXT_TYPES = new Set([
  QuestionType.TEXT, QuestionType.TEXTAREA, QuestionType.NUMBER,
  QuestionType.EMAIL, QuestionType.PHONE, QuestionType.DATE,
  QuestionType.CURRENCY,
]);
const CHOICE_TYPES = new Set([
  QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE,
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
const MEDIA_TYPES = new Set([
  QuestionType.VIDEO, QuestionType.AUDIO,
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
  [QuestionType.MAX_DIFF]:       'Max Diff',
  [QuestionType.GABOR_GRANGER]:   'Gabor-Granger',
  [QuestionType.VAN_WESTENDORP]:  'Van Westendorp (PSM)',
  [QuestionType.KANO_MODEL]:      'Kano Model',
  [QuestionType.CONSTANT_SUM]:    'Constant Sum',
  [QuestionType.FILE]:          'File Upload',
  [QuestionType.VIDEO]:         'Video Response',
  [QuestionType.AUDIO]:         'Audio Response',
  [QuestionType.TEXT_DISPLAY]:  'Text / Graphic Display',
  [QuestionType.SMART_FOLLOWUP]: 'Smart Follow-Up (AI)',
};

// ---------------------------------------------------------------------------
// Toolbar icons
// ---------------------------------------------------------------------------

const SingleViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg className={`w-4 h-4 ${active ? 'text-on-surface' : 'text-outline'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg className={`w-4 h-4 ${active ? 'text-on-surface' : 'text-outline'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    setQuestionConfig,
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
    setShowPreview(true);
  };

  // ── Type-specific config renderer ────────────────────────────────────────

  const renderTypeConfig = (qIdx: number) => {
    const question = questions[qIdx];
    const lang = activeLanguage;
    if (TEXT_TYPES.has(question.questionType)) {
      // Visual-only bottom-border input — all settings are in the right panel
      const t = question.translations[lang];
      const defaultPh: Partial<Record<QuestionType, string>> = {
        [QuestionType.TEXT]: 'Type your answer here...',
        [QuestionType.TEXTAREA]: 'Type your answer here...',
        [QuestionType.NUMBER]: '0',
        [QuestionType.EMAIL]: 'email@example.com',
        [QuestionType.PHONE]: 'Phone number',
        [QuestionType.DATE]: 'Select a date...',
        [QuestionType.CURRENCY]: '0.00',
      };
      const ph = t.placeholder || defaultPh[question.questionType] || 'Type your answer here...';
      const isTextarea = question.questionType === QuestionType.TEXTAREA;
      return (
        <div className={`flex gap-0.5 border-b-2 border-primary/50 pb-1.5 ${isTextarea ? 'items-start pt-1 min-h-[56px]' : 'items-center'}`}>
          <span
            className="flex-shrink-0 inline-block w-px bg-primary/70"
            style={{ height: '1.1em', animation: 'cursor-blink 1s step-end infinite' }}
          />
          <span className="text-sm text-primary/40 italic select-none">{ph}</span>
        </div>
      );
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
    if (MEDIA_TYPES.has(question.questionType)) {
      return question.questionType === QuestionType.VIDEO
        ? <VideoConfig question={question} qIdx={qIdx} />
        : <AudioConfig question={question} qIdx={qIdx} />;
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
      <div className="flex-1 overflow-hidden flex justify-center bg-surface-container-low">
        <div className="w-[390px] flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    );
  };

  // ── Toolbar ──────────────────────────────────────────────────────────────

  const toolbar = (
    <div className="flex items-center justify-between p-3 border-b border-outline-variant bg-surface-container shrink-0">
      {/* Left: Device switch */}
      <div className="flex items-center gap-2">
        {/* Device switch — icon buttons */}
        <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            title="Desktop view"
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-surface-container shadow-sm text-on-surface' : 'text-outline hover:text-on-surface-variant'}`}
          >
            <DesktopIcon />
          </button>
          <button
            type="button"
            title="Mobile view"
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-surface-container shadow-sm text-on-surface' : 'text-outline hover:text-on-surface-variant'}`}
          >
            <MobileIcon />
          </button>
        </div>
      </div>

      {/* Right: View mode toggle + Preview Survey */}
      <div className="flex items-center gap-2">
        {/* View mode toggle — always visible */}
        <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            title="Single question view"
            onClick={() => setViewMode('single')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'single' ? 'bg-surface-container shadow-sm' : 'hover:text-on-surface'}`}
          >
            <SingleViewIcon active={viewMode === 'single'} />
          </button>
          <button
            type="button"
            title="All questions list view"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-surface-container shadow-sm' : 'hover:text-on-surface'}`}
          >
            <ListViewIcon active={viewMode === 'list'} />
          </button>
        </div>

        {/* Preview Survey toggle */}
        {!showPreview ? (
          <button
            type="button"
            onClick={enterPreview}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/20 transition-colors"
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
            <p className="text-sm text-outline">No questions added yet.</p>
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
                  <div key={question.id} className="p-4 md:p-6 border border-outline-variant bg-surface-container rounded-xl">
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
                <p className="text-base font-semibold text-on-surface mb-1">Preview complete!</p>
                <p className="text-sm text-outline">This is how the survey would look to respondents.</p>
              </div>
              <button
                onClick={() => { setPreviewAnswers({}); setPreviewNavIdx(0); setPreviewDone(false); }}
                className="mt-2 px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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
            <p className="text-sm text-outline">No visible questions based on current answers.</p>
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
      <div className="h-full flex flex-col bg-surface-container-low">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-hidden flex flex-col bg-surface-container">{renderWalkthrough()}</div>
        ) : (
          withDeviceFrame(<div className="flex-1 overflow-hidden flex flex-col">{renderWalkthrough()}</div>)
        )}
      </div>
    );
  }

  // ── Shared type-select options (used in both list and single views) ────────

  const typeSelectOptions = (
    <>
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
      <optgroup label="Pricing">
        <option value={QuestionType.GABOR_GRANGER}>Gabor-Granger</option>
        <option value={QuestionType.VAN_WESTENDORP}>Van Westendorp (PSM)</option>
      </optgroup>
      <optgroup label="Concept Testing">
        <option value={QuestionType.KANO_MODEL}>Kano Model</option>
      </optgroup>
      <optgroup label="Media">
        <option value={QuestionType.VIDEO}>Video Response</option>
        <option value={QuestionType.AUDIO}>Audio Response</option>
      </optgroup>
      <optgroup label="Display">
        <option value={QuestionType.TEXT_DISPLAY}>Text / Graphic Display</option>
      </optgroup>
    </>
  );

  // ── List view (editable) ─────────────────────────────────────────────────

  if (viewMode === 'list') {
    const content = questions.length === 0 ? (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-outline">No questions added yet.</p>
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
          const isMcqList =
            question.questionType === QuestionType.MCQ_SINGLE ||
            question.questionType === QuestionType.MCQ_MULTIPLE;
          const isRankingList = question.questionType === QuestionType.RANKING;
          const isMaxDiffList = question.questionType === QuestionType.MAX_DIFF;
          const isGaborGrangerList = question.questionType === QuestionType.GABOR_GRANGER;
          const isVanWestendorpList = question.questionType === QuestionType.VAN_WESTENDORP;
          const isKanoModelList = question.questionType === QuestionType.KANO_MODEL;
          const isNarrowList = isMcqList || isRankingList;

          // Unified canvas card for all question types
          return (
            <div
              key={question.id}
              onClick={() => selectQuestion(qIdx)}
              className={`bg-surface-container rounded-xl border overflow-hidden transition-colors cursor-pointer ${
                isSelected ? 'border-primary ring-1 ring-primary/30' : 'border-rose-200'
              }`}
            >
              {/* IF / SKIP banners */}
              {(hasCondition || hasSkipRules) && (
                <div className="px-4 pt-3 space-y-1.5">
                  {hasCondition && (
                    <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">IF</span>
                      <span className="text-xs text-amber-700">Has conditional logic</span>
                    </div>
                  )}
                  {hasSkipRules && (
                    <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SKIP</span>
                      <span className="text-xs text-blue-700">Has skip rules</span>
                    </div>
                  )}
                </div>
              )}

              {/* Canvas content */}
              <div className="px-8 py-8" onClick={(e) => e.stopPropagation()}>
                <div className={`mx-auto w-full space-y-5 ${isNarrowList ? 'max-w-sm' : 'max-w-xl'}`}>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-on-primary text-xs font-bold flex items-center justify-center rounded mt-1">
                      {question.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1">
                        <textarea
                          ref={(el) => { listTextareaRefs.current[qIdx] = el; }}
                          value={t.text}
                          onChange={(e) => {
                            setQuestionTranslation(qIdx, activeLanguage, { text: e.target.value });
                            if (activeLanguage === 'en') setQuestionField(qIdx, 'text', e.target.value);
                          }}
                          onFocus={() => selectQuestion(qIdx)}
                          placeholder="Type your question here..."
                          rows={1}
                          className="flex-1 min-w-0 bg-transparent resize-none text-xl font-semibold text-on-surface focus:outline-none placeholder-outline/40 leading-snug"
                          style={{ overflow: 'hidden' }}
                          onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = 'auto';
                            el.style.height = el.scrollHeight + 'px';
                          }}
                        />
                        {question.required && (
                          <span className="text-rose-400 text-xl font-medium flex-shrink-0 leading-snug mt-0.5">*</span>
                        )}
                      </div>
                      {/* Description/subtitle — hidden for text types as right panel owns the placeholder field */}
                      {!TEXT_TYPES.has(question.questionType) && (
                        <input
                          type="text"
                          value={t.placeholder ?? ''}
                          onChange={(e) => setQuestionTranslation(qIdx, activeLanguage, { placeholder: e.target.value })}
                          onFocus={() => selectQuestion(qIdx)}
                          placeholder="Description (optional)"
                          className="w-full bg-transparent text-sm text-outline focus:outline-none placeholder-outline/40 mt-1"
                        />
                      )}
                    </div>
                  </div>
                  {/* Rating media block */}
                  {question.questionType === QuestionType.RATING && (() => {
                    const cfg = question.config;
                    return (
                      <div>
                        {cfg.questionMediaUrl ? (
                          <div className="relative group">
                            {cfg.questionMediaType === 'video'
                              ? <video src={cfg.questionMediaUrl} controls className="w-full rounded-lg max-h-48 object-cover" />
                              : <img src={cfg.questionMediaUrl} alt="" className="w-full rounded-lg max-h-48 object-cover" />
                            }
                            <button
                              type="button"
                              onClick={() => useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { questionMediaUrl: undefined, questionMediaType: undefined })}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-surface-container/80 rounded-full p-1 hover:bg-surface-container transition-all"
                            >
                              <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-xl px-6 py-6 cursor-pointer hover:border-primary/50 transition-colors">
                            <svg className="w-6 h-6 text-outline/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs text-outline">Add image or video (optional)</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const url = URL.createObjectURL(file);
                                const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
                                useSurveyBuilderStore.getState().setQuestionConfig(qIdx, { questionMediaUrl: url, questionMediaType: type });
                              }}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })()}
                  {isMcqList
                    ? <McqCanvasEditor question={question} qIdx={qIdx} lang={activeLanguage} />
                    : isRankingList
                      ? <RankingCanvasEditor question={question} qIdx={qIdx} lang={activeLanguage} />
                      : isMaxDiffList
                        ? <MaxDiffCanvasEditor question={question} qIdx={qIdx} lang={activeLanguage} />
                        : isGaborGrangerList
                          ? <GaborGrangerCanvasEditor question={question} qIdx={qIdx} lang={activeLanguage} />
                          : isVanWestendorpList
                            ? <VanWestendorpCanvasEditor question={question} qIdx={qIdx} lang={activeLanguage} />
                            : isKanoModelList
                              ? <KanoModelCanvasEditor question={question} qIdx={qIdx} />
                              : renderTypeConfig(qIdx)
                  }
                </div>
              </div>

              {/* Bottom bar: lang tabs + pipe token + type select */}
              <div className="border-t border-outline-variant/50 px-4 py-2 flex items-center justify-between bg-surface-container-low/40" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1.5">
                  {(['en', 'ta'] as SupportedBuilderLanguage[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setActiveLanguage(l); setGlobalLanguage(l as 'en' | 'ta'); }}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeLanguage === l ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant'
                      }`}
                    >
                      {LANG_LABELS[l]}
                    </button>
                  ))}
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
                </div>
                <select
                  value={question.questionType}
                  onChange={(e) => changeQuestionType(qIdx, e.target.value as QuestionType)}
                  className="border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container text-on-surface-variant"
                >
                  {typeSelectOptions}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="h-full flex flex-col bg-surface-container-low">
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
      <div className="h-full flex flex-col bg-surface-container-low">
        {toolbar}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-xs">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">No question selected</p>
            <p className="text-xs text-outline">Select a question from the sidebar to edit it, or add a new question below.</p>
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

  const isMcqCanvas =
    question.questionType === QuestionType.MCQ_SINGLE ||
    question.questionType === QuestionType.MCQ_MULTIPLE;
  const isRankingCanvas = question.questionType === QuestionType.RANKING;
  const isMaxDiffCanvas = question.questionType === QuestionType.MAX_DIFF;
  const isGaborGrangerCanvas = question.questionType === QuestionType.GABOR_GRANGER;
  const isVanWestendorpCanvas = question.questionType === QuestionType.VAN_WESTENDORP;
  const isKanoModelCanvas = question.questionType === QuestionType.KANO_MODEL;
  const isNarrowCanvas = isMcqCanvas || isRankingCanvas;

  // ── Unified canvas shell for ALL question types ──────────────────────────
  const editorContent = (
    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
      {/* IF / SKIP banners */}
      {(hasCondition || hasSkipRulesSingle) && (
        <div className="px-4 pt-3 space-y-2 flex-shrink-0">
          {hasCondition && (
            <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">IF</span>
              <span className="text-xs text-amber-700">This question has conditional logic — it may be hidden for some respondents.</span>
            </div>
          )}
          {hasSkipRulesSingle && (
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">SKIP</span>
              <span className="text-xs text-blue-700">This question has skip rules — respondents may be navigated to a different question.</span>
            </div>
          )}
        </div>
      )}

      {/* Canvas frame */}
      <div className="flex-1 mx-3 mb-3 mt-2 bg-surface-container border border-rose-200 rounded-xl flex flex-col overflow-hidden">

        {/* Scrollable body — all types centred; min-h-full keeps centering when content is short */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col items-center justify-center px-8 py-10">
            <div className={`w-full space-y-5 ${isNarrowCanvas ? 'max-w-sm' : 'max-w-xl'}`}>

            {/* Badge + headless question text + description */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-on-primary text-xs font-bold flex items-center justify-center rounded mt-1">
                {question.order}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-1">
                  <textarea
                    ref={singleTextareaRef}
                    value={t.text}
                    onChange={(e) => {
                      setQuestionTranslation(selectedQuestionIndex, lang, { text: e.target.value });
                      if (lang === 'en') setQuestionField(selectedQuestionIndex, 'text', e.target.value);
                    }}
                    placeholder="Type your question here..."
                    rows={1}
                    className="flex-1 min-w-0 bg-transparent resize-none text-xl font-semibold text-on-surface focus:outline-none placeholder-outline/40 leading-snug"
                    style={{ overflow: 'hidden' }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = 'auto';
                      el.style.height = el.scrollHeight + 'px';
                    }}
                  />
                  {question.required && (
                    <span className="text-rose-400 text-xl font-medium flex-shrink-0 leading-snug mt-0.5">*</span>
                  )}
                </div>
                {/* Description/subtitle — hidden for text types as right panel owns the placeholder field */}
                {!TEXT_TYPES.has(question.questionType) && (
                  <input
                    type="text"
                    value={t.placeholder ?? ''}
                    onChange={(e) =>
                      setQuestionTranslation(selectedQuestionIndex, lang, { placeholder: e.target.value })
                    }
                    placeholder="Description (optional)"
                    className="w-full bg-transparent text-sm text-outline focus:outline-none placeholder-outline/40 mt-1"
                  />
                )}
              </div>
            </div>

            {/* Rating media upload block */}
            {question.questionType === QuestionType.RATING && (
              <div>
                {question.config.questionMediaUrl ? (
                  <div className="relative group">
                    {question.config.questionMediaType === 'video'
                      ? <video src={question.config.questionMediaUrl} controls className="w-full rounded-lg max-h-48 object-cover" />
                      : <img src={question.config.questionMediaUrl} alt="" className="w-full rounded-lg max-h-48 object-cover" />
                    }
                    <button
                      type="button"
                      onClick={() => setQuestionConfig(selectedQuestionIndex, { questionMediaUrl: undefined, questionMediaType: undefined })}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-surface-container/80 rounded-full p-1 hover:bg-surface-container transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-xl px-6 py-6 cursor-pointer hover:border-primary/50 transition-colors">
                    <svg className="w-6 h-6 text-outline/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-outline">Add image or video (optional)</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
                        setQuestionConfig(selectedQuestionIndex, { questionMediaUrl: url, questionMediaType: type });
                      }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Type-specific content */}
            {isMcqCanvas
              ? <McqCanvasEditor question={question} qIdx={selectedQuestionIndex} lang={lang} />
              : isRankingCanvas
                ? <RankingCanvasEditor question={question} qIdx={selectedQuestionIndex} lang={lang} />
                : isMaxDiffCanvas
                  ? <MaxDiffCanvasEditor question={question} qIdx={selectedQuestionIndex} lang={lang} />
                  : isGaborGrangerCanvas
                    ? <GaborGrangerCanvasEditor question={question} qIdx={selectedQuestionIndex} lang={lang} />
                    : isVanWestendorpCanvas
                      ? <VanWestendorpCanvasEditor question={question} qIdx={selectedQuestionIndex} lang={lang} />
                      : isKanoModelCanvas
                        ? <KanoModelCanvasEditor question={question} qIdx={selectedQuestionIndex} />
                        : renderTypeConfig(selectedQuestionIndex)
            }
            </div>
          </div>
        </div>

        {/* Bottom toolbar — same for all types */}
        <div className="flex-shrink-0 border-t border-outline-variant/50 px-4 py-2 flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-1.5">
            {(['en', 'ta'] as SupportedBuilderLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => { setActiveLanguage(l); setGlobalLanguage(l as 'en' | 'ta'); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  lang === l ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high border border-outline-variant'
                }`}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
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
            />
          </div>
          <select
            value={question.questionType}
            onChange={(e) => changeQuestionType(selectedQuestionIndex, e.target.value as QuestionType)}
            className="border border-outline-variant rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container text-on-surface-variant"
          >
            {typeSelectOptions}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-surface-container-low">
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
