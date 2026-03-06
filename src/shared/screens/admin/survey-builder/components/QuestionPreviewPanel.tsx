// components/QuestionPreviewPanel.tsx
//
// Centre panel of the survey builder.
//
// Responsibilities:
//   - Language toggle (EN / TA) — controls which translation is previewed.
//   - View-mode toggle (single | list) — controls how questions are displayed.
//   - Single mode: shows the selected question in paginated layout (Back/Next/
//     progress bar identical to what respondents see). Falls back to
//     TemplateMetadataForm when no question is selected.
//   - List mode: renders every question in the scrollable list layout.
//
// Coupling kept low: this component reads from the survey-builder store and
// passes plain data props to BuilderQuestionPreview. BuilderQuestionPreview
// has no store dependency — it is a pure mapping component.

import React, { useState } from 'react';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
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
// Small internal icon components — avoids importing a whole icon library.
// ---------------------------------------------------------------------------

const SingleViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const ListViewIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    className={`w-4 h-4 ${active ? 'text-black' : 'text-gray-400'}`}
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
// QuestionPreviewPanel
// ---------------------------------------------------------------------------

const QuestionPreviewPanel: React.FC = () => {
  const { questions, selectedQuestionIndex, activeLanguage, setActiveLanguage } =
    useSurveyBuilderStore();

  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [deviceView, setDeviceView] = useState<DeviceView>('desktop');

  // ── Toolbar (language tabs + device dropdown + view-mode toggle) ─────────
  const toolbar = (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white shrink-0">
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
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            className="appearance-none pl-7 pr-6 py-1.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border-none outline-none cursor-pointer transition-colors"
          >
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
          {/* Icon overlay */}
          <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
            {deviceView === 'desktop' ? <DesktopIcon /> : <MobileIcon />}
          </span>
          {/* Chevron */}
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* View-mode toggle */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
        <button
          type="button"
          title="Single question view"
          onClick={() => setViewMode('single')}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === 'single' ? 'bg-white shadow-sm' : 'hover:text-black'
          }`}
        >
          <SingleViewIcon active={viewMode === 'single'} />
        </button>
        <button
          type="button"
          title="All questions list view"
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-md transition-all ${
            viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:text-black'
          }`}
        >
          <ListViewIcon active={viewMode === 'list'} />
        </button>
      </div>
    </div>
  );

  // ── Mobile frame wrapper ─────────────────────────────────────────────────
  // Wraps children in a phone-shaped frame when deviceView === 'mobile'.
  const withDeviceFrame = (children: React.ReactNode, scrollable = false) => {
    if (deviceView === 'desktop') {
      return <>{children}</>;
    }
    return (
      <div className="flex-1 overflow-y-auto flex items-start justify-center bg-gray-100 py-6">
        <div
          className="relative bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col"
          style={{ width: 390, minHeight: 720 }}
        >
          {/* Status bar notch */}
          <div className="flex items-center justify-center pt-3 pb-1 shrink-0">
            <div className="w-24 h-5 bg-gray-800 rounded-full" />
          </div>
          {/* Screen */}
          <div
            className={`mx-2 mb-2 rounded-[1.75rem] bg-white overflow-hidden flex flex-col ${scrollable ? 'overflow-y-auto' : ''}`}
            style={{ flex: 1 }}
          >
            {children}
          </div>
          {/* Home indicator */}
          <div className="flex items-center justify-center py-2 shrink-0">
            <div className="w-20 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  // ── List mode: all questions scrollable ─────────────────────────────────
  if (viewMode === 'list') {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {toolbar}
        {deviceView === 'desktop' ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {questions.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <p className="text-sm text-gray-400">No questions added yet.</p>
                </div>
              ) : (
                questions.map((question, idx) => (
                  <div
                    key={question.id}
                    className="p-4 md:p-6 border border-custom-grey-2 bg-white rounded-xl"
                  >
                    <BuilderQuestionPreview
                      question={question}
                      lang={activeLanguage}
                      questionNumber={idx + 1}
                      totalQuestions={questions.length}
                      previewLayout="list"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          withDeviceFrame(
            <div className="overflow-y-auto flex-1">
              <div className="p-4 space-y-4">
                {questions.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <p className="text-sm text-gray-400">No questions added yet.</p>
                  </div>
                ) : (
                  questions.map((question, idx) => (
                    <div
                      key={question.id}
                      className="p-3 border border-custom-grey-2 bg-white rounded-xl"
                    >
                      <BuilderQuestionPreview
                        question={question}
                        lang={activeLanguage}
                        questionNumber={idx + 1}
                        totalQuestions={questions.length}
                        previewLayout="list"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  // ── Single mode: selected question or metadata form ─────────────────────
  // When no question is selected, show the template metadata form.
  if (selectedQuestionIndex === null) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
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

  // Single mode with a selected question: render in full paginated layout
  // (Back/Next/progress bar) — identical to what respondents see.
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {toolbar}
      {deviceView === 'desktop' ? (
        /* Matches the paginated survey page wrapper so colours and layout are identical */
        <div className="flex-1 overflow-hidden flex bg-white accent-primary caret-primary scheme-light">
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
          <div className="flex-1 overflow-hidden flex bg-white accent-primary caret-primary scheme-light">
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
