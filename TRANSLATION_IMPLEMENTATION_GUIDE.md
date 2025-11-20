# English to Tamil Translation Toggle Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture Decision](#architecture-decision)
3. [Phase 1: Backend API Changes](#phase-1-backend-api-changes)
4. [Phase 2: Frontend Implementation](#phase-2-frontend-implementation)
5. [Phase 3: Testing & Deployment](#phase-3-testing--deployment)
6. [File Changes Reference](#file-changes-reference)
7. [Translation Examples](#translation-examples)
8. [Future Enhancements](#future-enhancements)

---

## Overview

### Objective
Implement a language toggle feature that allows users to switch between English and Tamil throughout the survey application, including:
- Survey titles and descriptions
- Question labels and descriptions
- Question options (for MCQ, dropdowns, etc.)
- Placeholder text and error messages
- UI elements (buttons, labels, navigation)

### Key Requirements
- ✅ Real-time language switching without page reload
- ✅ Persistent language preference (localStorage)
- ✅ Centralized translation management in backend
- ✅ Support for all 17 question types
- ✅ Backward compatibility with existing surveys
- ✅ Scalable architecture for future languages

### Technology Stack
- **Backend**: Node.js + Express + MongoDB/Mongoose
- **Frontend**: React + TypeScript + TanStack Query + Zustand
- **Storage**: MongoDB for translations, localStorage for language preference

---

## Architecture Decision

### Chosen Approach: Backend-Managed Translations

**Why this approach?**

| Criteria | Backend-Managed | Frontend i18n | API Translation |
|----------|----------------|---------------|-----------------|
| Centralized Management | ✅ | ❌ | ⚠️ |
| Bundle Size | ✅ Small | ❌ Large | ✅ Small |
| Scalability | ✅ Excellent | ⚠️ Moderate | ❌ Poor |
| Translation Quality | ✅ Curated | ✅ Curated | ❌ Auto-generated |
| Cost | ✅ Free | ✅ Free | ❌ Pay-per-use |
| Update Flexibility | ✅ No deployment | ❌ Requires deployment | ✅ No deployment |
| Offline Support | ❌ | ✅ | ❌ |

**Decision**: Backend-managed translations with frontend language state management.

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                           │
│  ┌────────────────────┐         ┌─────────────────────────┐    │
│  │  Language Toggle   │────────▶│  Language Store (Zustand)│    │
│  │  [EN] [தமிழ்]      │         │  language: 'en' | 'ta'   │    │
│  └────────────────────┘         └──────────┬──────────────┘    │
└─────────────────────────────────────────────┼───────────────────┘
                                              │
                                              │ Triggers refetch
                                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     React Query Layer                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  useSurveyDetailsQuery(surveyId)                          │  │
│  │  - Query Key: ['surveys', 'details', surveyId, language]  │  │
│  │  - Auto-refetches when language changes                   │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTP GET /api/v1/surveys/:id?lang=ta
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Survey Controller                                        │  │
│  │  1. Receives language parameter                          │  │
│  │  2. Fetches survey from MongoDB                          │  │
│  │  3. Transforms response based on language                │  │
│  │  4. Returns localized survey data                        │  │
│  └────────────────────────┬─────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     MongoDB Database                             │
│  {                                                               │
│    surveyId: "TM-AD001",                                        │
│    translations: {                                              │
│      en: { title: "Customer Survey", ... },                    │
│      ta: { title: "வாடிக்கையாளர் கணக்கெடுப்பு", ... }         │
│    },                                                           │
│    questions: [                                                 │
│      {                                                          │
│        translations: {                                          │
│          en: { label: "What is your age?", ... },             │
│          ta: { label: "உங்கள் வயது என்ன?", ... }             │
│        }                                                        │
│      }                                                          │
│    ]                                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Backend API Changes

### 1.1 Database Schema Updates

**File**: `D:\Projects\thought_metrics\thought-metrics-web-api\src\models\survey-template.model.ts`

#### Current Schema (Simplified)
```typescript
interface IQuestionTemplate {
  questionId: string;
  questionType: QuestionType;
  label: string;
  description?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  required: boolean;
  validation?: any;
}

interface ISurveyTemplate {
  templateId: string;
  title: string;
  description?: string;
  questions: IQuestionTemplate[];
  status: 'draft' | 'published' | 'archived';
}
```

#### Updated Schema with Translations
```typescript
// Translation interfaces
interface IQuestionTranslation {
  label: string;
  description?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  errorMessage?: string;
  helpText?: string;
}

interface ISurveyTranslation {
  title: string;
  description?: string;
  successMessage?: string;
  thankYouMessage?: string;
  instructions?: string;
}

// Updated Question Template
interface IQuestionTemplate {
  questionId: string;
  questionType: QuestionType;

  // Keep for backward compatibility (defaults to English)
  label: string;
  description?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;

  // NEW: Multi-language support
  translations: {
    en: IQuestionTranslation;
    ta: IQuestionTranslation;
    // Future: hi, ml, kn, etc.
  };

  required: boolean;
  validation?: any;
}

// Updated Survey Template
interface ISurveyTemplate {
  templateId: string;

  // Keep for backward compatibility
  title: string;
  description?: string;

  // NEW: Multi-language support
  translations: {
    en: ISurveyTranslation;
    ta: ISurveyTranslation;
  };

  questions: IQuestionTemplate[];
  status: 'draft' | 'published' | 'archived';
}
```

#### Mongoose Schema Implementation
```typescript
import mongoose, { Schema, Document } from 'mongoose';

// Translation sub-schemas
const QuestionTranslationSchema = new Schema({
  label: { type: String, required: true },
  description: String,
  placeholder: String,
  options: [{
    label: String,
    value: String
  }],
  errorMessage: String,
  helpText: String
}, { _id: false });

const SurveyTranslationSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  successMessage: String,
  thankYouMessage: String,
  instructions: String
}, { _id: false });

// Question Template Schema
const QuestionTemplateSchema = new Schema({
  questionId: { type: String, required: true },
  questionType: {
    type: String,
    enum: [
      'TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'PHONE', 'DATE',
      'MCQ_SINGLE', 'MCQ_MULTIPLE', 'RATING', 'LIKERT_SCALE',
      'SCALE', 'DOUBLE_SLIDER', 'MULTI_SLIDER', 'MATRIX',
      'RANKING', 'MAX_DIFF', 'CONSTANT_SUM', 'FILE'
    ],
    required: true
  },

  // Backward compatibility fields
  label: String,
  description: String,
  placeholder: String,
  options: [{
    label: String,
    value: String
  }],

  // NEW: Translations
  translations: {
    en: { type: QuestionTranslationSchema, required: true },
    ta: { type: QuestionTranslationSchema, required: true }
  },

  required: { type: Boolean, default: false },
  validation: Schema.Types.Mixed,
  config: Schema.Types.Mixed
}, { _id: false });

// Survey Template Schema
const SurveyTemplateSchema = new Schema({
  templateId: { type: String, required: true, unique: true },
  surveyId: { type: String, required: true },

  // Backward compatibility
  title: String,
  description: String,

  // NEW: Translations
  translations: {
    en: { type: SurveyTranslationSchema, required: true },
    ta: { type: SurveyTranslationSchema, required: true }
  },

  questions: [QuestionTemplateSchema],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SurveyTemplate = mongoose.model('SurveyTemplate', SurveyTemplateSchema);
```

---

### 1.2 API Endpoint Modifications

**File**: `D:\Projects\thought_metrics\thought-metrics-web-api\src\controllers\survey.controller.ts`

#### Add Language Parameter Support

```typescript
import { Request, Response } from 'express';
import { SurveyService } from '../services/survey.service';

export class SurveyController {

  /**
   * GET /api/v1/surveys/:surveyId?lang=en|ta
   * Get survey details with localized content
   */
  async getSurveyDetails(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const { lang = 'en' } = req.query as { lang?: 'en' | 'ta' };
      const userId = req.user?.userId; // From auth middleware

      // Validate language parameter
      if (!['en', 'ta'].includes(lang)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid language. Supported languages: en, ta'
        });
      }

      // Fetch survey with template and user response
      const surveyDetails = await SurveyService.getSurveyDetails(
        surveyId,
        userId,
        lang
      );

      return res.status(200).json({
        success: true,
        data: surveyDetails
      });

    } catch (error) {
      console.error('Error fetching survey details:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch survey details'
      });
    }
  }

  /**
   * GET /api/v1/surveys?status=published&lang=en|ta
   * List surveys with localized content
   */
  async getSurveys(req: Request, res: Response) {
    try {
      const {
        status = 'published',
        visibility = 'public',
        industry,
        limit = 100,
        lang = 'en'
      } = req.query as any;

      const userId = req.user?.userId;

      // Validate language
      if (!['en', 'ta'].includes(lang)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid language. Supported languages: en, ta'
        });
      }

      const surveys = await SurveyService.getSurveys({
        status,
        visibility,
        industry,
        limit: parseInt(limit),
        userId,
        lang
      });

      return res.status(200).json({
        success: true,
        data: surveys
      });

    } catch (error) {
      console.error('Error fetching surveys:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch surveys'
      });
    }
  }
}
```

---

### 1.3 Service Layer Implementation

**File**: `D:\Projects\thought_metrics\thought-metrics-web-api\src\services\survey.service.ts`

```typescript
import { Survey } from '../models/survey.model';
import { SurveyTemplate } from '../models/survey-template.model';
import { SurveyResponse } from '../models/survey-response.model';

export class SurveyService {

  /**
   * Get survey details with localized content
   */
  static async getSurveyDetails(
    surveyId: string,
    userId?: string,
    lang: 'en' | 'ta' = 'en'
  ) {
    // Fetch survey metadata
    const survey = await Survey.findOne({ surveyId }).lean();
    if (!survey) {
      throw new Error('Survey not found');
    }

    // Fetch survey template
    const template = await SurveyTemplate.findOne({ surveyId }).lean();
    if (!template) {
      throw new Error('Survey template not found');
    }

    // Fetch user's response if exists
    let userResponse = null;
    if (userId) {
      userResponse = await SurveyResponse.findOne({
        surveyId,
        userId
      }).lean();
    }

    // Localize survey data
    const localizedSurvey = this.localizeSurvey(survey, template, lang);

    // Build response
    return {
      ...localizedSurvey,
      userResponse: userResponse ? {
        responseId: userResponse._id,
        status: userResponse.status,
        hasResponded: true,
        canUpdate: userResponse.status === 'draft',
        isCompleted: userResponse.status !== 'draft',
        submittedAt: userResponse.submittedAt
      } : {
        hasResponded: false,
        canUpdate: false,
        isCompleted: false
      }
    };
  }

  /**
   * Get list of surveys with localized content
   */
  static async getSurveys(params: {
    status?: string;
    visibility?: string;
    industry?: string;
    limit?: number;
    userId?: string;
    lang?: 'en' | 'ta';
  }) {
    const {
      status = 'published',
      visibility = 'public',
      industry,
      limit = 100,
      userId,
      lang = 'en'
    } = params;

    // Build query
    const query: any = { status };
    if (visibility) query.visibility = visibility;
    if (industry) query.industry = industry;

    // Fetch surveys
    const surveys = await Survey.find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Fetch templates for all surveys
    const surveyIds = surveys.map(s => s.surveyId);
    const templates = await SurveyTemplate.find({
      surveyId: { $in: surveyIds }
    }).lean();

    // Create template map
    const templateMap = new Map(
      templates.map(t => [t.surveyId, t])
    );

    // Fetch user responses if userId provided
    let userResponsesMap = new Map();
    if (userId) {
      const responses = await SurveyResponse.find({
        surveyId: { $in: surveyIds },
        userId
      }).lean();

      userResponsesMap = new Map(
        responses.map(r => [r.surveyId, r])
      );
    }

    // Localize all surveys
    return surveys.map(survey => {
      const template = templateMap.get(survey.surveyId);
      const userResponse = userResponsesMap.get(survey.surveyId);

      const localized = this.localizeSurvey(survey, template, lang);

      return {
        ...localized,
        userResponse: userResponse ? {
          responseId: userResponse._id,
          status: userResponse.status,
          hasResponded: true,
          canUpdate: userResponse.status === 'draft',
          isCompleted: userResponse.status !== 'draft'
        } : undefined
      };
    });
  }

  /**
   * Localize survey and template based on language
   */
  private static localizeSurvey(
    survey: any,
    template: any,
    lang: 'en' | 'ta'
  ) {
    // Get translations or fallback to English
    const surveyTrans = template?.translations?.[lang] || template?.translations?.en || {};

    return {
      surveyId: survey.surveyId,
      label: survey.label,
      status: survey.status,
      visibility: survey.visibility,
      industry: survey.industry,
      price: survey.price,
      timeToComplete: survey.timeToComplete,

      // Localized fields
      title: surveyTrans.title || template?.title || '',
      description: surveyTrans.description || template?.description || '',
      successMessage: surveyTrans.successMessage,
      thankYouMessage: surveyTrans.thankYouMessage,
      instructions: surveyTrans.instructions,

      // Localized questions
      questions: (template?.questions || []).map((q: any) => {
        const qTrans = q.translations?.[lang] || q.translations?.en || {};

        return {
          questionId: q.questionId,
          questionType: q.questionType,
          required: q.required,

          // Localized question fields
          label: qTrans.label || q.label || '',
          description: qTrans.description || q.description,
          placeholder: qTrans.placeholder || q.placeholder,
          options: qTrans.options || q.options || [],
          errorMessage: qTrans.errorMessage,
          helpText: qTrans.helpText,

          // Pass through config
          validation: q.validation,
          config: q.config
        };
      })
    };
  }
}
```

---

### 1.4 Migration Script

**File**: `D:\Projects\thought_metrics\thought-metrics-web-api\src\migrations\add-tamil-translations.ts`

```typescript
import mongoose from 'mongoose';
import { SurveyTemplate } from '../models/survey-template.model';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Migration script to add Tamil translations to existing surveys
 *
 * Run with: ts-node src/migrations/add-tamil-translations.ts
 */

// Tamil translation mappings (example - you'll need complete translations)
const questionTypeTranslations: Record<string, string> = {
  'TEXT': 'உரை',
  'TEXTAREA': 'உரைப் பகுதி',
  'NUMBER': 'எண்',
  'EMAIL': 'மின்னஞ்சல்',
  'PHONE': 'தொலைபேசி',
  'DATE': 'தேதி',
  'MCQ_SINGLE': 'ஒற்றை தேர்வு',
  'MCQ_MULTIPLE': 'பல தேர்வு',
  'RATING': 'மதிப்பீடு',
  'LIKERT_SCALE': 'லிக்கர்ட் அளவுகோல்',
  'SCALE': 'அளவுகோல்',
  'RANKING': 'தரவரிசை',
  // ... add more
};

// Common Tamil translations
const commonTranslations = {
  required: 'இந்த புலம் தேவை',
  optional: 'விருப்பமானது',
  pleaseSelect: 'தயவுசெய்து தேர்ந்தெடுக்கவும்',
  enterYourAnswer: 'உங்கள் பதிலை உள்ளிடவும்',
  // ... add more common phrases
};

/**
 * Translate text to Tamil (stub - replace with actual translation)
 * In production, you could use:
 * 1. Pre-translated CSV/JSON file
 * 2. Google Translate API
 * 3. Manual translation service
 */
async function translateToTamil(text: string): Promise<string> {
  // For now, return placeholder
  // In production, implement actual translation logic
  return `[TA] ${text}`;
}

/**
 * Translate options array
 */
async function translateOptions(
  options: Array<{ label: string; value: string }>
): Promise<Array<{ label: string; value: string }>> {
  if (!options || options.length === 0) return [];

  return Promise.all(
    options.map(async (opt) => ({
      label: await translateToTamil(opt.label),
      value: opt.value // Keep value same for data consistency
    }))
  );
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    console.log('🚀 Starting Tamil translation migration...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');

    // Get all survey templates
    const templates = await SurveyTemplate.find({});
    console.log(`📊 Found ${templates.length} survey templates`);

    let updatedCount = 0;

    for (const template of templates) {
      console.log(`\n📝 Processing survey: ${template.surveyId}`);

      // Check if already has translations
      if (template.translations?.en && template.translations?.ta) {
        console.log(`⏭️  Skipping ${template.surveyId} - already has translations`);
        continue;
      }

      // Create English translations from existing fields
      template.translations = {
        en: {
          title: template.title || '',
          description: template.description,
          successMessage: 'Thank you for completing this survey!',
          thankYouMessage: 'Your response has been recorded.',
          instructions: 'Please answer all required questions.'
        },
        ta: {
          title: await translateToTamil(template.title || ''),
          description: template.description ?
            await translateToTamil(template.description) : undefined,
          successMessage: 'இந்த கணக்கெடுப்பை முடித்ததற்கு நன்றி!',
          thankYouMessage: 'உங்கள் பதில் பதிவு செய்யப்பட்டது.',
          instructions: 'தயவுசெய்து அனைத்து தேவையான கேள்விகளுக்கும் பதிலளிக்கவும்.'
        }
      };

      // Translate questions
      for (const question of template.questions) {
        // Create English translation from existing fields
        question.translations = {
          en: {
            label: question.label || '',
            description: question.description,
            placeholder: question.placeholder,
            options: question.options,
            errorMessage: 'This field is required',
            helpText: undefined
          },
          ta: {
            label: await translateToTamil(question.label || ''),
            description: question.description ?
              await translateToTamil(question.description) : undefined,
            placeholder: question.placeholder ?
              await translateToTamil(question.placeholder) : undefined,
            options: await translateOptions(question.options || []),
            errorMessage: commonTranslations.required,
            helpText: undefined
          }
        };
      }

      // Save updated template
      await template.save();
      updatedCount++;
      console.log(`✅ Updated ${template.surveyId}`);
    }

    console.log(`\n\n🎉 Migration complete!`);
    console.log(`📊 Total templates: ${templates.length}`);
    console.log(`✅ Updated: ${updatedCount}`);
    console.log(`⏭️  Skipped: ${templates.length - updatedCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
migrate();
```

**Usage:**
```bash
# From backend directory
cd D:\Projects\thought_metrics\thought-metrics-web-api

# Run migration
npx ts-node src/migrations/add-tamil-translations.ts

# Or add to package.json scripts
"scripts": {
  "migrate:translations": "ts-node src/migrations/add-tamil-translations.ts"
}

# Then run
yarn migrate:translations
```

---

### 1.5 Validation Updates

**File**: `D:\Projects\thought_metrics\thought-metrics-web-api\src\validation\survey.validation.ts`

```typescript
import { body, query, param } from 'express-validator';

export const surveyValidation = {

  // Validate language query parameter
  languageQuery: query('lang')
    .optional()
    .isIn(['en', 'ta'])
    .withMessage('Language must be either "en" or "ta"'),

  // Validate survey creation with translations
  createSurveyTemplate: [
    body('title').notEmpty().withMessage('Title is required'),
    body('translations').isObject().withMessage('Translations must be an object'),
    body('translations.en').isObject().withMessage('English translation is required'),
    body('translations.en.title').notEmpty().withMessage('English title is required'),
    body('translations.ta').isObject().withMessage('Tamil translation is required'),
    body('translations.ta.title').notEmpty().withMessage('Tamil title is required'),
    body('questions').isArray().withMessage('Questions must be an array'),
    body('questions.*.translations').isObject().withMessage('Question translations required'),
    body('questions.*.translations.en.label').notEmpty()
      .withMessage('English question label is required'),
    body('questions.*.translations.ta.label').notEmpty()
      .withMessage('Tamil question label is required'),
  ],

  // Validate get survey details
  getSurveyDetails: [
    param('surveyId').notEmpty().withMessage('Survey ID is required'),
    query('lang').optional().isIn(['en', 'ta'])
  ]
};
```

---

## Phase 2: Frontend Implementation

### 2.1 Language Store (Zustand)

**File**: `C:\Projects\thought-metrics-web-app\src\core\stores\language.store.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Supported languages
 */
export type Language = 'en' | 'ta';

/**
 * Language display names
 */
export const LANGUAGE_NAMES: Record<Language, { en: string; native: string }> = {
  en: { en: 'English', native: 'English' },
  ta: { en: 'Tamil', native: 'தமிழ்' }
};

/**
 * Language store state interface
 */
interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isEnglish: () => boolean;
  isTamil: () => boolean;
}

/**
 * Detect user's preferred language from browser
 */
function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ta' ? 'ta' : 'en'; // Default to English
}

/**
 * Language store with persistence
 *
 * Automatically persists language preference to localStorage
 * and syncs across tabs/windows
 */
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en', // Will be overridden by persisted value or browser detection

      setLanguage: (lang: Language) => {
        set({ language: lang });
        // Optional: Track language change in analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'language_change', {
            language: lang
          });
        }
      },

      toggleLanguage: () => {
        const currentLang = get().language;
        const newLang: Language = currentLang === 'en' ? 'ta' : 'en';
        get().setLanguage(newLang);
      },

      isEnglish: () => get().language === 'en',
      isTamil: () => get().language === 'ta'
    }),
    {
      name: 'thought-metrics-language', // localStorage key
      storage: createJSONStorage(() => localStorage),

      // Custom initialization with browser language detection
      onRehydrateStorage: () => (state) => {
        // If no persisted language, detect from browser
        if (!state?.language) {
          const detectedLang = detectBrowserLanguage();
          state?.setLanguage(detectedLang);
        }
      }
    }
  )
);

