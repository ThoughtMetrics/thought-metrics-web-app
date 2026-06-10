// components/TemplateMetadataForm.tsx

import React from 'react';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';

interface Props {
  activeLanguage: SupportedBuilderLanguage;
}

const TemplateMetadataForm: React.FC<Props> = ({ activeLanguage }) => {
  const { translations, setTranslation } = useSurveyBuilderStore();
  const t = translations[activeLanguage];

  return (
    <div className="space-y-5 p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-on-surface">Template Info ({activeLanguage.toUpperCase()})</h3>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">Label</label>
          <input
            type="text"
            value={t.label}
            onChange={(e) => setTranslation(activeLanguage, 'label', e.target.value)}
            placeholder="Survey display title"
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">Description</label>
          <textarea
            value={t.description}
            onChange={(e) => setTranslation(activeLanguage, 'description', e.target.value)}
            placeholder="Brief description of the survey"
            rows={3}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">Instructions</label>
          <textarea
            value={t.instructions}
            onChange={(e) => setTranslation(activeLanguage, 'instructions', e.target.value)}
            placeholder="Instructions shown before the survey starts"
            rows={4}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateMetadataForm;
