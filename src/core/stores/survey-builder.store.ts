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
      return { options: [{ value: 'opt1', label: 'Option 1' }], rowOptionsMode: 'per-row' };
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
      return { options: [{ value: 'opt1', label: 'Option 1' }], rowOptionsMode: 'per-row' };
    case QuestionType.GABOR_GRANGER: {
      const prices: Array<{ value: string; label: string }> = [];
      for (let p = 200; p <= 1100; p += 100) {
        prices.push({ value: `price_${p}`, label: String(p) });
      }
      return {
        gaborProductDescription: '',
        gaborQualifyingQuestion: 'Please consider the following product. Would you consider buying it?',
        gaborCurrency: '₹',
        gaborMinPrice: 200,
        gaborMaxPrice: 1100,
        gaborPriceStep: 100,
        gaborPresentationMode: 'sequential',
        gaborShowQualifying: true,
        options: prices,
        rowOptionsMode: 'per-row',
      };
    }
    case QuestionType.CONSTANT_SUM:
      return { options: [{ value: 'opt1', label: 'Option 1' }], total: 100, constantSumMode: 'constant-sum', rowOptionsMode: 'per-row' };
    case QuestionType.FILE:
      return { acceptedFileTypes: ['pdf', 'jpg', 'png'], maxFileSizeMb: 10 };
    case QuestionType.TEXT_DISPLAY:
      return { displayHtml: '', displayImageUrl: '', displayImageMaxWidth: '100%' };
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

// ─── Undo / Redo snapshot ────────────────────────────────────────────────────

type BuilderSnapshot = {
  name: string;
  translations: Record<SupportedBuilderLanguage, IBuilderTemplateTranslation>;
  questions: IBuilderQuestion[];
  settings: IBuilderSettings;
  selectedQuestionIndex: number | null;
};

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

  // Undo / Redo
  _past: BuilderSnapshot[];
  _future: BuilderSnapshot[];
  _pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Load / reset
  loadTemplate: (t: ISurveyTemplate) => void;
  resetEditor: () => void;

  // Template metadata
  setName: (v: string) => void;
  setTranslation: (lang: SupportedBuilderLanguage, field: keyof IBuilderTemplateTranslation, v: string) => void;
  setSettings: (partial: Partial<IBuilderSettings>) => void;

  // Questions
  addQuestion: (type: QuestionType) => void;
  insertQuestion: (type: QuestionType, afterIndex: number) => void;
  removeQuestion: (idx: number) => void;
  duplicateQuestion: (idx: number) => void;
  moveQuestionUp: (idx: number) => void;
  moveQuestionDown: (idx: number) => void;
  reorderQuestions: (fromIdx: number, toIdx: number) => void;
  selectQuestion: (idx: number | null) => void;
  setQuestionField: (idx: number, field: keyof IBuilderQuestion, value: any) => void;
  setQuestionConfig: (idx: number, partial: Partial<IBuilderQuestionConfig>) => void;
  setQuestionTranslation: (idx: number, lang: SupportedBuilderLanguage, partial: Partial<IBuilderTranslation>) => void;
  changeQuestionType: (idx: number, newType: QuestionType) => void;

  // Options (for MCQ, RANKING, etc.)
  addOption: (qIdx: number) => void;
  removeOption: (qIdx: number, optIdx: number) => void;
  updateOption: (qIdx: number, optIdx: number, field: 'value' | 'label', value: string) => void;

  // Language
  setActiveLanguage: (lang: SupportedBuilderLanguage) => void;

  // UI triggers (not persisted)
  conditionalLogicHighlight: number;
  triggerConditionalLogicHighlight: () => void;

  // Serialise for API
  toCreateRequest: () => ISurveyTemplateCreateRequest;
  toUpdateRequest: () => ISurveyTemplateUpdateRequest;
}

// ─── Serialisation helpers ───────────────────────────────────────────────────

/**
 * Before persisting a question, ensure translations.en.options always mirrors
 * config.options. Every builder operation (addOption, updateOption, paste,
 * toggleOthers, setQuestionConfig) only mutates config.options; this function
 * propagates those changes to translations.en.options at save time so the API
 * never serves stale or empty English options.
 *
 * Questions without config.options (sliders, text, etc.) are returned unchanged.
 */