/**
 * Hook to get current language
 */
export const useCurrentLanguage = () => {
  return useLanguageStore((state) => state.language);
};

/**
 * Hook to get language setter
 */
export const useSetLanguage = () => {
  return useLanguageStore((state) => state.setLanguage);
};

/**
 * Hook to toggle language
 */
export const useToggleLanguage = () => {
  return useLanguageStore((state) => state.toggleLanguage);
};
```

---

### 2.2 Update Survey Service

**File**: `C:\Projects\thought-metrics-web-app\src\services\survey\survey.service.ts`

```typescript
import { ApiService } from '@services/api/api.service';
import type {
  ISurvey,
  ISurveyDetails,
  IGetSurveysParams,
  ISurveySubmission,
  ISurveyResponse
} from '@types/survey.type';
import type { Language } from '@/core/stores/language.store';

/**
 * Extended parameters with language support
 */
export interface IGetSurveysParamsWithLang extends IGetSurveysParams {
  lang?: Language;
}

/**
 * Survey Service - Handles all survey-related API calls
 */
export class SurveyService extends ApiService {

  /**
   * Get list of published surveys with language support
   *
   * @param params - Query parameters including language
   * @returns Promise<ISurvey[]>
   */
  async getSurveys(params: IGetSurveysParamsWithLang): Promise<ISurvey[]> {
    const { lang = 'en', ...restParams } = params;

    const queryString = new URLSearchParams({
      ...restParams,
      lang
    } as any).toString();

    const response = await this.get<{ success: boolean; data: ISurvey[] }>(
      `/surveys?${queryString}`
    );

    return response.data;
  }

