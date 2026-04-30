// src/core/types/survey-builder.type.ts

import type { QuestionType, SurveyFormLayout, ISurveyCaptureField } from './survey.type';

export type SupportedBuilderLanguage = 'en' | 'ta';

export interface IBuilderQuestionOption {
  value: string;
  label: string;
  attributes?: Array<{ key: string; value: string }>;
  isIntensePurchase?: boolean;
}

export interface IBuilderShowIfCondition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains';
  value: string;
}

export interface IBuilderSkipRule {
  id: string;
  timing: 'pre' | 'post';
  conditions?: IBuilderShowIfCondition[];
  conditionMode?: 'and' | 'or';
  jumpToQuestionId: string | 'END';
}

export interface IBuilderOptionFilter {
  questionId: string;
  map: Record<string, string[]>;
}

export interface IBuilderQuestionConfig {
  options?: IBuilderQuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  rows?: IBuilderQuestionOption[];
  columns?: IBuilderQuestionOption[];
  /** 'shared' = all rows use the global columns; 'per-row' = each row has its own columns */
  rowOptionsMode?: 'shared' | 'per-row';
  /** Per-row column definitions when rowOptionsMode === 'per-row'. Key = row.value */
  rowColumns?: Record<string, IBuilderQuestionOption[]>;
  /** Shared additional fields for all options when rowOptionsMode === 'shared' */
  sharedOptionAttributes?: Array<{ key: string; value: string }>;
  sliders?: IBuilderQuestionOption[];
  itemCount?: number;
  total?: number;
  ratingMax?: number;
  currency?: string;
  acceptedFileTypes?: string[];
  maxFileSizeMb?: number;
  showIf?: IBuilderShowIfCondition;
  showIfAll?: IBuilderShowIfCondition[];
  showIfAny?: IBuilderShowIfCondition[];
  optionFilter?: IBuilderOptionFilter;
  othersPlaceholder?: string;
  constantSumMode?: 'constant-sum' | 'rating-conjoint' | 'volume-conjoint';
  /** attribute key whose value is the price multiplier (volume-conjoint) */
  volumeMultiplierKey?: string;
  /** max rating per option for rating-conjoint (default 10) */
  ratingConjointMax?: number;
  /** question-level feature switch for intense purchase */
  isIntensePurchase?: boolean;
  /** shared label shown to respondents for the intense purchase checkbox */
  intensePurchaseLabel?: string;

  // ── F1: MCQ enhancements ──────────────────────────────────────────────────
  /** For MCQ_SINGLE: display as radio buttons or dropdown select */
  mcqSubType?: 'radio' | 'dropdown';
  /** Add an exclusive "None of the above" option pinned to the bottom */
  hasExclusiveOption?: boolean;
  exclusiveOptionLabel?: string;
  /** Shuffle option order at runtime (exclusive + others always stay at bottom) */
  randomizeOptions?: boolean;
  /** MCQ_MULTIPLE: minimum number of selections required */
  minSelections?: number;
  /** MCQ_MULTIPLE: maximum number of selections allowed */
  maxSelections?: number;

  // ── F2: Open-end enhancements ─────────────────────────────────────────────
  /** Minimum character count (TEXT, TEXTAREA) */
  minChars?: number;
  /** Maximum character count; shows counter to respondent when set */
  maxChars?: number;
  /** Override input box width in pixels (TEXT) */
  inputWidthPx?: number;
  /** Override textarea height in pixels (TEXTAREA) */
  inputHeightPx?: number;

  // ── F3: Numeric enhancements ──────────────────────────────────────────────
  /** Show a "Don't Know / Refuse" escape button for NUMBER questions */
  hasDontKnow?: boolean;
  dontKnowLabel?: string;
  /** Value stored when respondent selects Don't Know (should be outside min/max) */
  dontKnowValue?: string;
  /** Decimal separator shown to respondent (stored internally as period always) */
  decimalDelimiter?: 'period' | 'comma';

  // ── F5: Ranking enhancements ──────────────────────────────────────────────
  rankingFormat?: 'drag-vertical' | 'drag-horizontal' | 'drag-container' | 'dropdown' | 'numeric-input';
  /** Allow respondent to rank only a subset of items */
  allowPartialRanking?: boolean;
  /** How many items to rank when allowPartialRanking is true */
  partialRankCount?: number;
  /** Placeholder label for dropdown-format ranking */
  rankingDropdownPlaceholder?: string;

