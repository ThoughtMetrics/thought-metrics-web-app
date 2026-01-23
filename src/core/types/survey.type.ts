// src/core/types/survey.type.ts

import type { LabelValuePair } from './base.type';

// ========== ENUMS ==========
export enum SurveyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  EXPIRED = 'expired',
  ARCHIVED = 'archived',
}

export enum SurveyResponseStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  MCQ_SINGLE = 'mcq-single',
  MCQ_MULTIPLE = 'mcq-multiple',
  RATING = 'rating',
  LIKERT_SCALE = 'likert-scale',
  SCALE = 'scale',
  DOUBLE_SLIDER = 'double-slider',
  MULTI_SLIDER = 'multi-slider',
  MATRIX = 'matrix',
  RANKING = 'ranking',
  MAX_DIFF = 'max-diff',
  CONSTANT_SUM = 'constant-sum',
  FILE = 'file',
}

// ========== API RESPONSE TYPES ==========
export interface ISurvey {
  id: string;
  templateMongoId: string;
  label: string;
  status: SurveyStatus | string; // Backend returns string, not enum
  visibility: 'public' | 'private';
  price?: number | string; // Backend returns string like "90.00"
  maxResponses?: number;
  surveyId?: string;
  industry?: string;
  currentResponses: number;
  startDate?: string;
  expireDate?: string;
  createdAt: string;
  updatedAt?: string;
  clientId?: string | null;
  publishedBy?: string | null;
  publishedAt?: string | null;
  metadata?: {
    surveyId?: string;
    industry?: string;
    timeToComplete?: number;
  };
  // User response status (included when authenticated)
  userResponse?: {
    hasResponded: boolean;
    status?: SurveyResponseStatus;
    responseId?: string;
    canUpdate: boolean;
    isCompleted: boolean;
  };
}

// ========== QUESTION CONFIG TYPES ==========
/**
 * Config for rating questions
 * Used when questionType is 'rating'
 */
export interface RatingQuestionConfig {
  maxStars?: number;
  maxRating?: number;
  icon?: string;
  image?: string;
  labels?: Record<number, string>;
}

export interface IQuestionTemplate {
  id: string;
  order: number;
  questionType: QuestionType;
  text: string;
  config: Record<string, any>;
  required: boolean;
  allowComment?: boolean;
  // Multi-language translations for question text and options/items
  translations?: {
    [key: string]: {
      text?: string;
      options?: Array<{ label: string; value: string }>;
      items?: Array<{ label: string; value: string }>;
      rows?: Array<{ label: string; value: string }>;
      columns?: Array<{ label: string; value: string }>;
    };
  };
}

export interface ISurveyTemplate {
  _id: string;
  name: string;
  label: string; // Legacy field for backward compatibility
  description?: string;
  userId?: string;
  isDefault: boolean;
  // Multi-language translations
  translations?: {
    [key: string]: {
      label: string;
      description?: string;
      instructions?: string;
    };
  };
  questions: IQuestionTemplate[];
  settings: {
    price?: number;
    instructions?: string;
    maxResponses?: number;
    allowAnonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ISurveyDetails {
  survey: ISurvey;
  template: ISurveyTemplate;
  // User response status (included when authenticated)
  // This is returned by the merged /surveys/:surveyId endpoint
  userResponse?: {
    hasResponded: boolean;
    status?: SurveyResponseStatus;
    responseId?: string;
    canUpdate: boolean;
    isCompleted: boolean;
  };
}

export interface ISurveySubmission {
  respondent?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  answers: Array<{
    questionId: string;
    questionType: QuestionType;
    answer: any;
    comment?: string;
  }>;
}

export interface ISurveyResponse {
  _id: string;
  surveyId: string;
  surveyTemplateId: string;
  respondent: {
    name?: string;
    email?: string;
    phone?: string;
    userId?: string;
  };
  answers: Array<{
    questionId: string;
    questionType: string;
    answer: any;
    comment?: string;
    metadata?: Record<string, any>;
  }>;
  status: SurveyResponseStatus;
  submittedAt: string;
}

// ========== COMPONENT PROPS ==========
export interface BaseSurveyQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  surveyId: string;
  surveyLabel: string;
  comment?: string;
  onCommentChange?: (value: string) => void;
  showComment?: boolean;
  progress: number;
  onBack?: () => void;
  onNext?: () => void;
  onSaveDraft?: () => void;
  error?: string;
  isNextDisabled?: boolean;
  isLastQuestion?: boolean;
  isOptional?: boolean; // Indicates if the question can be skipped
}

export interface LickertScaleProps extends BaseSurveyQuestionProps {
  minValue: number;
  maxValue: number;
  minLabel: string;
  maxLabel: string;
  selectedValue?: number;
  onValueChange: (value: number) => void;
  description?: string;
}

export interface StarRatingProps extends BaseSurveyQuestionProps {
  maxStars: number;
  selectedStars?: number;
  onRatingChange: (rating: number) => void;
  image?: string;
  ratingLabels?: Record<number, string>;
}

export interface RadioButtonOption {
  id: string;
  label: string;
  value: string;
}

export interface RadioButtonProps extends BaseSurveyQuestionProps {
  options: RadioButtonOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
}

export interface CheckboxOption {
  id: string;
  label: string;
  value: string;
}

export interface CheckboxProps extends BaseSurveyQuestionProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
}

export interface SingleSliderProps extends BaseSurveyQuestionProps {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  selectedValue?: number;
  onValueChange: (value: number) => void;
  step?: number;
}

export interface DoubleSliderItem {
  min: number;
  max: number;
}

export interface DoubleSliderProps extends BaseSurveyQuestionProps {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  selectedRange?: DoubleSliderItem;
  onRangeChange: (range: DoubleSliderItem) => void;
  step?: number;
}

export interface SliderItem {
  id: string;
  label: string;
  minLabel: string;
  maxLabel: string;
}

export interface MultipleSliderProps extends BaseSurveyQuestionProps {
  items: SliderItem[];
  minValue: number;
  maxValue: number;
  selectedValues: Record<string, number>;
  onValuesChange: (values: Record<string, number>) => void;
}

export interface MatrixOption {
  id: string;
  label: string;
}

export interface MatrixGridProps extends BaseSurveyQuestionProps {
  rows: LabelValuePair[];
  columns: LabelValuePair[];
  selectedValues: Record<string, string>;
  onValuesChange: (values: Record<string, string>) => void;
}

export interface RankingProps extends BaseSurveyQuestionProps {
  items: LabelValuePair[];
  rankedItems: string[];
  onRankingChange: (rankedIds: string[]) => void;
}

export interface MaxDiffItem {
  id: string;
  label: string;
}

export interface MaxDiffProps extends BaseSurveyQuestionProps {
  items: MaxDiffItem[];
  selections: Record<string, 'best' | 'worst' | null>;
  onSelectionChange: (selections: Record<string, 'best' | 'worst' | null>) => void;
}

export interface ConstantSumProps extends BaseSurveyQuestionProps {
  totalPoints: number;
  options: LabelValuePair[];
  allocatedPoints: Record<string, number>;
  onAllocationChange: (allocation: Record<string, number>) => void;
  allowZero?: boolean;
  requireTotal?: boolean;
}