  /**
   * Get survey details with template and user response
   * Includes language-specific content
   *
   * @param surveyId - Survey identifier
   * @param lang - Language code (en or ta)
   * @returns Promise<ISurveyDetails>
   */
  async getSurveyDetails(
    surveyId: string,
    lang: Language = 'en'
  ): Promise<ISurveyDetails> {
    const response = await this.get<{ success: boolean; data: ISurveyDetails }>(
      `/surveys/${surveyId}?lang=${lang}`
    );

    return response.data;
  }

  /**
   * Check if survey is available for response
   *
   * @param surveyId - Survey identifier
   * @returns Promise<{ available: boolean; reason?: string }>
   */
  async checkAvailability(surveyId: string): Promise<{
    available: boolean;
    reason?: string;
  }> {
    const response = await this.get<{
      success: boolean;
      data: { available: boolean; reason?: string }
    }>(`/surveys/${surveyId}/availability`);

    return response.data;
  }

  /**
   * Submit survey response
   *
   * @param surveyId - Survey identifier
   * @param submission - Survey answers
   * @returns Promise<ISurveyResponse>
   */
  async submitSurvey(
    surveyId: string,
    submission: ISurveySubmission
  ): Promise<ISurveyResponse> {
    const response = await this.post<{
      success: boolean;
      data: ISurveyResponse
    }>(`/surveys/${surveyId}/submit`, submission);

    return response.data;
  }

