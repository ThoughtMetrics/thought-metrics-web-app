// src/core/constants/survey.constants.ts

import { SurveyMethodology } from '@/core/types/survey.type';

export const SURVEY_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  EXPIRED: 'expired',
  ARCHIVED: 'archived',
} as const;

export const SURVEY_RESPONSE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  DECLINED: 'declined',
} as const;

export const QUESTION_TYPE = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  EMAIL: 'email',
  PHONE: 'phone',
  DATE: 'date',
  MCQ_SINGLE: 'mcq-single',
  MCQ_MULTIPLE: 'mcq-multiple',
  RATING: 'rating',
  LIKERT_SCALE: 'likert-scale',
  SCALE: 'scale',
  DOUBLE_SLIDER: 'double-slider',
  MULTI_SLIDER: 'multi-slider',
  MATRIX: 'matrix',
  RANKING: 'ranking',
  MAX_DIFF: 'max-diff',
  CONSTANT_SUM: 'constant-sum',
  FILE: 'file',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;

export type MethodologyCategory = 'pricing_conjoint' | 'claims_concept' | 'brand_ads';

export interface SurveyMethodologyMeta {
  label: string;
  description: string;
  category: MethodologyCategory;
  available: boolean;
}

export const SURVEY_METHODOLOGY_META: Record<SurveyMethodology, SurveyMethodologyMeta> = {
  [SurveyMethodology.STANDARD]:           { label: 'Standard Survey',         description: 'General-purpose survey for any research need.',              category: 'pricing_conjoint',  available: false },
  [SurveyMethodology.MAX_DIFF]:           { label: 'MaxDiff Analysis',         description: 'Best-worst scaling to prioritise items.',                    category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.CONJOINT]:           { label: 'Conjoint Analysis',        description: 'Trade-off analysis for product features and pricing.',       category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.MULTILINGUAL]:       { label: 'Multilingual / Tamil',     description: 'Survey with full English and Tamil translations.',           category: 'claims_concept',    available: false },
  [SurveyMethodology.A_B_TEST]:           { label: 'A/B Test',                 description: 'Compare two variants and measure preference.',               category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.VAN_WESTENDORP]:     { label: 'Van Westendorp (PSM)',      description: 'Price sensitivity meter using four price-point questions.',  category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.GABOR_GRANGER]:      { label: 'Gabor-Granger',            description: 'Identify price thresholds and willingness to pay.',          category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.BRAND_PRICE_TRADEOFF]: { label: 'Brand-Price Trade-Off',  description: 'Measure brand vs. price sensitivity.',                      category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.KANO_MODEL]:         { label: 'Kano Model',               description: 'Classify features as must-have, delighters, or indifferent.',category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.TURF]:               { label: 'TURF Analysis',            description: 'Find the optimal combination of offerings.',                 category: 'pricing_conjoint',  available: true },
  [SurveyMethodology.CLAIMS_TEST]:        { label: 'Claims Test',              description: 'Evaluate the believability and impact of product claims.',   category: 'claims_concept',    available: true },
  [SurveyMethodology.MONADIC_TEST]:       { label: 'Monadic Test',             description: 'Evaluate a single concept in isolation.',                    category: 'claims_concept',    available: true },
  [SurveyMethodology.PRODUCT_CONCEPT]:    { label: 'Product Concept Test',     description: 'Assess appeal and purchase intent for a new concept.',       category: 'claims_concept',    available: true },
  [SurveyMethodology.PRICED_CONCEPT]:     { label: 'Priced Concept Test',      description: 'Evaluate a concept together with its price point.',          category: 'claims_concept',    available: true },
  [SurveyMethodology.IDEA_SCREENER]:      { label: 'Idea Screener',            description: 'Quickly screen ideas for interest and uniqueness.',          category: 'claims_concept',    available: true },
  [SurveyMethodology.BRAND_NAME_TEST]:    { label: 'Brand Name Test',          description: 'Identify the strongest brand name from a shortlist.',        category: 'brand_ads',         available: true },
  [SurveyMethodology.AD_COPY_TEST]:       { label: 'Ad Copy Test',             description: 'Measure clarity, persuasion, and recall of ad text.',        category: 'brand_ads',         available: true },
  [SurveyMethodology.BRAND_TRACKER]:      { label: 'Brand Tracker',            description: 'Track brand awareness, perception, and loyalty over time.',  category: 'brand_ads',         available: true },
};

export const METHODOLOGY_CATEGORIES: Array<{ id: MethodologyCategory; label: string }> = [
  { id: 'pricing_conjoint', label: 'Pricing & Conjoint' },
  { id: 'claims_concept',   label: 'Claims & Concept' },
  { id: 'brand_ads',        label: 'Brand & Ads' },
];

// Tiles shown in the picker but NOT yet available (greyed out)
export const UNAVAILABLE_METHODOLOGY_TILES: Array<{ label: string; category: MethodologyCategory }> = [
  { label: 'Five-Second Test',           category: 'claims_concept' },
  { label: 'Package Test',               category: 'claims_concept' },
  { label: 'Logo Test',                  category: 'brand_ads' },
  { label: 'Image Ad Test',              category: 'brand_ads' },
  { label: 'Print & OOH Ad Test',        category: 'brand_ads' },
  { label: 'Video Ad Test',              category: 'brand_ads' },
  { label: 'Implicit Concept-Fit Test',  category: 'brand_ads' },
];

export const METHODOLOGY_BADGE_COLOR: Record<MethodologyCategory, string> = {
  pricing_conjoint: 'bg-blue-100 text-blue-700',
  claims_concept:   'bg-purple-100 text-purple-700',
  brand_ads:        'bg-orange-100 text-orange-700',
};

export const INDUSTRY_FILTERS = [
  { value: 'all', label: 'All Industries' },
  { value: 'Advertising & Marketing', label: 'Advertising & Marketing' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Education', label: 'Education' },
  { value: 'Financial Services & Insurance', label: 'Financial Services & Insurance' },
  { value: 'FMCG', label: 'FMCG' },
  { value: 'Healthcare & Life Sciences', label: 'Healthcare & Life Sciences' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Internet & Media', label: 'Internet & Media' },
  { value: 'Investor & Private Equity', label: 'Investor & Private Equity' },
  { value: 'Retail & Merchandising', label: 'Retail & Merchandising' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Others', label: 'Others' },
];