  // ── F6: Constant Sum enhancements ─────────────────────────────────────────
  /** Label shown next to the running/required total */
  totalLabel?: string;
  /** Max container width in pixels (desktop only) */
  csMaxWidthPx?: number;
  /** Allow non-integer allocation values */
  allowDecimals?: boolean;
  /** Show a live running total to the respondent (not saved in data) */
  showRunningTotal?: boolean;
  /** Every item must receive a value greater than zero */
  requireAllItems?: boolean;

  // ── F4: Matrix sub-types ──────────────────────────────────────────────────
  /** Defaults to 'single-select' for backward compatibility */
  matrixSubType?: 'single-select' | 'multi-select' | 'numeric' | 'bipolar' | 'dropdown-cells';
  matrixRowMinSelections?: number;
  matrixRowMaxSelections?: number;
  matrixNumericMin?: number;
  matrixNumericMax?: number;
  matrixNumericAllowDecimals?: boolean;
  /** Shared dropdown values for dropdown-cells sub-type */
  matrixDropdownValues?: IBuilderQuestionOption[];
  matrixGridWidthPx?: number;
  matrixColumnWidthPx?: number;
  matrixRowLabelWidthPx?: number;
  /** Split rows into stacked sub-questions on narrow screens (default true) */
  matrixMobileBreak?: boolean;

  // ── F9: MaxDiff enhancements ──────────────────────────────────────────────
  anchoredMaxDiff?: boolean;
  anchorQuestionText?: string;
  /** Items shown per set in anchored mode (min 5, default 7) */
  itemsPerSet?: number;
  anchorPositiveLabel?: string;
  anchorNegativeLabel?: string;
  /** Show only a random subset of items per respondent */
  maxDiffExpressMode?: boolean;
  expressItemCount?: number;
  /** Show each item exactly once per respondent */
  maxDiffSparseMode?: boolean;

  // ── F8: Text/Graphic Display element ─────────────────────────────────────
  /** HTML/rich-text content for TEXT_DISPLAY questions */
  displayHtml?: string;
  displayImageUrl?: string;
  /** Max image width: number (px) or string with unit (e.g. '50%') */
  displayImageMaxWidth?: string;

  // ── F7: Skip Logic ────────────────────────────────────────────────────────
  /** Navigation-based skip rules — distinct from showIf visibility logic */
  skipRules?: IBuilderSkipRule[];

  // ── F10: Smart Follow-Up (AI) ─────────────────────────────────────────────
  /** ID of the open-end source question this follow-up analyses */
  sourceQuestionId?: string;
  /** Optional instructions to guide AI tone or focus */
  aiInstructions?: string;
  requiresAiFeatures?: boolean;
}

export interface IBuilderTranslation {
  text: string;
  placeholder?: string;
  options?: IBuilderQuestionOption[];
}

export interface IBuilderQuestion {
  id: string;
  order: number;
  questionType: QuestionType;
  text: string;
  translations: Record<SupportedBuilderLanguage, IBuilderTranslation>;
  config: IBuilderQuestionConfig;
  required: boolean;
  allowComment: boolean;
}

export interface IBuilderTemplateTranslation {
  label: string;
  description: string;
  instructions: string;
}

export interface IBuilderSettings {
  defaultFormLayout: SurveyFormLayout;
  defaultType: 'respondent' | 'agent';
  allowAnonymous: boolean;
  captureFields: ISurveyCaptureField[];
  industry?: string;
}

export interface IBuilderTemplate {
  _id: string | null; // null = new (unsaved)
  name: string;
  translations: Record<SupportedBuilderLanguage, IBuilderTemplateTranslation>;
  questions: IBuilderQuestion[];
  settings: IBuilderSettings;
}

export interface ISurveyTemplateCreateRequest {
  name: string;
  translations: Record<SupportedBuilderLanguage, IBuilderTemplateTranslation>;
  questions: IBuilderQuestion[];
  settings: IBuilderSettings;
  industry?: string;
}

export type ISurveyTemplateUpdateRequest = Partial<ISurveyTemplateCreateRequest>;

export interface ISurveyPublishRequest {
  templateId: string;
  label: string;
  surveyId?: string;
  industry?: string;
  type?: 'respondent' | 'agent';
  visibility?: 'public' | 'private';
  startDate?: string;
  expireDate?: string;
  maxResponses?: number;
  zonalBasedSurvey?: boolean;
  formLayout?: 'paginated' | 'list';
}

export interface ISurveyUpdateRequest {
  label?: string;
  startDate?: string;
  expireDate?: string | null;
  maxResponses?: number;
  type?: 'respondent' | 'agent';
  visibility?: 'public' | 'private';
  zonalBasedSurvey?: boolean;
  formLayout?: 'paginated' | 'list';
  status?: 'archived' | 'draft';
}
