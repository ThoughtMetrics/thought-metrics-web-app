// components/TemplateSettingsPanel.tsx

import React from 'react';
import type { ISurveyCaptureField } from '@/core/types/survey.type';
import type { SurveyMethodology } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { SURVEY_METHODOLOGY_META, METHODOLOGY_BADGE_COLOR } from '@/core/constants/survey.constants';

const INDUSTRY_OPTIONS = [
  'All Industries', 'Advertising & Marketing', 'Automotive', 'Education',
  'Financial Services & Insurance', 'FMCG', 'Healthcare & Life Sciences',
  'Human Resources', 'Internet & Media', 'Investor & Private Equity',
  'Retail & Merchandising', 'Technology', 'Fitness & Wellness',
  'Apparel', 'Political', 'Others',
];

const CAPTURE_TYPES: ISurveyCaptureField['type'][] = ['image', 'audio', 'video', 'file', 'text'];

function labelToKey(label: string): string {
  return label
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((word, i) => i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const TemplateSettingsPanel: React.FC = () => {
  const { settings, setSettings } = useSurveyBuilderStore();

  const captureFields = settings.captureFields ?? [];

  // Keys that are always stored at the root level of the response document
  // (handled specially by the server — never in captureData)
  const ROOT_LEVEL_KEYS = new Set(['conversationAudio', 'respondentPic']);

  const addField = () => {
    setSettings({
      captureFields: [
        ...captureFields,
        { key: '', label: '', type: 'text', required: false, storePath: 'root' },
      ],
    });
  };

  const updateField = (i: number, partial: Partial<ISurveyCaptureField>) => {
    const next = [...captureFields];
    const updated = { ...next[i], ...partial };
    if ('label' in partial) {
      updated.key = labelToKey(partial.label ?? '');
    }
    // Root-level built-in keys must always use storePath 'root'
    if (ROOT_LEVEL_KEYS.has(updated.key)) {
      updated.storePath = 'root';
    }
    next[i] = updated;
    setSettings({ captureFields: next });
  };

  const removeField = (i: number) => {
    setSettings({ captureFields: captureFields.filter((_, idx) => idx !== i) });
  };

  const methodology = settings.methodology as SurveyMethodology | undefined;
  const methodMeta = methodology ? SURVEY_METHODOLOGY_META[methodology] : undefined;

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Form Settings</h3>

        <div className="space-y-4">
          {methodMeta && (
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">Methodology</label>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${METHODOLOGY_BADGE_COLOR[methodMeta.category]}`}>
                {methodMeta.label}
              </span>
              <p className="text-xs text-outline mt-1">{methodMeta.description}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-2">Layout</label>
            <div className="flex gap-3">
              {(['paginated', 'list'] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => setSettings({ defaultFormLayout: layout })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    settings.defaultFormLayout === layout
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary'
                  }`}
                >
                  {layout === 'paginated' ? 'Paged' : 'List'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-2">Mode</label>
            <div className="flex gap-3">
              {(['respondent', 'agent'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings({ defaultType: t })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    settings.defaultType === t
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-container text-on-surface-variant border-outline-variant hover:border-primary'
                  }`}
                >
                  {t === 'respondent' ? 'Public' : 'Agent'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Industry</label>
            <select
              value={settings.industry ?? 'Others'}
              onChange={(e) => setSettings({ industry: e.target.value })}
              className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
            >
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <p className="text-xs text-outline mt-1">Sets the survey ID prefix (e.g. TM-POL001)</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-on-surface-variant">Allow Anonymous Responses</span>
              <p className="text-xs text-outline mt-0.5">Allow users without accounts to respond</p>
            </div>
            <button
              onClick={() => setSettings({ allowAnonymous: !settings.allowAnonymous })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                settings.allowAnonymous ? 'bg-primary' : 'bg-outline-variant'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-surface-container transition-transform shadow ${
                  settings.allowAnonymous ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface">Capture Fields</h3>
          <button onClick={addField} className="text-xs text-primary hover:underline font-medium">
            + Add Field
          </button>
        </div>

        {captureFields.length === 0 && (
          <p className="text-xs text-outline">No extra capture fields. Add one to capture photos, audio, etc.</p>
        )}

        <div className="space-y-4">
          {captureFields.map((field, i) => (
            <div key={i} className="border border-outline-variant rounded-lg p-3 space-y-2 bg-surface-container-low">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-on-surface-variant">Field {i + 1}</span>
                <button
                  onClick={() => removeField(i)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-outline mb-1">Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    placeholder="Respondent Photo"
                    className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                  />
                  {field.key && (
                    <p className="text-xs text-outline mt-1">Key: <span className="font-mono">{field.key}</span></p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-outline mb-1">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(i, { type: e.target.value as ISurveyCaptureField['type'] })}
                    className="w-full border border-outline-variant rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-surface-container"
                  >
                    {CAPTURE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.required ?? false}
                  onChange={(e) => updateField(i, { required: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs text-on-surface-variant">Required</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSettingsPanel;