  /**
   * Save draft survey response
   *
   * @param surveyId - Survey identifier
   * @param answers - Partial answers
   * @returns Promise<ISurveyResponse>
   */
  async saveDraft(
    surveyId: string,
    answers: ISurveySubmission
  ): Promise<ISurveyResponse> {
    const response = await this.post<{
      success: boolean;
      data: ISurveyResponse
    }>(`/surveys/${surveyId}/draft`, answers);

    return response.data;
  }
}

// Export singleton instance
export const surveyService = new SurveyService();
```

---

### 2.3 Update Query Hooks

**File**: `C:\Projects\thought-metrics-web-app\src\core\hooks\queries\survey\use-survey-list.query.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { surveyService } from '@services/survey/survey.service';
import { QueryKeys } from '@/core/lib/query-keys';
import { useCurrentLanguage } from '@/core/stores/language.store';
import type { IGetSurveysParams } from '@types/survey.type';

/**
 * Hook to fetch list of surveys with language support
 *
 * Automatically refetches when language changes
 */
export const useSurveyListQuery = (params: IGetSurveysParams = {}) => {
  const language = useCurrentLanguage();

  return useQuery({
    queryKey: QueryKeys.surveys.list({ ...params, lang: language }),
    queryFn: () => surveyService.getSurveys({ ...params, lang: language }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};
```

**File**: `C:\Projects\thought-metrics-web-app\src\core\hooks\queries\survey\use-survey-details.query.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { surveyService } from '@services/survey/survey.service';
import { QueryKeys } from '@/core/lib/query-keys';
import { useCurrentLanguage } from '@/core/stores/language.store';

/**
 * Hook to fetch survey details with language support
 *
 * Automatically refetches when language changes
 */
export const useSurveyDetailsQuery = (surveyId: string) => {
  const language = useCurrentLanguage();

  return useQuery({
    queryKey: QueryKeys.surveys.detail(surveyId, language),
    queryFn: () => surveyService.getSurveyDetails(surveyId, language),
    enabled: !!surveyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**File**: `C:\Projects\thought-metrics-web-app\src\core\lib\query-keys.ts`

```typescript
import type { IGetSurveysParams } from '@types/survey.type';
import type { Language } from '@/core/stores/language.store';

/**
 * Query key factory for consistent cache keys
 * Including language parameter for proper cache invalidation
 */
export const QueryKeys = {
  surveys: {
    all: ['surveys'] as const,
    lists: () => [...QueryKeys.surveys.all, 'list'] as const,
    list: (params: IGetSurveysParams & { lang?: Language }) =>
      [...QueryKeys.surveys.lists(), params] as const,
    details: () => [...QueryKeys.surveys.all, 'details'] as const,
    detail: (id: string, lang: Language) =>
      [...QueryKeys.surveys.details(), id, lang] as const,
    availability: (id: string) =>
      [...QueryKeys.surveys.all, 'availability', id] as const,
  },
  // ... other query keys
};
```

---

### 2.4 UI Translations

**File**: `C:\Projects\thought-metrics-web-app\src\core\i18n\translations.ts`

```typescript
import type { Language } from '@/core/stores/language.store';

/**
 * UI text translations for static elements
 */
export const translations = {
  en: {
    // Survey navigation
    survey: {
      next: 'Next',
      back: 'Back',
      submit: 'Submit',
      saveAndContinue: 'Save & Continue Later',
      saveDraft: 'Save Draft',

      // Progress
      progress: 'Progress',
      question: 'Question',
      of: 'of',
      completed: 'completed',

      // Validation
      required: 'This field is required',
      pleaseSelect: 'Please select an option',
      pleaseEnter: 'Please enter your answer',
      invalidEmail: 'Please enter a valid email',
      invalidPhone: 'Please enter a valid phone number',

      // Messages
      thankYou: 'Thank you for completing the survey!',
      draftSaved: 'Draft saved successfully',
      submissionSuccess: 'Survey submitted successfully',
      submissionError: 'Failed to submit survey. Please try again.',

      // Survey list
      availableSurveys: 'Available Surveys',
      noSurveysAvailable: 'No surveys available at the moment',
      completedSurveys: 'Completed Surveys',
      draftSurveys: 'Draft Surveys',

      // Status badges
      status: {
        available: 'Available',
        draftSaved: 'Draft Saved',
        submitted: 'Submitted',
        approved: 'Approved',
        declined: 'Declined',
        expired: 'Expired'
      },

      // Filters
      allIndustries: 'All Industries',
      filterByIndustry: 'Filter by Industry',

      // Time
      timeToComplete: 'Time to complete',
      minutes: 'minutes',

      // Comments
      addComment: 'Add a comment (optional)',
      commentPlaceholder: 'Share any additional thoughts...',

      // Resume
      resumeSurvey: 'Resume Survey',
      startSurvey: 'Start Survey',
      continueWhere: 'Continue where you left off',

      // Errors
      errorLoading: 'Error loading survey',
      errorSubmitting: 'Error submitting survey',
      pleaseTryAgain: 'Please try again later',

      // Question types
      questionTypes: {
        text: 'Text',
        number: 'Number',
        email: 'Email',
        phone: 'Phone',
        date: 'Date',
        singleChoice: 'Single Choice',
        multipleChoice: 'Multiple Choice',
        rating: 'Rating',
        scale: 'Scale',
        ranking: 'Ranking'
      }
    },

    // Auth screens
    auth: {
      signUp: 'Sign Up',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',

      // Study preferences (from auth-constant.ts:224-226)
      studyPreferences: 'Study Preferences',
      studyPreferencesDescription:
        'Are there any types of studies in which you would not like to participate? If so unselect them below.',

      // Buttons
      createAccount: 'Create Account',
      login: 'Login',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',

      // Validation
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordsDoNotMatch: 'Passwords do not match',
      invalidEmail: 'Invalid email address',

      // Messages
      accountCreated: 'Account created successfully',
      loginSuccess: 'Login successful',
      loginError: 'Invalid credentials',

      // Social
      continueWithGoogle: 'Continue with Google',
      continueWithFacebook: 'Continue with Facebook'
    },

    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      clear: 'Clear',
      apply: 'Apply',
      reset: 'Reset',
      viewMore: 'View More',
      viewLess: 'View Less',
      learnMore: 'Learn More',
      readMore: 'Read More',
      seeAll: 'See All'
    }
  },

  ta: {
    // Survey navigation
    survey: {
      next: 'அடுத்தது',
      back: 'பின்னால்',
      submit: 'சமர்ப்பிக்கவும்',
      saveAndContinue: 'சேமித்து பின்னர் தொடரவும்',
      saveDraft: 'வரைவை சேமிக்கவும்',

      // Progress
      progress: 'முன்னேற்றம்',
      question: 'கேள்வி',
      of: 'இன்',
      completed: 'முடிந்தது',

      // Validation
      required: 'இந்த புலம் தேவை',
      pleaseSelect: 'தயவுசெய்து ஒரு விருப்பத்தை தேர்ந்தெடுக்கவும்',
      pleaseEnter: 'தயவுசெய்து உங்கள் பதிலை உள்ளிடவும்',
      invalidEmail: 'தயவுசெய்து சரியான மின்னஞ்சலை உள்ளிடவும்',
      invalidPhone: 'தயவுசெய்து சரியான தொலைபேசி எண்ணை உள்ளிடவும்',

      // Messages
      thankYou: 'கணக்கெடுப்பை முடித்ததற்கு நன்றி!',
      draftSaved: 'வரைவு வெற்றிகரமாக சேமிக்கப்பட்டது',
      submissionSuccess: 'கணக்கெடுப்பு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது',
      submissionError: 'கணக்கெடுப்பை சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',

      // Survey list
      availableSurveys: 'கிடைக்கக்கூடிய கணக்கெடுப்புகள்',
      noSurveysAvailable: 'தற்போது கணக்கெடுப்புகள் எதுவும் கிடைக்கவில்லை',
      completedSurveys: 'முடிக்கப்பட்ட கணக்கெடுப்புகள்',
      draftSurveys: 'வரைவு கணக்கெடுப்புகள்',

      // Status badges
      status: {
        available: 'கிடைக்கிறது',
        draftSaved: 'வரைவு சேமிக்கப்பட்டது',
        submitted: 'சமர்ப்பிக்கப்பட்டது',
        approved: 'அங்கீகரிக்கப்பட்டது',
        declined: 'நிராகரிக்கப்பட்டது',
        expired: 'காலாவதியானது'
      },

      // Filters
      allIndustries: 'அனைத்து தொழில்கள்',
      filterByIndustry: 'தொழில்துறை மூலம் வடிகட்டவும்',

      // Time
      timeToComplete: 'முடிக்க நேரம்',
      minutes: 'நிமிடங்கள்',

      // Comments
      addComment: 'கருத்தைச் சேர்க்கவும் (விருப்பமானது)',
      commentPlaceholder: 'கூடுதல் எண்ணங்களைப் பகிரவும்...',

      // Resume
      resumeSurvey: 'கணக்கெடுப்பைத் தொடரவும்',
      startSurvey: 'கணக்கெடுப்பைத் தொடங்கவும்',
      continueWhere: 'நீங்கள் நிறுத்திய இடத்தில் தொடரவும்',

      // Errors
      errorLoading: 'கணக்கெடுப்பை ஏற்றுவதில் பிழை',
      errorSubmitting: 'கணக்கெடுப்பை சமர்ப்பிப்பதில் பிழை',
      pleaseTryAgain: 'தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்',

      // Question types
      questionTypes: {
        text: 'உரை',
        number: 'எண்',
        email: 'மின்னஞ்சல்',
        phone: 'தொலைபேசி',
        date: 'தேதி',
        singleChoice: 'ஒற்றை தேர்வு',
        multipleChoice: 'பல தேர்வு',
        rating: 'மதிப்பீடு',
        scale: 'அளவுகோல்',
        ranking: 'தரவரிசை'
      }
    },

    // Auth screens
    auth: {
      signUp: 'பதிவு செய்யவும்',
      signIn: 'உள்நுழைக',
      signOut: 'வெளியேறு',
      email: 'மின்னஞ்சல்',
      password: 'கடவுச்சொல்',
      confirmPassword: 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
      firstName: 'முதல் பெயர்',
      lastName: 'கடைசி பெயர்',
      phone: 'தொலைபேசி எண்',
      dateOfBirth: 'பிறந்த தேதி',
      gender: 'பாலினம்',

      // Study preferences
      studyPreferences: 'ஆய்வு விருப்பத்தேர்வுகள்',
      studyPreferencesDescription:
        'நீங்கள் பங்கேற்க விரும்பாத எந்த வகையான ஆய்வுகள் உள்ளதா? அப்படியானால் கீழே அவற்றை தேர்வு நீக்கவும்.',

      // Buttons
      createAccount: 'கணக்கை உருவாக்கவும்',
      login: 'உள்நுழைக',
      forgotPassword: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
      resetPassword: 'கடவுச்சொல்லை மீட்டமைக்கவும்',

      // Validation
      emailRequired: 'மின்னஞ்சல் தேவை',
      passwordRequired: 'கடவுச்சொல் தேவை',
      passwordsDoNotMatch: 'கடவுச்சொற்கள் பொருந்தவில்லை',
      invalidEmail: 'தவறான மின்னஞ்சல் முகவரி',

      // Messages
      accountCreated: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது',
      loginSuccess: 'உள்நுழைவு வெற்றிகரமானது',
      loginError: 'தவறான நற்சான்றிதழ்கள்',

      // Social
      continueWithGoogle: 'Google மூலம் தொடரவும்',
      continueWithFacebook: 'Facebook மூலம் தொடரவும்'
    },

    // Common
    common: {
      loading: 'ஏற்றுகிறது...',
      error: 'பிழை',
      success: 'வெற்றி',
      cancel: 'ரத்துசெய்',
      confirm: 'உறுதிப்படுத்தவும்',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      save: 'சேமிக்கவும்',
      close: 'மூடு',
      yes: 'ஆம்',
      no: 'இல்லை',
      ok: 'சரி',
      search: 'தேடு',
      filter: 'வடிகட்டு',
      sort: 'வரிசைப்படுத்து',
      clear: 'அழி',
      apply: 'பயன்படுத்து',
      reset: 'மீட்டமை',
      viewMore: 'மேலும் காண்க',
      viewLess: 'குறைவாகக் காண்க',
      learnMore: 'மேலும் அறிக',
      readMore: 'மேலும் படிக்கவும்',
      seeAll: 'அனைத்தையும் காண்க'
    }
  }
};

/**
 * Hook to get translations based on current language
 */
import { useCurrentLanguage } from '@/core/stores/language.store';

export const useTranslations = () => {
  const language = useCurrentLanguage();
  return translations[language];
};

/**
 * Get translation by key path
 * Example: t('survey.next') returns 'Next' or 'அடுத்தது'
 */
export const useTranslate = () => {
  const t = useTranslations();

  return (key: string): string => {
    const keys = key.split('.');
    let value: any = t;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if path not found
      }
    }

    return typeof value === 'string' ? value : key;
  };
};

/**
 * Direct translation function (non-hook)
 */
export const translate = (key: string, lang: Language): string => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
};
```

---

### 2.5 Language Toggle Component

**File**: `C:\Projects\thought-metrics-web-app\src\shared\components\survey\LanguageToggle.tsx`

```typescript
import React from 'react';
import {
  useLanguageStore,
  LANGUAGE_NAMES,
  type Language
} from '@/core/stores/language.store';

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

/**
 * Language Toggle Component
 *
 * Allows users to switch between English and Tamil
 */
export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = 'default',
  className = ''
}) => {
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex gap-1 bg-gray-100 rounded-md p-1 ${className}`}>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            language === 'en'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          onClick={() => handleLanguageChange('ta')}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            language === 'ta'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          aria-label="Switch to Tamil"
        >
          த
        </button>
      </div>
    );
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
        className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
        title={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="ml-1 text-sm font-medium">
          {language === 'en' ? 'த' : 'EN'}
        </span>
      </button>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm ${className}`}>
      <span className="text-sm font-medium text-gray-700">Language:</span>
      <div className="inline-flex gap-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            language === 'en'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Switch to English"
          aria-pressed={language === 'en'}
        >
          {LANGUAGE_NAMES.en.native}
        </button>
        <button
          onClick={() => handleLanguageChange('ta')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            language === 'ta'
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-700 hover:bg-gray-200'
          }`}
          aria-label="Switch to Tamil"
          aria-pressed={language === 'ta'}
        >
          {LANGUAGE_NAMES.ta.native}
        </button>
      </div>
    </div>
  );
};

/**
 * Minimal inline language toggle
 */
export const InlineLanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm text-gray-600 hover:text-primary transition-colors underline"
      aria-label={`Switch to ${language === 'en' ? 'Tamil' : 'English'}`}
    >
      {language === 'en' ? 'தமிழ்' : 'English'}
    </button>
  );
};
```

---

### 2.6 Update Survey Components

**File**: `C:\Projects\thought-metrics-web-app\src\shared\screens\survey-boards\SurveyBoardsComponent.tsx`

Add language toggle to the component:

```typescript
// Add to imports
import { LanguageToggle } from '@components/survey/LanguageToggle';
import { useTranslations } from '@/core/i18n/translations';

