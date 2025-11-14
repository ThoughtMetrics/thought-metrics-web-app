// src/core/constants/survey.constants.ts

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
} as const;

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
