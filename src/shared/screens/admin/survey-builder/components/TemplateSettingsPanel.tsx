// components/TemplateSettingsPanel.tsx

import React from 'react';
import type { ISurveyCaptureField } from '@/core/types/survey.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

const CAPTURE_TYPES: ISurveyCaptureField['type'][] = ['image', 'audio', 'video', 'file', 'text'];
const STORE_PATHS: ISurveyCaptureField['storePath'][] = ['root', 'respondent', 'captureData'];

const TemplateSettingsPanel: React.FC = () => {
  const { settings, setSettings } = useSurveyBuilderStore();

  const captureFields = settings.captureFields ?? [];

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
    next[i] = { ...next[i], ...partial };
    setSettings({ captureFields: next });
  };

  const removeField = (i: number) => {
    setSettings({ captureFields: captureFields.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Form Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Default Form Layout</label>
            <div className="flex gap-3">
              {(['paginated', 'list'] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => setSettings({ defaultFormLayout: layout })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    settings.defaultFormLayout === layout
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {layout}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Default Survey Type</label>
            <div className="flex gap-3">
              {(['respondent', 'agent'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSettings({ defaultType: t })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    settings.defaultType === t
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-gray-700">Allow Anonymous Responses</span>
              <p className="text-xs text-gray-400 mt-0.5">Allow users without accounts to respond</p>
            </div>
            <button
              onClick={() => setSettings({ allowAnonymous: !settings.allowAnonymous })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                settings.allowAnonymous ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                  settings.allowAnonymous ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Capture Fields</h3>
          <button onClick={addField} className="text-xs text-primary hover:underline font-medium">
            + Add Field
          </button>
        </div>

        {captureFields.length === 0 && (
          <p className="text-xs text-gray-400">No extra capture fields. Add one to capture photos, audio, etc.</p>
        )}

        <div className="space-y-4">
          {captureFields.map((field, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Field {i + 1}</span>
                <button
                  onClick={() => removeField(i)}
                  className="text-red-400 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Key</label>
                  <input
                    type="text"
                    value={field.key}
                    onChange={(e) => updateField(i, { key: e.target.value })}
                    placeholder="respondentPic"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label</label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(i, { label: e.target.value })}
                    placeholder="Respondent Photo"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) => updateField(i, { type: e.target.value as ISurveyCaptureField['type'] })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    {CAPTURE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Store Path</label>
                  <select
                    value={field.storePath ?? 'root'}
                    onChange={(e) => updateField(i, { storePath: e.target.value as ISurveyCaptureField['storePath'] })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                  >
                    {STORE_PATHS.map((p) => (
                      <option key={p} value={p}>{p}</option>
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
                <span className="text-xs text-gray-700">Required</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSettingsPanel;