function syncEnOptions(q: IBuilderQuestion): IBuilderQuestion {
  const configOpts = q.config.options;
  if (!configOpts || configOpts.length === 0) return q;
  return {
    ...q,
    translations: {
      ...q.translations,
      en: {
        ...q.translations.en,
        options: configOpts.map(({ value, label }) => ({ value, label })),
      },
    },
  };
}

// ─── Default / blank template ────────────────────────────────────────────────

const defaultTranslations = (): Record<SupportedBuilderLanguage, IBuilderTemplateTranslation> => ({
  en: { label: '', description: '', instructions: '' },
  ta: { label: '', description: '', instructions: '' },
});

const defaultSettings = (): IBuilderSettings => ({
  defaultFormLayout: 'list',
  defaultType: 'agent',
  allowAnonymous: false,
  captureFields: [],
  industry: 'Others',
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
      conditionalLogicHighlight: 0,
      _past: [],
      _future: [],

      // ── Undo / Redo ─────────────────────────────────────────────────────
      _pushHistory: () => {
        const s = get();
        const snapshot: BuilderSnapshot = {
          name: s.name,
          translations: structuredClone(s.translations),
          questions: structuredClone(s.questions),
          settings: structuredClone(s.settings),
          selectedQuestionIndex: s.selectedQuestionIndex,
        };
        set((state) => ({
          _past: [...state._past.slice(-49), snapshot],
          _future: [],
        }));
      },

      undo: () => {
        const { _past, _future, name, translations, questions, settings, selectedQuestionIndex } = get();
        if (_past.length === 0) return;
        const prev = _past[_past.length - 1];
        const current: BuilderSnapshot = { name, translations, questions, settings, selectedQuestionIndex };
        set({
          _past: _past.slice(0, -1),
          _future: [current, ..._future.slice(0, 49)],
          name: prev.name,
          translations: prev.translations,
          questions: prev.questions,
          settings: prev.settings,
          selectedQuestionIndex: prev.selectedQuestionIndex,
          isDirty: true,
        });
      },

      redo: () => {
        const { _past, _future, name, translations, questions, settings, selectedQuestionIndex } = get();
        if (_future.length === 0) return;
        const next = _future[0];
        const current: BuilderSnapshot = { name, translations, questions, settings, selectedQuestionIndex };
        set({
          _past: [..._past.slice(-49), current],
          _future: _future.slice(1),
          name: next.name,
          translations: next.translations,
          questions: next.questions,
          settings: next.settings,
          selectedQuestionIndex: next.selectedQuestionIndex,
          isDirty: true,
        });
      },

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
            industry: (t as any).industry ?? (t.settings as any)?.industry ?? 'Others',
            methodology: t.settings?.methodology ?? undefined,
          },
          selectedQuestionIndex: null,
          activeLanguage: 'en',
          _past: [],
          _future: [],
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
          _past: [],
          _future: [],
        }),

      // ── Template metadata ───────────────────────────────────────────────
      setName: (v) => {
        get()._pushHistory();
        set({ name: v, isDirty: true });
      },

      setTranslation: (lang, field, v) => {
        get()._pushHistory();
        set((s) => ({
          isDirty: true,
          translations: {
            ...s.translations,
            [lang]: { ...s.translations[lang], [field]: v },
          },
        }));
      },

      setSettings: (partial) => {
        get()._pushHistory();
        set((s) => ({
          isDirty: true,
          settings: { ...s.settings, ...partial },
        }));
      },

      // ── Questions ───────────────────────────────────────────────────────
      addQuestion: (type: QuestionType) => {
        get()._pushHistory();
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
          required: true,
          allowComment: false,
        };
        set((s) => ({
          isDirty: true,
          questions: [...s.questions, newQ],
          selectedQuestionIndex: s.questions.length,
        }));
      },

      insertQuestion: (type: QuestionType, afterIndex: number) => {
        get()._pushHistory();
        const newQ: IBuilderQuestion = {
          id: generateId(),
          order: afterIndex + 2,
          questionType: type,
          text: '',
          translations: { en: emptyTranslation(), ta: emptyTranslation() },
          config: defaultConfigFor(type),
          required: true,
          allowComment: false,
        };
        set((s) => {
          const qs = [
            ...s.questions.slice(0, afterIndex + 1),
            newQ,
            ...s.questions.slice(afterIndex + 1),
          ].map((q, i) => ({ ...q, order: i + 1 }));
          return { isDirty: true, questions: qs, selectedQuestionIndex: afterIndex + 1 };
        });
      },

      removeQuestion: (idx) => {
        get()._pushHistory();
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
        });
      },

      duplicateQuestion: (idx) => {
        get()._pushHistory();
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
        });
      },

      moveQuestionUp: (idx) => {
        get()._pushHistory();
        set((s) => {
          if (idx <= 0) return {};
          const qs = [...s.questions];
          [qs[idx - 1], qs[idx]] = [qs[idx], qs[idx - 1]];
          return {
            isDirty: true,
            questions: qs.map((q, i) => ({ ...q, order: i + 1 })),
            selectedQuestionIndex: idx - 1,
          };
        });
      },

      moveQuestionDown: (idx) => {
        get()._pushHistory();
        set((s) => {
          if (idx >= s.questions.length - 1) return {};
          const qs = [...s.questions];
          [qs[idx], qs[idx + 1]] = [qs[idx + 1], qs[idx]];
          return {
            isDirty: true,
            questions: qs.map((q, i) => ({ ...q, order: i + 1 })),
            selectedQuestionIndex: idx + 1,
          };
        });
      },

      reorderQuestions: (fromIdx, toIdx) => {
        if (fromIdx === toIdx) return;
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          const [moved] = qs.splice(fromIdx, 1);
          qs.splice(toIdx, 0, moved);
          return {
            isDirty: true,
            questions: qs.map((q, i) => ({ ...q, order: i + 1 })),
            selectedQuestionIndex: toIdx,
          };
        });
      },

      selectQuestion: (idx) => set({ selectedQuestionIndex: idx }),

      setQuestionField: (idx, field, value) => {
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          qs[idx] = { ...qs[idx], [field]: value };
          return { isDirty: true, questions: qs };
        });
      },

      setQuestionConfig: (idx, partial) => {
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          qs[idx] = { ...qs[idx], config: { ...qs[idx].config, ...partial } };
          return { isDirty: true, questions: qs };
        });
      },

      setQuestionTranslation: (idx, lang, partial) => {
        get()._pushHistory();
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
        });
      },

      changeQuestionType: (idx, newType) => {
        get()._pushHistory();
        set((state) => {
          const q = state.questions[idx];
          const oldType = q.questionType;
          const newConfig = defaultConfigFor(newType);

          const OPTION_TYPES = new Set([QuestionType.MCQ_SINGLE, QuestionType.MCQ_MULTIPLE, QuestionType.RANKING]);
          const SCALE_TYPES = new Set([QuestionType.SCALE, QuestionType.LIKERT_SCALE, QuestionType.DOUBLE_SLIDER, QuestionType.MULTI_SLIDER]);
          const MATRIX_TYPES = new Set([QuestionType.MATRIX, QuestionType.MAX_DIFF, QuestionType.CONSTANT_SUM]);

          if (OPTION_TYPES.has(oldType) && OPTION_TYPES.has(newType)) {
            newConfig.options = q.config.options ?? [];
          }
          if (SCALE_TYPES.has(oldType) && SCALE_TYPES.has(newType)) {
            if (q.config.min !== undefined) newConfig.min = q.config.min;
            if (q.config.max !== undefined) newConfig.max = q.config.max;
            if (q.config.step !== undefined) newConfig.step = q.config.step;
            if (q.config.minLabel) newConfig.minLabel = q.config.minLabel;
            if (q.config.maxLabel) newConfig.maxLabel = q.config.maxLabel;
          }
          if (MATRIX_TYPES.has(oldType) && MATRIX_TYPES.has(newType)) {
            newConfig.rows = q.config.rows ?? [];
            newConfig.columns = q.config.columns ?? [];
          }

          // Always preserve conditional logic and option filter
          if (q.config.showIf) newConfig.showIf = q.config.showIf;
          if (q.config.showIfAll) newConfig.showIfAll = q.config.showIfAll;
          if (q.config.showIfAny) newConfig.showIfAny = q.config.showIfAny;
          if (q.config.optionFilter) newConfig.optionFilter = q.config.optionFilter;

          const updated = [...state.questions];
          updated[idx] = { ...q, questionType: newType, config: newConfig };
          return { questions: updated, isDirty: true };
        });
      },

      // ── Options ─────────────────────────────────────────────────────────
      addOption: (qIdx) => {
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = q.config.options ?? [];
          const n = opts.length + 1;
          const newOpt = { value: `opt${n}`, label: `Option ${n}` };
          const newTranslations = { ...q.translations };
          if (newTranslations.en?.options) {
            newTranslations.en = { ...newTranslations.en, options: [...newTranslations.en.options, { ...newOpt }] };
          }
          if (newTranslations.ta?.options) {
            newTranslations.ta = { ...newTranslations.ta, options: [...newTranslations.ta.options, { value: newOpt.value, label: '' }] };
          }
          qs[qIdx] = {
            ...q,
            config: { ...q.config, options: [...opts, newOpt] },
            translations: newTranslations,
          };
          return { isDirty: true, questions: qs };
        });
      },

      removeOption: (qIdx, optIdx) => {
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = (q.config.options ?? []).filter((_, i) => i !== optIdx);
          const newTranslations = { ...q.translations };
          if (newTranslations.en?.options) {
            newTranslations.en = { ...newTranslations.en, options: newTranslations.en.options.filter((_, i) => i !== optIdx) };
          }
          if (newTranslations.ta?.options) {
            newTranslations.ta = { ...newTranslations.ta, options: newTranslations.ta.options.filter((_, i) => i !== optIdx) };
          }
          qs[qIdx] = { ...q, config: { ...q.config, options: opts }, translations: newTranslations };
          return { isDirty: true, questions: qs };
        });
      },

      updateOption: (qIdx, optIdx, field, value) => {
        get()._pushHistory();
        set((s) => {
          const qs = [...s.questions];
          const q = qs[qIdx];
          const opts = [...(q.config.options ?? [])];
          opts[optIdx] = { ...opts[optIdx], [field]: value };
          // Keep Tamil option value in sync when English value changes
          const newTranslations = { ...q.translations };
          const taOpts = newTranslations.ta?.options;
          if (taOpts && taOpts[optIdx] !== undefined) {
            const updatedTaOpts = [...taOpts];
            if (field === 'value') {
              // value must stay identical across languages
              updatedTaOpts[optIdx] = { ...updatedTaOpts[optIdx], value };
            }
            // label: user edits Tamil label separately — don't overwrite
            newTranslations.ta = { ...newTranslations.ta, options: updatedTaOpts };
          }
          qs[qIdx] = { ...q, config: { ...q.config, options: opts }, translations: newTranslations };
          return { isDirty: true, questions: qs };
        });
      },

      // ── Language ─────────────────────────────────────────────────────────
      setActiveLanguage: (lang) => set({ activeLanguage: lang }),

      // ── UI triggers (not persisted) ───────────────────────────────────────
      triggerConditionalLogicHighlight: () =>
        set((s) => ({ conditionalLogicHighlight: s.conditionalLogicHighlight + 1 })),

      // ── Serialise ────────────────────────────────────────────────────────

      // Before saving, ensure translations.en.options always mirrors config.options
      // for every question that has options. This means any operation that modifies
      // config.options (addOption, updateOption, pasteFromClipboard, toggleOthers,
      // setQuestionConfig) is automatically covered — no need to track each call site.
      toCreateRequest: (): ISurveyTemplateCreateRequest => {
        const s = get();
        return {
          name: s.name,
          translations: s.translations,
          questions: s.questions.map(syncEnOptions),
          settings: s.settings,
          industry: s.settings.industry,
        };
      },

      toUpdateRequest: (): ISurveyTemplateUpdateRequest => {
        const s = get();
        return {
          name: s.name,
          translations: s.translations,
          questions: s.questions.map(syncEnOptions),
          settings: s.settings,
          industry: s.settings.industry,
        };
      },
    }),
    { name: 'survey-builder' }
  )
);
