// src/core/types/survey.type.ts

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

export interface IQuestionTemplate {
  id: string;
  order: number;
  questionType: QuestionType;
  text: string;
  config: Record<string, any>;
  required: boolean;
  allowComment?: boolean;
}

export interface ISurveyTemplate {
  _id: string;
  name: string;
  label: string;
  description?: string;
  userId?: string;
  isDefault: boolean;
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
  ratingLabel?: string;
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

export interface DoubleSliderProps extends BaseSurveyQuestionProps {
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  selectedRange?: [number, number];
  onRangeChange: (range: [number, number]) => void;
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

export interface MatrixRowItem {
  id: string;
  label: string;
  options: MatrixOption[];
}

export interface MatrixGridProps extends BaseSurveyQuestionProps {
  rows: MatrixRowItem[];
  selectedValues: Record<string, string>;
  onValuesChange: (values: Record<string, string>) => void;
}

export interface RankingItem {
  id: string;
  label: string;
}

export interface RankingProps extends BaseSurveyQuestionProps {
  items: RankingItem[];
  rankedItems: string[];
  onRankingChange: (rankedIds: string[]) => void;
}

export interface MaxDiffItem {
  id: string;
  label: string;
}

export interface MaxDiffProps extends BaseSurveyQuestionProps {
  items: MaxDiffItem[];
  mostImportant?: string;
  leastImportant?: string;
  onSelectionChange: (mostImportant: string, leastImportant: string) => void;
}

export interface ConstantSumOption {
  id: string;
  label: string;
}

export interface ConstantSumProps extends BaseSurveyQuestionProps {
  totalPoints: number;
  options: ConstantSumOption[];
  allocatedPoints: Record<string, number>;
  onAllocationChange: (allocation: Record<string, number>) => void;
  allowZero?: boolean;
  requireTotal?: boolean;
}