export const SurveyBoardsComponent = () => {
  const t = useTranslations();

  // ... existing code ...

  return (
    <div className="survey-boards-container">
      {/* Header with language toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t.survey.availableSurveys}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.firstName}!
          </p>
        </div>
        <LanguageToggle variant="compact" />
      </div>

      {/* Industry filter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2">
          {t.survey.filterByIndustry}
        </label>
        {/* ... filter dropdown ... */}
      </div>

      {/* Survey grid */}
      <div className="survey-grid">
        {surveys?.map((survey) => (
          <SurveyCard
            key={survey.surveyId}
            survey={survey}
          />
        ))}
      </div>
    </div>
  );
};
```

**File**: `C:\Projects\thought-metrics-web-app\src\shared\screens\survey-boards\SurveyDetailComponent.tsx`

```typescript
// Add to imports
import { LanguageToggle } from '@components/survey/LanguageToggle';
import { useTranslations, useTranslate } from '@/core/i18n/translations';

export const SurveyDetailComponent: React.FC<Props> = ({ surveyId }) => {
  const t = useTranslations();
  const translate = useTranslate();

  // Data is automatically refetched when language changes
  const { data: surveyDetails, isLoading } = useSurveyDetailsQuery(surveyId);

  // ... existing state ...

  return (
    <div className="survey-detail-container">
      {/* Header with language toggle */}
      <div className="survey-header flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {surveyDetails?.title}
          </h2>
          <p className="text-gray-600 mt-1">
            {surveyDetails?.description}
          </p>
        </div>
        <LanguageToggle variant="compact" />
      </div>

      {/* Progress indicator */}
      <div className="progress-section mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t.survey.question} {currentQuestion + 1} {t.survey.of} {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((currentQuestion / totalQuestions) * 100)}% {t.survey.completed}
          </span>
        </div>
        {/* Progress bar */}
      </div>

      {/* Question rendering - content is already localized from API */}
      <SurveyQuestionWrapper
        question={surveyDetails?.questions[currentQuestion]}
        answer={answers[currentQuestion]}
        onChange={(value) => handleAnswerChange(currentQuestion, value)}
        onNext={handleNext}
        onBack={handleBack}
        isFirst={currentQuestion === 0}
        isLast={currentQuestion === totalQuestions - 1}
        isValid={isCurrentQuestionValid()}
        nextButtonText={currentQuestion === totalQuestions - 1 ? t.survey.submit : t.survey.next}
        backButtonText={t.survey.back}
        saveDraftText={t.survey.saveDraft}
      />
    </div>
  );
};
```

---

## Phase 3: Testing & Deployment

### 3.1 Testing Checklist

#### Backend Testing
```bash
# Test API endpoints with language parameter
curl http://localhost:3000/api/v1/surveys?lang=en
curl http://localhost:3000/api/v1/surveys?lang=ta
curl http://localhost:3000/api/v1/surveys/TM-AD001?lang=ta

