// components/KanoModelCanvasEditor.tsx
//
// Canvas editor for KANO_MODEL questions.
// Shows: product name, optional intro text, functional/dysfunctional question
// templates with [Feature] token hints, fixed 5-point response scale preview,
// and a manageable feature list.

import React, { useId } from 'react';
import type { IBuilderQuestion } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  question: IBuilderQuestion;
  qIdx: number;
}

const SCALE_POINTS = [
  { label: 'Delighted', cls: 'border-green-500/30 text-green-400 bg-green-500/10 [[data-theme=\'light\']_&]:text-green-700' },
  { label: 'Expect it', cls: 'border-outline-variant text-on-surface-variant' },
  { label: 'Neutral', cls: 'border-outline-variant text-on-surface-variant' },
  { label: 'Can live with it', cls: 'border-outline-variant text-on-surface-variant' },
  { label: 'Displeased', cls: 'border-red-500/30 text-red-400 bg-red-500/10 [[data-theme=\'light\']_&]:text-red-700' },
];

const KanoModelCanvasEditor: React.FC<Props> = ({ question, qIdx }) => {
  const { setQuestionConfig } = useSurveyBuilderStore();
  const uid = useId();
  const cfg = question.config;

  const features: string[] = cfg.kanoFeatures ?? ['Feature 1', 'Feature 2', 'Feature 3'];
  const featureCount = features.length;
  const questionCount = featureCount * 2;

  const setFeatures = (next: string[]) => setQuestionConfig(qIdx, { kanoFeatures: next });

  const updateFeature = (i: number, value: string) => {
    const next = [...features];
    next[i] = value;
    setFeatures(next);
  };

  const removeFeature = (i: number) => {
    if (features.length <= 1) return;
    setFeatures(features.filter((_, idx) => idx !== i));
  };

  const addFeature = () => {
    setFeatures([...features, `Feature ${features.length + 1}`]);
  };

  return (
    <div className="space-y-4">

      {/* Product name + introductory text */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-xs font-semibold text-outline uppercase tracking-wide mb-1.5">
            Product name
          </span>
          <input
            type="text"
            value={cfg.kanoProductName ?? ''}
            placeholder="e.g. Wireless Earbuds"
            onChange={(e) => setQuestionConfig(qIdx, { kanoProductName: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm font-medium text-on-surface placeholder-outline/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <span className="block text-xs font-semibold text-outline uppercase tracking-wide mb-1.5">
            Introductory text
            <span className="ml-1 normal-case font-normal text-outline/70">(optional)</span>
          </span>
          <input
            type="text"
            value={cfg.kanoIntroText ?? ''}
            placeholder="Shown before feature questions begin..."
            onChange={(e) => setQuestionConfig(qIdx, { kanoIntroText: e.target.value })}
            className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-outline/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <hr className="border-outline-variant" />

      {/* Question templates */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-semibold text-outline uppercase tracking-wide">Question templates</span>
          <span
            title="These templates apply to every feature. Use [Feature] as a placeholder — it will be replaced with the actual feature name for each question pair."
            className="cursor-default"
          >
            <svg className="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11v5M12 8h.01" />
            </svg>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Functional */}
          <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant bg-surface-container/60">
              <span className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-outline uppercase tracking-wide">Functional</span>
              <span className="ml-auto text-xs text-outline font-normal normal-case tracking-normal">
                If feature IS present
              </span>
            </div>
            <div className="px-3 py-2.5 space-y-1.5">
              <textarea
                id={`${uid}-func`}
                rows={3}
                value={cfg.kanoFunctionalTemplate ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { kanoFunctionalTemplate: e.target.value })}
                className="w-full bg-transparent text-sm text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-outline">
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container border border-teal-500/30 text-teal-400 [[data-theme='light']_&]:text-teal-700 text-[10px] font-semibold">
                  [Feature]
                </span>
                replaced with each feature name
              </div>
            </div>
          </div>

          {/* Dysfunctional */}
          <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant bg-surface-container/60">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-outline uppercase tracking-wide">Dysfunctional</span>
              <span className="ml-auto text-xs text-outline font-normal normal-case tracking-normal">
                If feature NOT present
              </span>
            </div>
            <div className="px-3 py-2.5 space-y-1.5">
              <textarea
                id={`${uid}-dysfunc`}
                rows={3}
                value={cfg.kanoDysfunctionalTemplate ?? ''}
                onChange={(e) => setQuestionConfig(qIdx, { kanoDysfunctionalTemplate: e.target.value })}
                className="w-full bg-transparent text-sm text-on-surface-variant placeholder-outline/40 focus:outline-none resize-none"
              />
              <div className="flex items-center gap-1.5 text-xs text-outline">
                <span className="px-1.5 py-0.5 rounded-full bg-surface-container border border-teal-500/30 text-teal-400 [[data-theme='light']_&]:text-teal-700 text-[10px] font-semibold">
                  [Feature]
                </span>
                replaced with each feature name
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed 5-point response scale */}
      <div className="flex items-center gap-1.5 flex-wrap bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5">
        <span className="text-xs text-outline mr-1 flex-shrink-0">Response scale:</span>
        {SCALE_POINTS.map((pt, i) => (
          <React.Fragment key={pt.label}>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border ${pt.cls}`}>
              {pt.label}
            </span>
            {i < SCALE_POINTS.length - 1 && (
              <span className="text-outline text-xs">›</span>
            )}
          </React.Fragment>
        ))}
        <span className="ml-auto text-xs text-outline/60 flex-shrink-0">Fixed — applied to all features</span>
      </div>

      <hr className="border-outline-variant" />

      {/* Feature list */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-outline uppercase tracking-wide">Features</span>
          <span className="text-xs bg-surface-container-high border border-outline-variant text-on-surface-variant px-2 py-0.5 rounded-full">
            {featureCount} {featureCount === 1 ? 'feature' : 'features'} · {questionCount} questions
          </span>
        </div>

        <div className="space-y-1.5">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-xs text-outline w-5 text-right flex-shrink-0 tabular-nums">{i + 1}</span>
              <div className="flex-1 flex items-center gap-2 bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 hover:border-outline-variant transition-colors">
                <svg
                  className="w-3.5 h-3.5 text-outline/40 flex-shrink-0 cursor-grab"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 16a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
                <input
                  type="text"
                  value={feat}
                  placeholder="Type a feature..."
                  onChange={(e) => updateFeature(i, e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-sm text-on-surface placeholder-outline/40 focus:outline-none"
                />
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 [[data-theme='light']_&]:text-teal-700 flex-shrink-0">
                  2 questions
                </span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  disabled={features.length <= 1}
                  title="Remove feature"
                  className="text-outline hover:text-red-500 p-0.5 rounded transition-colors disabled:opacity-20"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
                    <path strokeLinecap="round" strokeWidth={1.5} d="M9 9l6 6M15 9l-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-outline-variant rounded-lg text-xs text-outline hover:border-primary hover:text-primary transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add feature
        </button>
      </div>

    </div>
  );
};

export default KanoModelCanvasEditor;
