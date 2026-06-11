// components/BuilderLanguageCompact.tsx
//
// Compact language switcher wired to the survey builder store.
// Mirrors the visual design of <LanguageToggle variant="compact" /> but
// reads/writes activeLanguage from useSurveyBuilderStore instead of the
// global language store (which manages survey display language).

import React, { useEffect, useRef, useState } from 'react';
import type { SupportedBuilderLanguage } from '@/core/types/survey-builder.type';
import { useSurveyBuilderStore } from '@/core/stores/survey-builder.store';
import { useSetLanguage } from '@/core/stores/language.store';

const LANG_LABELS: Record<SupportedBuilderLanguage, string> = { en: 'English', ta: 'Tamil' };

export const BuilderLanguageCompact: React.FC = () => {
  const { activeLanguage, setActiveLanguage } = useSurveyBuilderStore();
  const setGlobalLanguage = useSetLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-custom-grey-1 hover:bg-custom-grey-2 text-custom-text-dark font-medium text-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="uppercase">{activeLanguage}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 py-2 bg-surface-container rounded-lg shadow-lg border border-custom-grey-2 min-w-[160px] right-0">
          {(Object.keys(LANG_LABELS) as SupportedBuilderLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => { setActiveLanguage(lang); setGlobalLanguage(lang as 'en' | 'ta'); setIsOpen(false); }}
              role="option"
              aria-selected={activeLanguage === lang}
              className={`w-full px-4 py-2 text-left text-sm transition-colors duration-150 focus:outline-none focus:bg-custom-grey-2 ${
                activeLanguage === lang
                  ? 'bg-primary text-on-primary font-medium'
                  : 'text-custom-text-dark hover:bg-custom-grey-1'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{LANG_LABELS[lang]}</span>
                {activeLanguage === lang && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuilderLanguageCompact;