# Test invalid language parameter
curl http://localhost:3000/api/v1/surveys?lang=fr
# Should return 400 error

# Test survey submission (language doesn't affect submission)
curl -X POST http://localhost:3000/api/v1/surveys/TM-AD001/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"answers": [...]}'
```

#### Frontend Testing

**Manual Test Cases:**

1. **Language Toggle**
   - [ ] Click English → Tamil switches language
   - [ ] Click Tamil → English switches language
   - [ ] Language preference persists on page reload
   - [ ] Language syncs across multiple tabs

2. **Survey List Page**
   - [ ] Survey titles display in selected language
   - [ ] Industry filter displays in selected language
   - [ ] Status badges display in selected language
   - [ ] UI buttons/labels display in selected language
   - [ ] Switching language refetches data

3. **Survey Detail Page**
   - [ ] Survey title/description display in selected language
   - [ ] Question labels display in selected language
   - [ ] Question options display in selected language
   - [ ] Placeholder text displays in selected language
   - [ ] Error messages display in selected language
   - [ ] Navigation buttons display in selected language
   - [ ] Progress indicators display in selected language

4. **Question Types** (Test in both languages)
   - [ ] MCQ Single Choice - Options in correct language
   - [ ] MCQ Multiple Choice - Options in correct language
   - [ ] Likert Scale - Scale labels in correct language
   - [ ] Matrix - Row/column labels in correct language
   - [ ] Ranking - Items in correct language
   - [ ] All other 12 question types

5. **Draft Functionality**
   - [ ] Save draft with English language
   - [ ] Switch to Tamil, resume draft
   - [ ] Answers persist, only language changes
   - [ ] Submit from Tamil language works

6. **Edge Cases**
   - [ ] Missing translations fallback to English
   - [ ] Empty survey list message in correct language
   - [ ] Loading states display in correct language
   - [ ] Error messages display in correct language
   - [ ] Success toasts display in correct language

7. **Mobile Responsiveness**
   - [ ] Language toggle works on mobile
   - [ ] Tamil text displays correctly (font support)
   - [ ] All content readable in both languages

**Automated Tests:**

```typescript
// src/__tests__/language-toggle.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/core/lib/query-client';
import { LanguageToggle } from '@components/survey/LanguageToggle';
import { useLanguageStore } from '@/core/stores/language.store';

