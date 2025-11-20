/**
 * Language Store
 * Implements Observer Pattern with Zustand for state management
 * Features:
 * - localStorage persistence
 * - Type safety with TypeScript
 * - Auto-detection from browser
 * - Query invalidation on language change
 *
 * Best Practices:
 * - Singleton pattern via Zustand
 * - Separation of concerns
 * - Immutable state updates
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { queryClient } from '@/core/lib/query-client';

/**
 * Supported languages
 * Easily extensible for Hindi, Malayalam, Kannada, Telugu
 */
export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te';

/**
 * Language display names
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  ta: 'தமிழ்',
  hi: 'हिंदी',
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు'
};

/**
 * Language store state interface
 */
interface LanguageState {
  // Current language
  language: SupportedLanguage;

  // Available languages (can be controlled by admin)
  availableLanguages: SupportedLanguage[];

  // Loading state for async operations
  isChanging: boolean;

  // Actions
  setLanguage: (language: SupportedLanguage) => void;
  toggleLanguage: () => void;
  resetLanguage: () => void;
  setAvailableLanguages: (languages: SupportedLanguage[]) => void;
}

/**
 * Default language based on browser locale
 */
const getDefaultLanguage = (): SupportedLanguage => {
  // Check localStorage first
  const stored = localStorage.getItem('thought-metrics-language');
  if (stored && ['en', 'ta', 'hi', 'ml', 'kn', 'te'].includes(stored)) {
    return stored as SupportedLanguage;
  }

  // Detect from browser
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs: SupportedLanguage[] = ['en', 'ta', 'hi', 'ml', 'kn', 'te'];

  if (supportedLangs.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  // Default to English
  return 'en';
};

/**
 * Language Store
 * Uses Zustand with persistence middleware
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      // Initial state
      language: getDefaultLanguage(),
      availableLanguages: ['en', 'ta'], // Start with English and Tamil
      isChanging: false,

      /**
       * Set language and invalidate all queries
       * This triggers refetch of all data in the new language
       */
      setLanguage: (language: SupportedLanguage) => {
        const currentLanguage = get().language;

        // Skip if same language
        if (currentLanguage === language) return;

        // Set changing state
        set({ isChanging: true });

        // Update language
        set({ language });

        // Invalidate all queries to refetch in new language
        // This is crucial for the translation feature to work
        queryClient.invalidateQueries();

        // Reset changing state after a brief delay
        setTimeout(() => {
          set({ isChanging: false });
        }, 300);

        // Track language change (for analytics)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'language_change', {
            previous_language: currentLanguage,
            new_language: language
          });
        }
      },

      /**
       * Toggle between English and Tamil
       * Can be extended to cycle through all available languages
       */
      toggleLanguage: () => {
        const { language, availableLanguages } = get();
        const currentIndex = availableLanguages.indexOf(language);
        const nextIndex = (currentIndex + 1) % availableLanguages.length;
        const nextLanguage = availableLanguages[nextIndex];

        get().setLanguage(nextLanguage);
      },

      /**
       * Reset to default language (English)
       */
      resetLanguage: () => {
        get().setLanguage('en');
      },

      /**
       * Set available languages (admin control)
       */
      setAvailableLanguages: (languages: SupportedLanguage[]) => {
        set({ availableLanguages: languages });

        // If current language is not in available list, switch to first available
        const { language } = get();
        if (!languages.includes(language)) {
          get().setLanguage(languages[0]);
        }
      }
    }),
    {
      name: 'thought-metrics-language', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist language, not isChanging state
      partialize: (state) => ({ language: state.language })
    }
  )
);

/**
 * Selector hooks for better performance
 * Using selectors prevents unnecessary re-renders
 */
export const useCurrentLanguage = () => useLanguageStore((state) => state.language);
export const useSetLanguage = () => useLanguageStore((state) => state.setLanguage);
export const useToggleLanguage = () => useLanguageStore((state) => state.toggleLanguage);
export const useAvailableLanguages = () => useLanguageStore((state) => state.availableLanguages);
export const useIsLanguageChanging = () => useLanguageStore((state) => state.isChanging);

/**
 * Utility function to check if language is supported
 */
export const isLanguageSupported = (lang: string): lang is SupportedLanguage => {
  return ['en', 'ta', 'hi', 'ml', 'kn', 'te'].includes(lang);
};

/**
 * Utility function to get language name
 */
export const getLanguageName = (lang: SupportedLanguage): string => {
  return LANGUAGE_NAMES[lang] || lang;
};

/**
 * Utility function to get language direction (for RTL support in future)
 */
export const getLanguageDirection = (_lang: SupportedLanguage): 'ltr' | 'rtl' => {
  // Currently all Indian languages are LTR
  // Can be extended for Arabic, Hebrew, etc.
  return 'ltr';
};
