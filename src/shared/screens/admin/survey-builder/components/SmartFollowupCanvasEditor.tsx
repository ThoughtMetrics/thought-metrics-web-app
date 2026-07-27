// components/SmartFollowupCanvasEditor.tsx
//
// Canvas editor for SMART_FOLLOWUP questions.
// Shows: a source-question picker (filtered to prior TEXT/TEXTAREA questions),
// an AI instructions textarea, and a static "AI-generated question" preview
// placeholder (actual generation only happens at respondent time via the
// backend ai-followup endpoint).

import React from 'react';
import { QuestionType } from '@/core/types/survey.type';
import type { IBuilderQuestion, SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
  lang: SupportedBuilderLanguage;
}

const SmartFollowupCanvasEditor: React.FC<Props> = ({ question, qIdx, lang }) => {
  const { questions, setQuestionConfig } = useSurveyBuilderStore();

  const cfg = question.config;

  const eligibleSourceQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter(
      ({ q, i }) =>
        i < qIdx &&
        (q.questionType === QuestionType.TEXT || q.questionType === QuestionType.TEXTAREA)
    );

  const handleSourceChange = (sourceQuestionId: string) => {
    setQuestionConfig(qIdx, { sourceQuestionId: sourceQuestionId || undefined });
  };

  const handleInstructionsChange = (aiInstructions: string) => {
    setQuestionConfig(qIdx, { aiInstructions });
  };

  return (
    <div className="space-y-4">
      {/* Source question picker */}
      <div>
        <label className="block text-xs font-semibold text-outline uppercase tracking-wide mb-1.5">
          Source question
        </label>
        {eligibleSourceQuestions.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            No open-ended (Text / Long Text) questions exist earlier in this survey. Add one before this
            question to use as the source answer for the AI follow-up.
          </p>
        ) : (
          <select
            value={cfg.sourceQuestionId ?? ''}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="">Select a question…</option>
            {eligibleSourceQuestions.map(({ q, i }) => (
              <option key={q.id} value={q.id}>
                Q{i + 1}: {q.translations[lang].text || q.text || '(untitled question)'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* AI instructions */}
      <div>
        <label className="block text-xs font-semibold text-outline uppercase tracking-wide mb-1.5">
          AI instructions
        </label>
        <textarea
          rows={3}
          value={cfg.aiInstructions ?? ''}
          onChange={(e) => handleInstructionsChange(e.target.value)}
          placeholder="e.g. Ask why they gave that answer, or probe for specific product features mentioned."
          className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-outline/40 focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {/* Preview placeholder */}
      <div className="flex items-start gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-sm">
        <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-600">
          AI
        </span>
        <span className="text-on-surface-variant">
          The follow-up question is generated live for each respondent based on their answer to the
          source question — it cannot be previewed statically here.
        </span>
      </div>
    </div>
  );
};

export default SmartFollowupCanvasEditor;