describe('LanguageToggle', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'en' });
  });

  it('renders with English selected by default', () => {
    render(<LanguageToggle />);
    const englishBtn = screen.getByRole('button', { name: /english/i });
    expect(englishBtn).toHaveClass('bg-primary');
  });

  it('switches to Tamil when Tamil button clicked', () => {
    render(<LanguageToggle />);
    const tamilBtn = screen.getByRole('button', { name: /tamil/i });
    fireEvent.click(tamilBtn);

    const language = useLanguageStore.getState().language;
    expect(language).toBe('ta');
  });

  it('persists language selection to localStorage', async () => {
    render(<LanguageToggle />);
    const tamilBtn = screen.getByRole('button', { name: /tamil/i });
    fireEvent.click(tamilBtn);

    await waitFor(() => {
      const stored = localStorage.getItem('thought-metrics-language');
      expect(stored).toContain('"language":"ta"');
    });
  });
});

// src/__tests__/survey-detail-language.test.tsx
describe('SurveyDetailComponent with Language', () => {
  it('fetches Tamil survey when language is Tamil', async () => {
    useLanguageStore.setState({ language: 'ta' });

    render(
      <QueryClientProvider client={queryClient}>
        <SurveyDetailComponent surveyId="TM-AD001" />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/வாடிக்கையாளர் கணக்கெடுப்பு/)).toBeInTheDocument();
    });
  });

  it('refetches survey when language changes', async () => {
    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <SurveyDetailComponent surveyId="TM-AD001" />
      </QueryClientProvider>
    );

    // Initially English
    await waitFor(() => {
      expect(screen.getByText(/Customer Survey/)).toBeInTheDocument();
    });

    // Change to Tamil
    useLanguageStore.getState().setLanguage('ta');

    rerender(
      <QueryClientProvider client={queryClient}>
        <SurveyDetailComponent surveyId="TM-AD001" />
      </QueryClientProvider>
    );

    // Should show Tamil
    await waitFor(() => {
      expect(screen.getByText(/வாடிக்கையாளர் கணக்கெடுப்பு/)).toBeInTheDocument();
    });
  });
});
```

---

### 3.2 Deployment Guide

#### Backend Deployment

1. **Run migration script:**
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api

# Backup database first
mongodump --uri="mongodb://..." --out=./backup

# Run migration
yarn migrate:translations

# Verify translations
node -e "
const mongoose = require('mongoose');
const { SurveyTemplate } = require('./dist/models/survey-template.model');
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const sample = await SurveyTemplate.findOne();
  console.log(JSON.stringify(sample.translations, null, 2));
  process.exit(0);
});
"
```

2. **Deploy backend:**
```bash
# Build
yarn build

# Deploy to server (example with Docker)
docker build -t thought-metrics-api:latest .
docker push <registry>/thought-metrics-api:latest

# Or deploy directly
pm2 restart thought-metrics-api
```

#### Frontend Deployment

1. **Build frontend:**
```bash
cd C:\Projects\thought-metrics-web-app

# Build for production
yarn build

# Preview build locally
yarn preview
```

2. **Deploy frontend:**
```bash
# Deploy to server (example with Docker)
yarn docker:build
docker push <registry>/thought-metrics-web:latest

# Or static hosting
aws s3 sync dist/ s3://your-bucket --delete
```

3. **Test production:**
```bash
# Test English
curl https://your-domain.com/survey-boards

# Test Tamil
curl https://your-domain.com/survey-boards
# Then toggle language in UI
```

---

## File Changes Reference

### Backend Files

**New Files:**
- `src/migrations/add-tamil-translations.ts` - Migration script

**Modified Files:**
- `src/models/survey-template.model.ts` - Add translations schema
- `src/controllers/survey.controller.ts` - Add language parameter handling
- `src/services/survey.service.ts` - Add localization logic
- `src/validation/survey.validation.ts` - Validate language parameter
- `src/routes/survey.routes.ts` - Update route documentation

