/**
 * Industry Translation Utility
 * Maps industry values to translation keys
 */

import type { Translations } from '@/core/i18n/translations';

type IndustryKey = keyof Translations['industries'];

/**
 * Map industry values to translation keys
 */
export const industryValueToKey: Record<string, IndustryKey> = {
  'all': 'all',
  'All Industries': 'all',
  'Advertising & Marketing': 'advertisingMarketing',
  'Automotive': 'automotive',
  'Education': 'education',
  'Financial Services & Insurance': 'financialServices',
  'FMCG': 'fmcg',
  'Healthcare & Life Sciences': 'healthcare',
  'Human Resources': 'humanResources',
  'Internet & Media': 'internetMedia',
  'Investor & Private Equity': 'investorPrivateEquity',
  'Retail & Merchandising': 'retailMerchandising',
  'Technology': 'technology',
  'Others': 'others'
};

/**
 * Get translated industry label
 */
export const getIndustryLabel = (
  value: string,
  translations: Translations['industries']
): string => {
  const key = industryValueToKey[value];
  return key ? translations[key] : value;
};
