// src/core/types/survey-builder.type.ts

import type { QuestionType, SurveyFormLayout, ISurveyCaptureField } from './survey.type';

export type SupportedBuilderLanguage = 'en' | 'ta';

export interface IBuilderQuestionOption {
  value: string;
  label: string;
}

export interface IBuilderShowIfCondition {
  questionId: string;
  operator: 'equals' | 'not_equals' | 'contains';
  value: string;
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
  sliders?: IBuilderQuestionOption[];
  itemCount?: number;
  total?: number;
  ratingMax?: number;
  currency?: string;
  acceptedFileTypes?: string[];
  maxFileSizeMb?: number;
  showIf?: IBuilderShowIfCondition;
  showIfAll?: IBuilderShowIfCondition[];
  othersPlaceholder?: string;
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
}

export type ISurveyTemplateUpdateRequest = Partial<ISurveyTemplateCreateRequest>;

export interface ISurveyPublishRequest {
  templateId: string;
  label: string;
  surveyId?: string;
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
  status?: 'archived';
}