### Frontend Files

**New Files:**
- `src/core/stores/language.store.ts` - Language state management
- `src/core/i18n/translations.ts` - UI text translations
- `src/shared/components/survey/LanguageToggle.tsx` - Toggle component

**Modified Files:**
- `src/services/survey/survey.service.ts` - Add language parameter
- `src/core/hooks/queries/survey/use-survey-details.query.ts` - Use language
- `src/core/hooks/queries/survey/use-survey-list.query.ts` - Use language
- `src/core/lib/query-keys.ts` - Add language to keys
- `src/core/types/survey.type.ts` - Update interfaces (if needed)
- `src/shared/screens/survey-boards/SurveyBoardsComponent.tsx` - Add toggle
- `src/shared/screens/survey-boards/SurveyDetailComponent.tsx` - Add toggle + use translations
- `src/shared/ui/atoms/survey-questions/SurveyQuestionWrapper.tsx` - Use translations for buttons

---

## Translation Examples

### Example Survey in Database

```json
{
  "surveyId": "TM-AD001",
  "label": "Customer Satisfaction Survey",
  "status": "published",
  "industry": "Advertising",
  "price": 150,
  "timeToComplete": 10,

  "translations": {
    "en": {
      "title": "Customer Satisfaction Survey",
      "description": "Help us understand your experience with our advertising services",
      "successMessage": "Thank you for your valuable feedback!",
      "thankYouMessage": "Your responses will help us improve our services."
    },
    "ta": {
      "title": "வாடிக்கையாளர் திருப்தி கணக்கெடுப்பு",
      "description": "எங்கள் விளம்பர சேவைகளுடனான உங்கள் அனுபவத்தைப் புரிந்து கொள்ள எங்களுக்கு உதவுங்கள்",
      "successMessage": "உங்கள் மதிப்புமிக்க கருத்துக்களுக்கு நன்றி!",
      "thankYouMessage": "உங்கள் பதில்கள் எங்கள் சேவைகளை மேம்படுத்த உதவும்."
    }
  },

  "questions": [
    {
      "questionId": "q1",
      "questionType": "MCQ_SINGLE",
      "required": true,

      "translations": {
        "en": {
          "label": "How satisfied are you with our services?",
          "description": "Please rate your overall satisfaction",
          "options": [
            { "label": "Very Satisfied", "value": "very_satisfied" },
            { "label": "Satisfied", "value": "satisfied" },
            { "label": "Neutral", "value": "neutral" },
            { "label": "Dissatisfied", "value": "dissatisfied" },
            { "label": "Very Dissatisfied", "value": "very_dissatisfied" }
          ],
          "errorMessage": "Please select an option"
        },
        "ta": {
          "label": "எங்கள் சேவைகளில் நீங்கள் எவ்வளவு திருப்தி அடைகிறீர்கள்?",
          "description": "உங்கள் ஒட்டுமொத்த திருப்தியை மதிப்பிடவும்",
          "options": [
            { "label": "மிகவும் திருப்தி", "value": "very_satisfied" },
            { "label": "திருப்தி", "value": "satisfied" },
            { "label": "நடுநிலை", "value": "neutral" },
            { "label": "அதிருப்தி", "value": "dissatisfied" },
            { "label": "மிகவும் அதிருப்தி", "value": "very_dissatisfied" }
          ],
          "errorMessage": "தயவுசெய்து ஒரு விருப்பத்தை தேர்ந்தெடுக்கவும்"
        }
      }
    },
    {
      "questionId": "q2",
      "questionType": "LIKERT_SCALE",
      "required": true,

      "translations": {
        "en": {
          "label": "Our team was professional and courteous",
          "description": "Rate from 1 (Strongly Disagree) to 5 (Strongly Agree)",
          "errorMessage": "Please provide a rating"
        },
        "ta": {
          "label": "எங்கள் குழு தொழில்முறை மற்றும் மரியாதையுடன் இருந்தது",
          "description": "1 (கடுமையாக ஏற்கவில்லை) முதல் 5 (கடுமையாக ஏற்கிறேன்) வரை மதிப்பிடவும்",
          "errorMessage": "தயவுசெய்து மதிப்பீடு வழங்கவும்"
        }
      },

      "config": {
        "min": 1,
        "max": 5,
        "labels": {
          "en": {
            "min": "Strongly Disagree",
            "max": "Strongly Agree"
          },
          "ta": {
            "min": "கடுமையாக ஏற்கவில்லை",
            "max": "கடுமையாக ஏற்கிறேன்"
          }
        }
      }
    }
  ]
}
```

---

## Future Enhancements

### 1. Additional Languages
Add support for more Indian languages:
- Hindi (hi)
- Malayalam (ml)
- Kannada (kn)
- Telugu (te)

```typescript
// Extend language store
export type Language = 'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te';

// Add translations
export const LANGUAGE_NAMES: Record<Language, { en: string; native: string }> = {
  en: { en: 'English', native: 'English' },
  ta: { en: 'Tamil', native: 'தமிழ்' },
  hi: { en: 'Hindi', native: 'हिन्दी' },
  ml: { en: 'Malayalam', native: 'മലയാളം' },
  kn: { en: 'Kannada', native: 'ಕನ್ನಡ' },
  te: { en: 'Telugu', native: 'తెలుగు' }
};
```

### 2. Admin Translation Management UI
Create admin interface for managing translations:
- Edit translations in-app
- Import/export translations (CSV, JSON)
- Translation status tracking
- Collaborative translation workflow

### 3. Machine Translation Integration
For initial translation drafts:
- Google Cloud Translation API
- Microsoft Translator
- AWS Translate
- Human review workflow

### 4. Translation Quality Metrics
- Translation completion percentage
- Character count validation
- Missing translation reports
- A/B testing different translations

### 5. RTL Language Support
For future Arabic/Urdu support:
```typescript
const isRTL = (lang: Language) => ['ar', 'ur'].includes(lang);

<html lang={language} dir={isRTL(language) ? 'rtl' : 'ltr'}>
```

### 6. Voice Input in Native Language
- Speech-to-text in Tamil
- Audio question playback
- Accessibility improvements

### 7. Translation Analytics
- Track which language users prefer
- Survey completion rates by language
- User engagement metrics per language

---

## Summary

This implementation provides:
- ✅ Comprehensive multi-language support (English & Tamil)
- ✅ Scalable architecture for future languages
- ✅ Centralized translation management in backend
- ✅ Efficient frontend state management with Zustand
- ✅ Automatic refetching when language changes
- ✅ Persistent language preference
- ✅ Support for all 17 question types
- ✅ Backward compatibility with existing surveys
- ✅ Complete UI translation coverage
- ✅ Mobile-responsive design
- ✅ Production-ready deployment process

**Estimated Implementation Time:**
- Backend: 2-3 days
- Frontend: 2-3 days
- Testing: 1 day
- Deployment: 0.5 day
- **Total: ~6-7 days**

---

**Questions or Issues?**
Contact the development team or refer to this guide for implementation details.
