// components/MethodologyPickerModal.tsx

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SurveyMethodology } from '@/core/types/survey.type';
import {
  SURVEY_METHODOLOGY_META,
  METHODOLOGY_CATEGORIES,
  UNAVAILABLE_METHODOLOGY_TILES,
  METHODOLOGY_BADGE_COLOR,
  type MethodologyCategory,
} from '@/core/constants/survey.constants';
import { getStarterQuestions } from '@/core/constants/survey-methodology-templates';

interface Props {
  onClose: () => void;
  redirectPath?: string;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const MethodologyPickerModal: React.FC<Props> = ({ onClose, redirectPath = '/admin/survey-builder/new' }) => {
  const [activeCategory, setActiveCategory] = useState<MethodologyCategory>('pricing_conjoint');

  const handleSelect = (methodology: SurveyMethodology) => {
    const meta = SURVEY_METHODOLOGY_META[methodology];
    const questions = getStarterQuestions(methodology);
    const prefill = {
      isDuplicate: false,
      questions,
      settings: { methodology },
      translations: {
        en: { label: meta.label, description: meta.description, instructions: '' },
        ta: { label: '', description: '', instructions: '' },
      },
      name: `${slugify(meta.label)}-${Date.now().toString().slice(-4)}`,
    };
    try {
      sessionStorage.setItem('tm-duplicate-prefill', JSON.stringify(prefill));
    } catch {}
    window.location.href = redirectPath;
  };

  const handleScratch = () => {
    window.location.href = redirectPath;
  };

  // Available methodologies for the active category
  const availableTiles = Object.entries(SURVEY_METHODOLOGY_META)
    .filter(([, meta]) => meta.category === activeCategory && meta.available)
    .map(([key, meta]) => ({ methodology: key as SurveyMethodology, ...meta }));

  // Unavailable tiles for the active category
  const unavailableTiles = UNAVAILABLE_METHODOLOGY_TILES.filter(
    (t) => t.category === activeCategory,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Choose a Survey Methodology</h2>
            <p className="text-xs text-gray-500 mt-0.5">Select a template to start with pre-built questions, or start from scratch.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex border-b border-gray-100 px-6 gap-1 overflow-x-auto">
          {METHODOLOGY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeCategory === cat.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tiles grid */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableTiles.map(({ methodology, label, description }) => (
              <button
                key={methodology}
                onClick={() => handleSelect(methodology)}
                className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${METHODOLOGY_BADGE_COLOR[activeCategory]}`}>
                  {label}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </button>
            ))}

            {unavailableTiles.map(({ label }) => (
              <div
                key={label}
                title="Coming soon"
                className="text-left p-4 rounded-xl border border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
              >
                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 bg-gray-200 text-gray-500">
                  {label}
                </div>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Pre-built templates can be fully customised after selection.</p>
          <button
            onClick={handleScratch}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium hover:underline"
          >
            Start from scratch →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodologyPickerModal;
