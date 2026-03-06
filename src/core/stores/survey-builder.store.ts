// src/core/stores/survey-builder.store.ts

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { QuestionType } from '@/core/types/survey.type';
import type {
  IBuilderQuestion,
  IBuilderQuestionConfig,
  IBuilderSettings,
  IBuilderTemplateTranslation,
  IBuilderTranslation,
  ISurveyTemplateCreateRequest,
  ISurveyTemplateUpdateRequest,
  SupportedBuilderLanguage,
} from '@/core/types/survey-builder.type';
import type { ISurveyTemplate } from '@/core/types/survey.type';

// ─── Config defaults by question type ───────────────────────────────────────

function defaultConfigFor(type: QuestionType): IBuilderQuestionConfig {
  switch (type) {
    case QuestionType.MCQ_SINGLE:
    case QuestionType.MCQ_MULTIPLE:
      return { options: [{ value: 'opt1', label: 'Option 1' }] };
    case QuestionType.RATING:
      return { ratingMax: 5 };
    case QuestionType.SCALE:
    case QuestionType.LIKERT_SCALE:
      return { min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' };
    case QuestionType.DOUBLE_SLIDER:
      return { min: 0, max: 100, step: 1 };
    case QuestionType.MULTI_SLIDER:
      return { sliders: [{ value: 's1', label: 'Slider 1' }], min: 0, max: 100 };
    case QuestionType.MATRIX:
      return {
        rows: [{ value: 'r1', label: 'Row 1' }],
        columns: [{ value: 'c1', label: 'Col 1' }],
      };
    case QuestionType.RANKING:
    case QuestionType.MAX_DIFF:
    case QuestionType.CONSTANT_SUM:
      return { options: [{ value: 'opt1', label: 'Option 1' }] };
    case QuestionType.FILE:
      return { acceptedFileTypes: ['pdf', 'jpg', 'png'], maxFileSizeMb: 10 };
    default:
      return {};
  }
}

function emptyTranslation(): IBuilderTranslation {
  return { text: '' };
}

function generateId(): string {
  return `q${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Store state / actions interface ────────────────────────────────────────

interface SurveyBuilderState {
  templateId: string | null;
  isDirty: boolean;
  name: string;
  translations: Record<SupportedBuilderLanguage, IBuilderTemplateTranslation>;
  questions: IBuilderQuestion[];
  settings: IBuilderSettings;
  selectedQuestionIndex: number | null;
  activeLanguage: SupportedBuilderLanguage;

  // Load / reset
  loadTemplate: (t: ISurveyTemplate) => void;
  resetEditor: () => void;

  // Template metadata
  setName: (v: string) => void;
  setTranslation: (lang: SupportedBuilderLanguage, field: keyof IBuilderTemplateTranslation, v: string) => void;
  setSettings: (partial: Partial<IBuilderSettings>) => void;

  // Questions
  addQuestion: (type: QuestionType) => void;
  removeQuestion: (idx: number) => void;
  duplicateQuestion: (idx: number) => void;
  moveQuestionUp: (idx: number) => void;
  moveQuestionDown: (idx: number) => void;
  selectQuestion: (idx: number | null) => void;
  setQuestionField: (idx: number, field: keyof IBuilderQuestion, value: any) => void;
  setQuestionConfig: (idx: number, partial: Partial<IBuilderQuestionConfig>) => void;
  setQuestionTranslation: (idx: number, lang: SupportedBuilderLanguage, partial: Partial<IBuilderTranslation>) => void;

  // Options (for MCQ, RANKING, etc.)
  addOption: (qIdx: number) => void;
  removeOption: (qIdx: number, optIdx: number) => void;
  updateOption: (qIdx: number, optIdx: number, field: 'value' | 'label', value: string) => void;

  // Language
  setActiveLanguage: (lang: SupportedBuilderLanguage) => void;

  // Serialise for API
  toCreateRequest: () => ISurveyTemplateCreateRequest;
  toUpdateRequest: () => ISurveyTemplateUpdateRequest;
}

// ─── Default / blank template ────────────────────────────────────────────────

const defaultTranslations = (): Record<SupportedBuilderLanguage, IBuilderTemplateTranslation> => ({
  en: { label: '', description: '', instructions: '' },
  ta: { label: '', description: '', instructions: '' },
});

const defaultSettings = (): IBuilderSettings => ({
  defaultFormLayout: 'paginated',
  defaultType: 'respondent',
  allowAnonymous: false,
  captureFields: [],
});

// ─── Store ───────────────────────────────────────────────────────────────────

export const useSurveyBuilderStore = create<SurveyBuilderState>()(
  devtools(
    (set, get) => ({
      templateId: null,
      isDirty: false,
      name: '',
      translations: defaultTranslations(),
      questions: [],
      settings: defaultSettings(),
      selectedQuestionIndex: null,
      activeLanguage: 'en',

      // ── Load existing template ──────────────────────────────────────────
      loadTemplate: (t: ISurveyTemplate) => {
        const questions: IBuilderQuestion[] = (t.questions ?? []).map((q, i) => ({
          id: q.id,
          order: q.order ?? i + 1,
          questionType: q.questionType,
          text: q.text,
          translations: {
            en: {
              text: q.translations?.en?.text ?? q.text ?? '',
              placeholder: q.translations?.en?.placeholder,
              options: q.translations?.en?.options,
            },
            ta: {
              text: q.translations?.ta?.text ?? '',
              placeholder: q.translations?.ta?.placeholder,
              options: q.translations?.ta?.options,
            },
          },
          config: (q.config ?? {}) as IBuilderQuestionConfig,
          required: q.required ?? false,
          allowComment: q.allowComment ?? false,
        }));

        set({
          templateId: t._id,
          isDirty: false,
          name: t.name,
          translations: {
            en: {
              label: t.translations?.en?.label ?? t.label ?? '',
              description: t.translations?.en?.description ?? t.description ?? '',
              instructions: t.translations?.en?.instructions ?? t.settings?.instructions ?? '',
            },
            ta: {
              label: t.translations?.ta?.label ?? '',
              description: t.translations?.ta?.description ?? '',
              instructions: t.translations?.ta?.instructions ?? '',
            },
          },
          questions,
          settings: {
            defaultFormLayout: t.settings?.defaultFormLayout ?? 'paginated',
            defaultType: t.settings?.defaultType ?? 'respondent',
            allowAnonymous: t.settings?.allowAnonymous ?? false,
            captureFields: t.settings?.captureFields ?? [],
          },
          selectedQuestionIndex: null,
          activeLanguage: 'en',
        });
      },

      // ── Reset to blank ──────────────────────────────────────────────────
      resetEditor: () =>
        set({
          templateId: null,
          isDirty: false,
          name: '',
          translations: defaultTranslations(),
          questions: [],
          settings: defaultSettings(),
          selectedQuestionIndex: null,
          activeLanguage: 'en',
        }),

      // ── Template metadata ───────────────────────────────────────────────
      setName: (v) => set({ name: v, isDirty: true }),

      setTranslation: (lang, field, v) =>
        set((s) => ({
          isDirty: true,
          translations: {
            ...s.translations,
            [lang]: { ...s.translations[lang], [field]: v },
          },
        })),

      setSettings: (partial) =>
        set((s) => ({
          isDirty: true,
          settings: { ...s.settings, ...partial },
        })),

      // ── Questions ───────────────────────────────────────────────────────
      addQuestion: (type: QuestionType) => {
        const { questions } = get();
        const order = questions.length + 1;
        const newQ: IBuilderQuestion = {
          id: generateId(),
          order,
          questionType: type,
          text: '',
          translations: {
            en: emptyTranslation(),
            ta: emptyTranslation(),
          },
          config: defaultConfigFor(type),
          required: false,
          allowComment: false,
        };
        set((s) => ({
          isDirty: true,
          questions: [...s.questions, newQ],
          selectedQuestionIndex: s.questions.length,
        }));
      },

      removeQuestion: (idx) =>
        set((s) => {
          const qs = s.questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i + 1 }));
          const sel = s.selectedQuestionIndex;
          return {
            isDirty: true,
            questions: qs,
            selectedQuestionIndex:
              sel === null ? null
              : sel === idx ? (qs.length > 0 ? Math.min(sel, qs.length - 1) : null)
              : sel > idx ? sel - 1
              : sel,
          };
        }),

      duplicateQuestion: (idx) =>
        set((s) => {
          const src = s.questions[idx];
          if (!src) return {};
          const copy: IBuilderQuestion = {
            ...src,
            id: generateId(),
            config: JSON.parse(JSON.stringify(src.config)),
            translations: JSON.parse(JSON.stringify(src.translations)),
          };
          const qs = [
            ...s.questions.slice(0, idx + 1),
            copy,
            ...s.questions.slice(idx + 1),
          ].map((q, i) => ({ ...q, order: i + 1 }));
          return { isDirty: true, questions: qs, selectedQuestionIndex: idx + 1 };
        }),

      moveQuestionUp: (idx) =>
        set((s) => {
          if (idx <= 0) return {};
          const qs = [...s.questions];
          [qs[idx - 1], qs[idx]] = [qs[idx], qs[idx - 1]];
          return {
            isDirty: true,
            questions: qs.map((q, i) => ({ ...q, order: i + 1 })),
            selectedQuestionIndex: idx - 1,
          };
        }),

      moveQuestionDown: (idx) =>
        set((s) => {
          if (idx >= s.questions.length - 1) return {};
          const qs = [...s.questions];
          [qs[idx], qs[idx + 1]] = [qs[idx + 1], qs[idx]];
          return {
            isDirty: true,
            questions: qs.map((q, i) => ({ ...q, order: i + 1 })),
            selectedQuestionIndex: idx + 1,
          };
        }),

      selectQuestion: (idx) => set({ selectedQuestionIndex: idx }),

      setQuestionField: (idx, field, value) =>
        set((s) => {
          const qs = [...s.questions];
          qs[idx] = { ...qs[idx], [field]: value };
          return { isDirty: true, questions: qs };
        }),

      setQuestionConfig: (idx, partial) =>
        set((s) => {
          const qs = [...s.questions];
          qs[idx] = { ...qs[idx], config: { ...qs[idx].config, ...partial } };
          return { isDirty: true, questions: qs };
        }),

      setQuestionTranslation: (idx, lang, partial) =>
        set((s) => {
          const qs = [...s.questions];
          qs[idx] = {
            ...qs[idx],
            translations: {
              ...qs[idx].translations,
              [lang]: { ...qs[idx].translations[lang], ...partial },
            },
          };
          return { isDirty: true, questions: qs };
        }),

      // ── Options ─────────────────────────────────────────────────────────
      addOption: (qIdx) =>
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = q.config.options ?? [];
          const n = opts.length + 1;
          qs[qIdx] = {
            ...q,
            config: {
              ...q.config,
              options: [...opts, { value: `opt${n}`, label: `Option ${n}` }],
            },
          };
          return { isDirty: true, questions: qs };
        }),

      removeOption: (qIdx, optIdx) =>
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = (q.config.options ?? []).filter((_, i) => i !== optIdx);
          qs[qIdx] = { ...q, config: { ...q.config, options: opts } };
          return { isDirty: true, questions: qs };
        }),

      updateOption: (qIdx, optIdx, field, value) =>
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = [...(q.config.options ?? [])];
          opts[optIdx] = { ...opts[optIdx], [field]: value };
          qs[qIdx] = { ...q, config: { ...q.config, options: opts } };
          return { isDirty: true, questions: qs };
        }),

      // ── Language ─────────────────────────────────────────────────────────
      setActiveLanguage: (lang) => set({ activeLanguage: lang }),

      // ── Serialise ────────────────────────────────────────────────────────
      toCreateRequest: (): ISurveyTemplateCreateRequest => {
        const s = get();
        return {
          name: s.name,
          translations: s.translations,
          questions: s.questions.map(({ id: _id, ...rest }) => rest),
          settings: s.settings,
        };
      },

      toUpdateRequest: (): ISurveyTemplateUpdateRequest => {
        const s = get();
        return {
          name: s.name,
          translations: s.translations,
          questions: s.questions.map(({ id: _id, ...rest }) => rest),
          settings: s.settings,
        };
      },
    }),
    { name: 'survey-builder' }
  )
);
