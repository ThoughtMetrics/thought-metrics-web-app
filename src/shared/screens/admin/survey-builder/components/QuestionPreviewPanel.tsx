// components/QuestionPreviewPanel.tsx
//
// Centre panel of the survey builder.
//
// View modes:
//   - Single (paginated): shows the selected question in static read-only preview.
//     When "Show Preview" is active it switches to an interactive walk-through
//     of all questions starting from q1, with real Back/Next navigation and
//     conditional visibility.
//   - List: renders all questions in a scrollable list.
//     When "Show Preview" is active, questions become interactive and
//     conditional visibility hides/shows questions based on answers.
//
// Coupling kept low: reads from the survey-builder store, passes plain data
// props to BuilderQuestionPreview. BuilderQuestionPreview has no store dep.

import React, { useState, useCallback, useMemo } from 'react';
import { Play, X } from 'lucide-react';
import type { IBuilderShowIfCondition, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import TemplateMetadataForm from './TemplateMetadataForm';
import { BuilderQuestionPreview } from './BuilderQuestionPreview';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = 'single' | 'list';
type DeviceView = 'desktop' | 'mobile';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LANG_LABELS: Record<SupportedBuilderLanguage, string> = {
  en: 'English',
  ta: 'Tamil',
};

// ---------------------------------------------------------------------------
// Small internal icon components
// ---------------------------------------------------------------------------

const SingleViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className={`w-4 h-4 ${active ? 'text-on-surface' : 'text-outline'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className={`w-4 h-4 ${active ? 'text-on-surface' : 'text-outline'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"
    />
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
// Conditional visibility helpers
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
// QuestionPreviewPanel
// ---------------------------------------------------------------------------

const QuestionPreviewPanel: React.FC = () => {
  const { questions, selectedQuestionIndex, activeLanguage, setActiveLanguage } =
    useSurveyBuilderStore();

  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');

  // ── Show Preview state ───────────────────────────────────────────────────
  // showPreview: interactive mode active (works in both single + list modes)
  const [showPreview, setShowPreview] = useState(false);
  // previewAnswers: tracks answers for conditional visibility
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, string>>({});
  // previewNavIdx: current step in the paginated walk-through (Show Preview + single mode)
  const [previewNavIdx, setPreviewNavIdx] = useState(0);
  // previewDone: reached the end of the paginated walk-through
  const [previewDone, setPreviewDone] = useState(false);

  // Visible question indices based on current preview answers (for conditional logic)
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

  // ── Toolbar ──────────────────────────────────────────────────────────────
  const toolbar = (
    <div className="flex items-center justify-between p-3 border-b border-outline-variant bg-surface-container shrink-0">
      {/* Left: Language tabs + Device dropdown */}
      <div className="flex items-center gap-2">
        {/* Language tabs */}
        <div className="flex gap-1">
          {(['en', 'ta'] as SupportedBuilderLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLanguage(lang)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                activeLanguage === lang
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant'
              }`}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Device view dropdown */}
        <div className="relative">
          <select
            value={deviceView}
            onChange={(e) => setDeviceView(e.target.value as DeviceView)}
            className="appearance-none pl-7 pr-6 py-1.5 rounded text-xs font-medium bg-surface-container-high text-on-surface-variant hover:bg-outline-variant border-none outline-none cursor-pointer transition-colors"
          >
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-outline">
            {deviceView === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
          </span>
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-outline">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Show Preview toggle — visible in both view modes */}
        {!showPreview ? (
          <button
            type="button"
            onClick={enterPreview}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded font-medium bg-surface-container-high text-on-surface-variant hover:bg-outline-variant transition-colors"
          >
            <Play size={11} />
            Show Preview
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

        {/* View-mode toggle */}
        <div className="flex items-center bg-surface-container-high rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            title="Single question view"
            onClick={() => { setViewMode('single'); exitPreview(); }}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'single' ? 'bg-surface-container shadow-sm' : 'hover:text-on-surface'
            }`}
          >
            <SingleViewIcon active={viewMode === 'single'} />
          </button>
          <button
            type="button"
            title="All questions list view"
            onClick={() => { setViewMode('list'); exitPreview(); }}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'list' ? 'bg-surface-container shadow-sm' : 'hover:text-on-surface'
            }`}
          >
            <ListViewIcon active={viewMode === 'list'} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── Mobile frame wrapper ─────────────────────────────────────────────────
  const withDeviceFrame = (children: React.ReactNode) => {
    if (deviceView === 'desktop') {
      return <>{children}</>;
    }
    return (
      <div className="flex-1 overflow-y-auto flex items-start justify-center bg-surface-container-high py-6">
        <div
          className="relative bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col"
          style={{ width: 390, minHeight: 720 }}
        >
          <div className="flex items-center justify-center pt-3 pb-1 shrink-0">
            <div className="w-24 h-5 bg-gray-800 rounded-full" />
          </div>
          <div
            className="mx-2 mb-2 rounded-[1.75rem] bg-surface-container overflow-hidden flex flex-col"
            style={{ flex: 1 }}
          >
            {children}
          </div>
          <div className="flex items-center justify-center py-2 shrink-0">
            <div className="w-20 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  // ── LIST MODE ─────────────────────────────────────────────────────────────

  if (viewMode === 'list') {
    const renderListContent = () => {
      if (questions.length === 0) {
        return (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-outline">No questions added yet.</p>
          </div>
        );
      }

      const displayIndices = showPreview
        ? visiblePreviewIndices
        : questions.map((_, i) => i);

      return (
        <div className="space-y-4">
          {showPreview && (
            <div className="mb-1 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">
                Preview mode: answers update conditional logic in real-time.
              </p>
            </div>
          )}
          {displayIndices.map((qIdx, displayIdx) => {
            const question = questions[qIdx];
            return (
              <div key={question.id} className="p-4 md:p-6 border border-custom-grey-2 bg-surface-container rounded-xl">
                <BuilderQuestionPreview
                  question={question}
                  lang={activeLanguage}
                  questionNumber={displayIdx + 1}
                  totalQuestions={displayIndices.length}
                  previewLayout="list"
                  interactive={showPreview}
                  onAnswerChange={showPreview ? (v) => handleAnswerChange(question.id, v) : undefined}
                />
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col bg-surface-container-low">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {renderListContent()}
            </div>
          </div>
        ) : (
          withDeviceFrame(
            <div className="overflow-y-auto flex-1">
              <div className="p-4">
                {renderListContent()}
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  // ── SINGLE MODE + SHOW PREVIEW: walk-through all questions ───────────────

  if (showPreview) {
    const renderPreviewWalkthrough = () => {
      if (questions.length === 0) {
        return (
          <div className="flex items-center justify-center flex-1">
            <p className="text-sm text-outline">No questions added yet.</p>
          </div>
        );
      }

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
            <p className="text-sm text-outline">No visible questions based on current answers.</p>
          </div>
        );
      }

      const safeIdx = Math.min(previewNavIdx, visiblePreviewIndices.length - 1);
      const qIdx = visiblePreviewIndices[safeIdx];
      const question = questions[qIdx];
      const isFirst = safeIdx === 0;
      const isLast = safeIdx === visiblePreviewIndices.length - 1;

      return (
        <div className="flex-1 overflow-hidden flex bg-surface-container accent-primary caret-primary scheme-light">
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
      );
    };

    return (
      <div className="h-full flex flex-col bg-surface-container-low">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderPreviewWalkthrough()}
          </div>
        ) : (
          withDeviceFrame(
            <div className="flex-1 overflow-hidden flex flex-col">
              {renderPreviewWalkthrough()}
            </div>
          )
        )}
      </div>
    );
  }

  // ── SINGLE MODE (static): selected question or metadata form ─────────────

  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full flex flex-col bg-surface-container-low">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-y-auto">
            <TemplateMetadataForm activeLanguage={activeLanguage} />
          </div>
        ) : (
          withDeviceFrame(
            <div className="overflow-y-auto flex-1">
              <TemplateMetadataForm activeLanguage={activeLanguage} />
            </div>
          )
        )}
      </div>
    );
  }

  const question = questions[selectedQuestionIndex];
  if (!question) return null;

  const hasCondition = !!(
    question.config.showIf ||
    question.config.showIfAll?.length ||
    question.config.showIfAny?.length
  );

  return (
    <div className="h-full flex flex-col bg-surface-container-low">
      {toolbar}
      {hasCondition && (
        <div className="shrink-0 px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">IF</span>
          <span className="text-xs text-amber-700">
            This question has conditional logic — it may be hidden for some respondents.
          </span>
        </div>
      )}
      {deviceView === 'desktop' ? (
        <div className="flex-1 overflow-hidden flex bg-surface-container accent-primary caret-primary scheme-light">
          <BuilderQuestionPreview
            question={question}
            lang={activeLanguage}
            questionNumber={question.order}
            totalQuestions={questions.length}
            previewLayout="paginated"
          />
        </div>
      ) : (
        withDeviceFrame(
          <div className="flex-1 overflow-hidden flex bg-surface-container accent-primary caret-primary scheme-light">
            <BuilderQuestionPreview
              question={question}
              lang={activeLanguage}
              questionNumber={question.order}
              totalQuestions={questions.length}
              previewLayout="paginated"
            />
          </div>
        )
      )}
    </div>
  );
};

export default QuestionPreviewPanel;
