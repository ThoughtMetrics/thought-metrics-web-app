/**
 * LanguageToggle Component
 * Reusable language switcher with multiple variants
 *
 * Variants:
 * - default: Full dropdown with language names
 * - compact: Icon + current language code
 * - icon: Icon only (for mobile)
 * - inline: Horizontal buttons (for survey pages)
 *
 * Features:
 * - Keyboard accessible
 * - Mobile responsive
 * - Smooth animations
 * - Auto-close on outside click
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  useCurrentLanguage,
  useSetLanguage,
  useAvailableLanguages,
  useIsLanguageChanging,
  LANGUAGE_NAMES,
  type SupportedLanguage
} from '@/core/stores/language.store';
import { useLanguage } from '@/core/hooks/use-language';

/**
 * Component props
 */
interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'icon' | 'inline';
  className?: string;
  showLabel?: boolean;
  position?: 'left' | 'right';
}

/**
 * LanguageToggle Component
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'default',
  className = '',
  showLabel = true,
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = useCurrentLanguage();
  const setLanguage = useSetLanguage();
  const availableLanguages = useAvailableLanguages();
  const isChanging = useIsLanguageChanging();
  const { t } = useLanguage();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle language change
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, lang: SupportedLanguage) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLanguageChange(lang);
    }
  };

  // Render inline variant (horizontal buttons)
  if (variant === 'inline') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {availableLanguages.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            disabled={isChanging}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${currentLanguage === lang
                ? 'bg-primary text-white shadow-md'
                : 'bg-custom-grey-1 text-custom-text-dark hover:bg-custom-grey-2'
              }
              ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            aria-label={`Switch to ${LANGUAGE_NAMES[lang]}`}
            aria-current={currentLanguage === lang ? 'true' : 'false'}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
    );
  }

  // Render dropdown variants (default, compact, icon)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg
          bg-custom-grey-1 hover:bg-custom-grey-2
          text-custom-text-dark font-medium text-sm
          transition-all duration-200
          ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
        aria-label={t('language.changeLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Globe Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>

        {/* Language Label */}
        {variant === 'default' && showLabel && (
          <span>{LANGUAGE_NAMES[currentLanguage]}</span>
        )}

        {variant === 'compact' && (
          <span className="uppercase">{currentLanguage}</span>
        )}

        {/* Dropdown Arrow */}
        {variant !== 'icon' && (
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 py-2
            bg-white rounded-lg shadow-lg border border-custom-grey-2
            min-w-[160px]
            ${position === 'left' ? 'left-0' : 'right-0'}
            animate-fadeIn
          `}
          role="listbox"
          aria-label={t('language.selectLanguage')}
        >
          {availableLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              onKeyDown={(e) => handleKeyDown(e, lang)}
              role="option"
              aria-selected={currentLanguage === lang}
              className={`
                w-full px-4 py-2 text-left text-sm
                transition-colors duration-150
                ${currentLanguage === lang
                  ? 'bg-primary text-white font-medium'
                  : 'text-custom-text-dark hover:bg-custom-grey-1'
                }
                focus:outline-none focus:bg-custom-grey-2
              `}
            >
              <div className="flex items-center justify-between">
                <span>{LANGUAGE_NAMES[lang]}</span>
                {currentLanguage === lang && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
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

/**
 * Export default
 */
export default LanguageToggle;
