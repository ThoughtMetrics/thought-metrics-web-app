// components/SurveyDetailsSection.tsx
//
// Full-width survey details section shown before entering the question builder.
// Contains: language toggle, metadata form (Label/Description/Instructions),
// template settings (Layout, Mode, Industry, Allow Anonymous, Capture Fields),
// and a CTA to switch to the question builder section.

import React, { useEffect } from 'react';
import type { ISurveyCaptureField } from '@/core/types/survey.type';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  onContinue: () => void;
}

const CAPTURE_TYPES: ISurveyCaptureField['type'][] = [
  'image',
  'audio',
  'video',
  'file',
  'text',
];

const ROOT_LEVEL_KEYS = new Set(['conversationAudio', 'respondentPic']);

function labelToKey(label: string): string {
  return label
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
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
  const captureFields = settings.captureFields ?? [];

  // Enforce hidden defaults: mode = public (respondent), industry = Others
  useEffect(() => {
    const updates: Record<string, unknown> = {};
    if (!settings.defaultType) updates.defaultType = 'respondent';
    if (!settings.industry) updates.industry = 'Others';
    if (Object.keys(updates).length > 0) setSettings(updates as any);
  }, []);

  const addField = () => {
    setSettings({
      captureFields: [
        ...captureFields,
        {
          key: '',
          label: '',
          type: 'text',
          required: false,
          storePath: 'root',
        },
      ],
    });
  };

  const updateField = (i: number, partial: Partial<ISurveyCaptureField>) => {
    const next = [...captureFields];
    const updated = { ...next[i], ...partial };
    if ('label' in partial) {
      updated.key = labelToKey(partial.label ?? '');
    }
    if (ROOT_LEVEL_KEYS.has(updated.key)) {
      updated.storePath = 'root';
    }
    next[i] = updated;
    setSettings({ captureFields: next });
  };

  const removeField = (i: number) => {
    setSettings({ captureFields: captureFields.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-3">
          {/* ── Metadata ── */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              Survey Details ({activeLanguage.toUpperCase()})
            </h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={t.label}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'label', e.target.value)
                }
                placeholder="Survey display title"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={t.description}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'description', e.target.value)
                }
                placeholder="Brief description of the survey"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Instructions
              </label>
              <textarea
                value={t.instructions}
                onChange={(e) =>
                  setTranslation(activeLanguage, 'instructions', e.target.value)
                }
                placeholder="Instructions shown before the survey starts"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>
          </div>

          {/* ── Settings ── */}
          <div className="space-y-3">
            {/* Layout */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
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
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capture Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Capture Fields
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Extra data to collect alongside answers (photos, audio,
                    etc.)
                  </p>
                </div>
                <button
                  onClick={addField}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  + Add Field
                </button>
              </div>

              {captureFields.length === 0 && (
                <p className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg p-4 text-center">
                  No capture fields. Click "+ Add Field" to add photos, audio,
                  etc.
                </p>
              )}

              <div className="space-y-3">
                {captureFields.map((field, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-600">
                        Field {i + 1}
                      </span>
                      <button
                        onClick={() => removeField(i)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateField(i, { label: e.target.value })
                          }
                          placeholder="Respondent Photo"
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        />
                        {field.key && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Key: <span className="font-mono">{field.key}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            updateField(i, {
                              type: e.target
                                .value as ISurveyCaptureField['type'],
                            })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                        >
                          {CAPTURE_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required ?? false}
                        onChange={(e) =>
                          updateField(i, { required: e.target.checked })
                        }
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-xs text-gray-700">Required</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* Allow Anonymous */}
              <div className="flex items-center gap-2 py-1">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Allow Anonymous Responses
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Allow users without accounts to respond
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSettings({ allowAnonymous: !settings.allowAnonymous })
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ml-4 ${
                    settings.allowAnonymous ? 'bg-primary' : 'bg-gray-200'
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
                  className="w-full py-3 px-6 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
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
