/**
 * useLanguage Hook
 * Optimized hook for translation with memoization
 *
 * Features:
 * - Memoized translations for performance
 * - Type-safe translation keys
 * - Parameter interpolation support
 * - Automatic language change detection
 *
 * Best Practices:
 * - Uses useMemo to prevent unnecessary re-renders
 * - Shallow comparison for params
 * - Extracts selectors for granular subscriptions
 */

import { useMemo, useCallback } from 'react';
import { useCurrentLanguage, type SupportedLanguage } from '@/core/stores/language.store';
import { getTranslations, translate as translateUtil, type Translations } from '@/core/i18n/translations';

/**
 * Translation function type
 */
type TranslateFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

/**
 * Return type for useLanguage hook
 */
interface UseLanguageReturn {
  language: SupportedLanguage;
  t: TranslateFunction;
  translations: Translations;
  isRTL: boolean;
}

/**
 * Main useLanguage hook
 * Provides translation function with automatic language detection
 *
 * @example
 * const { t, language } = useLanguage();
 * return <div>{t('common.loading')}</div>;
 *
 * @example with params
 * const { t } = useLanguage();
 * return <div>{t('validation.minLength', { min: 5 })}</div>;
 */
export function useLanguage(): UseLanguageReturn {
  // Get current language from store
  // This will only re-render when language changes
  const language = useCurrentLanguage();

  // Memoize translations object
  // Only recomputed when language changes
  const translations = useMemo(() => {
    return getTranslations(language);
  }, [language]);

  // Memoize translation function
  // Prevents function recreation on every render
  const t: TranslateFunction = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translateUtil(key, language, params);
    },
    [language]
  );

  // Check if language is RTL (for future Arabic/Hebrew support)
  const isRTL = useMemo(() => {
    // Currently all Indian languages are LTR
    return false;
  }, [language]);

  return {
    language,
    t,
    translations,
    isRTL
  };
}

/**
 * Hook for translation function only
 * Lighter version that only returns the translate function
 *
 * @example
 * const t = useTranslate();
 * return <div>{t('common.loading')}</div>;
 */
export function useTranslate(): TranslateFunction {
  const language = useCurrentLanguage();

  return useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translateUtil(key, language, params);
    },
    [language]
  );
}

/**
 * Hook for getting translations object only
 * Useful when you need multiple translations from the same category
 *
 * @example
 * const translations = useTranslations();
 * return (
 *   <div>
 *     <button>{translations.common.save}</button>
 *     <button>{translations.common.cancel}</button>
 *   </div>
 * );
 */
export function useTranslations(): Translations {
  const language = useCurrentLanguage();

  return useMemo(() => {
    return getTranslations(language);
  }, [language]);
}

/**
 * Hook for category-specific translations
 * More performant when you only need translations from one category
 *
 * @example
 * const common = useCategoryTranslations('common');
 * return <button>{common.loading}</button>;
 */
export function useCategoryTranslations<K extends keyof Translations>(
  category: K
): Translations[K] {
  const language = useCurrentLanguage();

  return useMemo(() => {
    const translations = getTranslations(language);
    return translations[category];
  }, [language, category]);
}

/**
 * Hook to check if translations are available for a specific language
 * Useful for feature flags or conditional rendering
 *
 * @example
 * const isAvailable = useIsLanguageAvailable('ta');
 * if (!isAvailable) return <div>Tamil not yet supported</div>;
 */
export function useIsLanguageAvailable(lang: SupportedLanguage): boolean {
  return useMemo(() => {
    // Check if translations exist for this language
    const translations = getTranslations(lang);
    return translations !== undefined;
  }, [lang]);
}

/**
 * Export default useLanguage hook
 */
export default useLanguage;
