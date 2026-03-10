// components/PublishSurveyModal.tsx

import React, { useEffect, useRef, useState } from 'react';
import { usePublishSurvey, useSaveSurveyDraft } from '@/core/hooks/mutations/survey-template.mutations';
import type { ISurveyPublishRequest } from '@/core/types/survey-builder.type';
import type { SurveyFormLayout } from '@/core/types/survey.type';

interface Props {
  templateId: string;
  defaultLabel: string;
  defaultFormLayout: SurveyFormLayout;
  defaultType?: 'respondent' | 'agent';
  onClose: () => void;
}

const PublishSurveyModal: React.FC<Props> = ({ templateId, defaultLabel, defaultFormLayout, defaultType = 'respondent', onClose }) => {
  const publish = usePublishSurvey();
  const saveDraft = useSaveSurveyDraft();

  const [label, setLabel] = useState(defaultLabel);
  const [surveyId, setSurveyId] = useState('');
  const [type, setType] = useState<'respondent' | 'agent'>(defaultType);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expireDate, setExpireDate] = useState('');
  const [maxResponses, setMaxResponses] = useState('');
  const [zonalBasedSurvey, setZonalBasedSurvey] = useState(false);
  const [formLayout, setFormLayout] = useState<SurveyFormLayout>(defaultFormLayout);

  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const buildPayload = (): ISurveyPublishRequest => {
    const payload: ISurveyPublishRequest = {
      templateId,
      label: label.trim(),
      type,
      visibility,
      startDate: startDate || undefined,
      expireDate: expireDate || undefined,
      maxResponses: maxResponses ? parseInt(maxResponses, 10) : undefined,
      zonalBasedSurvey,
      formLayout,
    };
    if (surveyId.trim()) payload.surveyId = surveyId.trim();
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    await publish.mutateAsync(buildPayload());
  };

  const handleSaveAsDraft = async () => {
    if (!label.trim()) return;
    await saveDraft.mutateAsync(buildPayload());
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Publish as Survey</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Survey Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Survey ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Survey ID</label>
            <input
              type="text"
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              placeholder="Auto-generated if left blank"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
            <div className="flex gap-4">
              {(['respondent', 'agent'] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{t === 'respondent' ? 'Public' : 'Agent'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
            <div className="flex gap-4">
              {(['public', 'private'] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={v}
                    checked={visibility === v}
                    onChange={() => setVisibility(v)}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expire Date</label>
              <input
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Max Responses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Responses</label>
            <input
              type="number"
              value={maxResponses}
              onChange={(e) => setMaxResponses(e.target.value)}
              min={1}
              placeholder="No limit"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Zonal Based */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Zonal Based Survey</label>
            <button
              type="button"
              onClick={() => setZonalBasedSurvey((v) => !v)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                zonalBasedSurvey ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow ${
                  zonalBasedSurvey ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Form Layout */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Layout</label>
            <div className="flex gap-4">
              {(['paginated', 'list'] as const).map((l) => (
                <label key={l} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={l}
                    checked={formLayout === l}
                    onChange={() => setFormLayout(l)}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{l}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={saveDraft.isPending || publish.isPending || !label.trim()}
              className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saveDraft.isPending ? 'Saving…' : 'Save as Draft'}
            </button>
            <button
              type="submit"
              disabled={publish.isPending || saveDraft.isPending || !label.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publish.isPending ? 'Publishing…' : 'Publish Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublishSurveyModal;
