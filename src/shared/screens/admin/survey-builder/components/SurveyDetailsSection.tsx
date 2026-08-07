// components/SurveyDetailsSection.tsx
//
// Full-width survey details section shown before entering the question builder.
// Contains: language toggle, metadata form (Label/Description/Instructions),
// template settings (Layout, Mode, Industry, Allow Anonymous),
// and a CTA to switch to the question builder section.
//
// Capture fields (conversation audio / respondent photo) are no longer
// manually configured here — the backend now defaults them automatically
// for every client-company-owned template (see
// SurveyTemplateService._normaliseTemplateData in thought-metrics-web-api).

import React, { useEffect } from 'react';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  onContinue: () => void;
}

const SurveyDetailsSection: React.FC<Props> = ({ onContinue }) => {
  const {
    translations,
    settings,
    activeLanguage,
    setTranslation,
    setSettings,
  } = useSurveyBuilderStore();

  const t = translations[activeLanguage];

  // Enforce hidden defaults: mode = public (respondent), industry = Others
  useEffect(() => {
    const updates: Record<string, unknown> = {};
    if (!settings.defaultType) updates.defaultType = 'respondent';
    if (!settings.industry) updates.industry = 'Others';
    if (Object.keys(updates).length > 0) setSettings(updates as any);
  }, []);

  return (
    <div className="h-full flex flex-col bg-surface-container-low">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-3">
          {/* ── Metadata ── */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-on-surface">
              Survey Details ({activeLanguage.toUpperCase()})
            </h2>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Label
              </label>
              <input
                type="text"
                value={t.label}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'label', e.target.value)
                }
                placeholder="Survey display title"
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Description
              </label>
              <textarea
                value={t.description}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'description', e.target.value)
                }
                placeholder="Brief description of the survey"
                rows={3}
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Instructions
              </label>
              <textarea
                value={t.instructions}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'instructions', e.target.value)
                }
                placeholder="Instructions shown before the survey starts"
                rows={4}
                className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* ── Settings ── */}
          <div className="space-y-3">
            {/* Layout */}
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-2">
                Layout
              </label>
              <div className="flex gap-2">
                {(
                  [
                    { value: 'paginated', label: 'Show questions one by one' },
                    { value: 'list', label: 'Show all questions in scroll' },
                  ] as const
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSettings({ defaultFormLayout: value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                      settings.defaultFormLayout === value
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* Allow Anonymous */}
              <div className="flex items-center gap-2 py-1">
                <div>
                  <span className="text-sm font-medium text-on-surface-variant">
                    Allow Anonymous Responses
                  </span>
                  <p className="text-xs text-outline mt-0.5">
                    Allow users without accounts to respond
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ allowAnonymous: !settings.allowAnonymous })
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ml-4 ${
                    settings.allowAnonymous ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                      settings.allowAnonymous
                        ? 'translate-x-4'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* ── CTA ── */}
              <div className="pt-4 pb-8">
                <button
                  onClick={onContinue}
                  className="w-full py-3 px-6 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                >
                  All Setup. Let's build the survey &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDetailsSection;
