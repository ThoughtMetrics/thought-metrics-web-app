# Adding New Languages Guide

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Translation Workflow](#translation-workflow)
6. [Testing](#testing)
7. [Best Practices](#best-practices)

---

## Overview

This guide explains how to add new languages (Hindi, Malayalam, Kannada, Telugu, or any other) to the survey application.

**Current Languages:**
- ✅ English (en)
- ✅ Tamil (ta)

**Ready to Add:**
- Hindi (hi)
- Malayalam (ml)
- Kannada (kn)
- Telugu (te)
- Any other language

**Time Required:** 2-4 hours per language (depending on translation availability)

---

## Quick Start

### 1. Add Language Code

**Frontend:** `src/core/stores/language.store.ts`

```typescript
// Already defined:
export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'ml' | 'kn' | 'te';

// Add to available languages:
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: getDefaultLanguage(),
      availableLanguages: ['en', 'ta', 'hi'], // ← Add 'hi' for Hindi
      // ...
    })
  )
);

// Add language name:
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  ta: 'தமிழ்',
  hi: 'हिंदी', // ← Add Hindi name
  ml: 'മലയാളം',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు'
};
```

**Backend:** `src/interface/translation.interface.ts`

```typescript
// Already defined:
export enum SupportedLanguage {
  ENGLISH = 'en',
  TAMIL = 'ta',
  HINDI = 'hi',     // ← Already exists
  MALAYALAM = 'ml',
  KANNADA = 'kn',
  TELUGU = 'te'
}
```

### 2. Add Translations

**Frontend:** `src/core/i18n/translations.ts`

```typescript
/**
 * Hindi Translations
 */
const hi: Translations = {
  common: {
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    close: 'बंद करें',
    back: 'वापस',
    next: 'अगला',
    finish: 'समाप्त',
    yes: 'हां',
    no: 'नहीं',
    optional: 'वैकल्पिक',
    required: 'आवश्यक',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    clear: 'साफ़ करें',
    apply: 'लागू करें',
    reset: 'रीसेट करें'
  },

  navigation: {
    home: 'होम',
    surveys: 'सर्वेक्षण',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    login: 'लॉग इन',
    signup: 'साइन अप'
  },

  surveyBoard: {
    title: 'उपलब्ध सर्वेक्षण',
    welcome: 'स्वागत है',
    welcomeBack: 'फिर से स्वागत है',
    verifyProfile: 'अपना प्रोफ़ाइल सत्यापित/अपडेट करें',
    startMessage: 'नीचे दिए गए लिंक पर सर्वेक्षण भरकर देखें कि क्या आप अध्ययन के लिए पूर्व-योग्य हैं।',
    noSurveys: 'अभी तक कोई सर्वेक्षण उपलब्ध नहीं है',
    noSurveysForIndustry: 'चयनित उद्योग के लिए कोई सर्वेक्षण उपलब्ध नहीं है',
    filterByIndustry: 'उद्योग द्वारा फ़िल्टर करें',
    allIndustries: 'सभी उद्योग',
    available: 'उपलब्ध',
    draft: 'ड्राफ्ट सहेजा गया',
    submitted: 'जमा किया गया',
    approved: 'स्वीकृत',
    declined: 'अस्वीकृत',
    completed: 'पूर्ण',
    minutes: 'मिनट',
    resume: 'फिर से शुरू करें',
    start: 'शुरू करें'
  },

  surveyDetail: {
    question: 'प्रश्न',
    of: 'का',
    optional: '(वैकल्पिक)',
    required: '(आवश्यक)',
    comment: 'एक टिप्पणी जोड़ें',
    commentPlaceholder: 'अपने विचार साझा करें...',
    saveDraft: 'ड्राफ्ट सहेजें',
    continue: 'जारी रखें',
    submit: 'सर्वेक्षण जमा करें',
    submitting: 'जमा कर रहे हैं...',
    backToSurveys: 'सर्वेक्षणों पर वापस जाएं',
    alreadyCompleted: 'सर्वेक्षण पहले ही पूर्ण हो चुका है',
    submittedMessage: 'आपने इस सर्वेक्षण के लिए पहले ही एक प्रतिक्रिया जमा कर दी है। यह वर्तमान में समीक्षा में है।',
    approvedMessage: 'आपकी प्रतिक्रिया स्वीकृत कर दी गई है। आपकी भागीदारी के लिए धन्यवाद!',
    declinedMessage: 'आपकी प्रतिक्रिया की समीक्षा की गई। अधिक विवरण के लिए कृपया अपना ईमेल जांचें।',
    thankYou: 'धन्यवाद!',
    surveyCompleted: 'सर्वेक्षण सफलतापूर्वक पूर्ण हुआ',
    responseRecorded: 'आपकी प्रतिक्रिया सफलतापूर्वक दर्ज की गई है।',
    pleaseAnswer: 'जारी रखने के लिए कृपया इस प्रश्न का उत्तर दें',
    complete: 'पूर्ण'
  },

  surveyQuestions: {
    selectOption: 'एक विकल्प चुनें',
    selectMultiple: 'लागू होने वाले सभी का चयन करें',
    enterValue: 'मान दर्ज करें',
    typeHere: 'यहां टाइप करें...',
    selectDate: 'तारीख चुनें',
    uploadFile: 'फ़ाइल अपलोड करें',
    dragItems: 'पुनः क्रमित करने के लिए खींचें',
    rankItems: 'सबसे महत्वपूर्ण से कम महत्वपूर्ण तक रैंक करें',
    allocatePoints: 'अंक आवंटित करें',
    totalPoints: 'कुल अंक',
    pointsRemaining: 'शेष अंक',
    selectMost: 'सबसे महत्वपूर्ण चुनें',
    selectLeast: 'कम से कम महत्वपूर्ण चुनें',
    noOptionsSelected: 'कोई विकल्प चयनित नहीं',
    invalidInput: 'अमान्य इनपुट'
  },

  validation: {
    required: 'यह फ़ील्ड आवश्यक है',
    invalidEmail: 'अमान्य ईमेल पता',
    invalidPhone: 'अमान्य फ़ोन नंबर',
    minLength: 'न्यूनतम {min} अक्षर आवश्यक',
    maxLength: 'अधिकतम {max} अक्षर अनुमत',
    minValue: 'न्यूनतम मान {min} है',
    maxValue: 'अधिकतम मान {max} है',
    invalidDate: 'अमान्य तारीख',
    invalidFile: 'अमान्य फ़ाइल प्रारूप',
    selectAtLeast: 'कम से कम {min} विकल्प चुनें',
    selectAtMost: 'अधिकतम {max} विकल्प चुनें',
    totalMustBe: 'कुल सटीक {total} होना चाहिए'
  },

  profile: {
    title: 'प्रोफ़ाइल',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    personalInfo: 'व्यक्तिगत जानकारी',
    contactInfo: 'संपर्क जानकारी',
    firstName: 'पहला नाम',
    lastName: 'अंतिम नाम',
    displayName: 'प्रदर्शन नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    dateOfBirth: 'जन्म तिथि',
    gender: 'लिंग',
    city: 'शहर',
    state: 'राज्य',
    country: 'देश',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    profileUpdated: 'प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया'
  },

  language: {
    selectLanguage: 'भाषा चुनें',
    english: 'English',
    tamil: 'தமிழ்',
    hindi: 'हिंदी',
    malayalam: 'മലയാളം',
    kannada: 'ಕನ್ನಡ',
    telugu: 'తెలుగు',
    changeLanguage: 'भाषा बदलें',
    languageChanged: 'भाषा सफलतापूर्वक बदली गई'
  },

  errors: {
    generic: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
    network: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
    timeout: 'अनुरोध समय समाप्त। कृपया पुनः प्रयास करें।',
    unauthorized: 'जारी रखने के लिए कृपया लॉगिन करें।',
    forbidden: 'आपके पास इस संसाधन तक पहुंचने की अनुमति नहीं है।',
    notFound: 'अनुरोधित संसाधन नहीं मिला।',
    serverError: 'सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।',
    tryAgain: 'फिर से प्रयास करें'
  }
};

// Update the translations object:
export const translations: Record<SupportedLanguage, Translations> = {
  en,
  ta,
  hi, // ← Add Hindi
  ml: en, // Placeholder until Malayalam is added
  kn: en, // Placeholder until Kannada is added
  te: en  // Placeholder until Telugu is added
};
```

---

## Frontend Implementation

### Step-by-Step Guide

#### Step 1: Enable Language in Store

**File:** `src/core/stores/language.store.ts`

```typescript
// Add to available languages array
availableLanguages: ['en', 'ta', 'hi'], // ← Add 'hi'
```

#### Step 2: Add Translations

**File:** `src/core/i18n/translations.ts`

1. Copy the English translation object
2. Translate all strings to the new language
3. Add to exports

#### Step 3: Test Language Toggle

```bash
yarn dev
```

Navigate to `/survey-boards` and verify new language appears in toggle.

---

## Backend Implementation

### Step 1: Add to Translation Service

**File:** `src/services/translation.service.ts`

```typescript
// Update fallback chain if needed
const DEFAULT_CONFIG: ITranslationFallbackConfig = {
  defaultLanguage: SupportedLanguage.ENGLISH,
  fallbackChain: [
    SupportedLanguage.ENGLISH,
    SupportedLanguage.TAMIL,
    SupportedLanguage.HINDI // ← Add to fallback chain
  ]
};
```

### Step 2: Add Survey Translations

**Option A: Manually Add to Existing Surveys**

```javascript
// MongoDB Shell
db.surveytemplates.updateMany(
  { surveyId: "TM-AD001" },
  {
    $set: {
      "translations.hi": {
        label: "स्मार्टफोन उपयोग सर्वेक्षण",
        description: "हम स्मार्टफोन उपयोग पैटर्न को समझना चाहते हैं",
        instructions: "सभी प्रश्नों का उत्तर दें",
        successMessage: "धन्यवाद! आपका जवाब दर्ज किया गया है।",
        thankYouMessage: "आपकी भागीदारी के लिए धन्यवाद!"
      },
      "questions.0.translations.hi": {
        text: "आप किस स्मार्टफोन का उपयोग करते हैं?",
        options: [
          { label: "एप्पल", value: "apple" },
          { label: "सैमसंग", value: "samsung" },
          { label: "वनप्लस", value: "oneplus" },
          { label: "अन्य", value: "other" }
        ]
      }
    }
  }
);
```

**Option B: Update Seed Script**

**File:** `src/scripts/seed-surveys.ts`

```typescript
// Add Hindi translations map
const HINDI_TRANSLATIONS: Record<string, string> = {
  'Yes': 'हां',
  'No': 'नहीं',
  'Apple': 'एप्पल',
  'Samsung': 'सैमसंग',
  'Other': 'अन्य',
  // ... add more translations
};

// Add to translation generation
function generateHindiTranslation(englishText: string): string {
  // Check direct translation
  if (HINDI_TRANSLATIONS[englishText]) {
    return HINDI_TRANSLATIONS[englishText];
  }

  // Add pattern-based translation logic
  return englishText; // Fallback
}

// In template creation
translations: {
  [SupportedLanguage.ENGLISH]: { /* ... */ },
  [SupportedLanguage.TAMIL]: { /* ... */ },
  [SupportedLanguage.HINDI]: {
    label: generateHindiTranslation(label),
    description: generateHindiTranslation(description),
    // ...
  }
}
```

---

## Translation Workflow

### Recommended Process

#### 1. Gather Translations

**Options:**
- **Professional Service:** Use translation service (e.g., Google Translate API, DeepL)
- **Manual Translation:** Hire native speaker
- **Crowdsource:** Use community contributors

#### 2. Translation Template

Create a spreadsheet with columns:
| English | Tamil | Hindi | Malayalam | Kannada | Telugu |
|---------|-------|-------|-----------|---------|--------|
| Welcome | வரவேற்பு | स्वागत है | സ്വാഗതം | ಸ್ವಾಗತ | స్వాగతం |
| Loading... | ஏற்றுகிறது... | लोड हो रहा है... | ലോഡ് ചെയ്യുന്നു... | ಲೋಡ್ ಆಗುತ್ತಿದೆ... | లోడ్ అవుతోంది... |

#### 3. Quality Assurance

**Checklist:**
- ✅ Native speaker review
- ✅ Context appropriate
- ✅ Length similar to English (for UI fit)
- ✅ No offensive terms
- ✅ Consistent terminology

---

## Testing

### Frontend Test

```bash
# 1. Start frontend
yarn dev

# 2. Open browser console
localStorage.setItem('thought-metrics-language', '{"state":{"language":"hi"}}')

# 3. Refresh page
# Expected: UI in Hindi
```

### Backend Test

```bash
# Test survey list in Hindi
curl -X GET "http://localhost:3000/api/v1/surveys?lang=hi" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify Translation Keys

```typescript
// Run this in browser console
import { translations } from '@/core/i18n/translations';
const hi = translations.hi;

// Check if all keys exist
console.log(hi.common.loading); // Should output Hindi text
console.log(hi.surveyBoard.welcome); // Should output Hindi text
```

---

## Best Practices

### 1. Translation Guidelines

✅ **DO:**
- Use professional translators for critical content
- Maintain consistent terminology across all translations
- Test with native speakers
- Keep strings in context (don't translate word-by-word)
- Use proper Unicode encoding

❌ **DON'T:**
- Rely solely on machine translation
- Translate technical terms (e.g., "surveyId" remains "surveyId")
- Use offensive or culturally inappropriate terms
- Hardcode text direction (use CSS for RTL if needed)

### 2. File Organization

```
src/core/i18n/
├── translations.ts       # Main file (500+ lines)
├── en/                   # Optional: Split by language
│   ├── common.ts
│   ├── survey.ts
│   └── errors.ts
├── ta/
│   ├── common.ts
│   ├── survey.ts
│   └── errors.ts
└── hi/
    ├── common.ts
    ├── survey.ts
    └── errors.ts
```

### 3. RTL Languages (Arabic, Hebrew, etc.)

If adding RTL languages:

```typescript
// In language.store.ts
export const getLanguageDirection = (lang: SupportedLanguage): 'ltr' | 'rtl' => {
  const rtlLanguages: SupportedLanguage[] = ['ar', 'he'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
};

// In App.tsx
useEffect(() => {
  const direction = getLanguageDirection(currentLanguage);
  document.documentElement.dir = direction;
}, [currentLanguage]);
```

### 4. Pluralization

For languages with complex plural rules:

```typescript
// Example for Hindi
function getHindiPlural(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// Usage
const surveyCount = 5;
const message = getHindiPlural(
  surveyCount,
  `${surveyCount} सर्वेक्षण`,  // singular
  `${surveyCount} सर्वेक्षण`   // plural (same in Hindi)
);
```

### 5. Date & Number Formatting

```typescript
// Use Intl API for locale-specific formatting
const formatter = new Intl.NumberFormat('hi-IN');
formatter.format(1234.56); // "1,234.56" in Hindi locale

const dateFormatter = new Intl.DateTimeFormat('hi-IN');
dateFormatter.format(new Date()); // Formatted date in Hindi
```

---

## Common Issues

### Issue: UI Layout Breaks

**Cause:** Translation text is too long

**Solution:**
```css
/* In component styles */
.survey-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Issue: Font Not Displaying

**Cause:** Missing font support for language script

**Solution:**
```css
/* Add to global CSS */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari&display=swap');

body {
  font-family: 'Noto Sans', 'Noto Sans Devanagari', sans-serif;
}
```

---

## Checklist

Use this checklist when adding a new language:

### Frontend
- [ ] Add language code to `SupportedLanguage` type
- [ ] Add to `availableLanguages` array in store
- [ ] Add language name to `LANGUAGE_NAMES`
- [ ] Create full translation object (500+ strings)
- [ ] Add to `translations` export
- [ ] Test language toggle
- [ ] Test all UI screens
- [ ] Verify localStorage persistence

### Backend
- [ ] Language enum already exists (no change needed)
- [ ] Add to fallback chain (optional)
- [ ] Add survey translations to MongoDB
- [ ] Test API endpoints with `?lang=X`
- [ ] Verify fallback behavior

### Testing
- [ ] Run frontend tests
- [ ] Run backend API tests
- [ ] Test complete user flow
- [ ] Verify with native speaker
- [ ] Check UI layout on mobile
- [ ] Test browser compatibility

### Documentation
- [ ] Update README.md with new language
- [ ] Add to supported languages list
- [ ] Document any special considerations

---

## Example: Adding Malayalam

### Quick Implementation

```typescript
// 1. Enable in store
availableLanguages: ['en', 'ta', 'hi', 'ml']

// 2. Add translations
const ml: Translations = {
  common: {
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    submit: 'സമർപ്പിക്കുക',
    // ... rest of translations
  },
  // ... all sections
};

// 3. Export
export const translations: Record<SupportedLanguage, Translations> = {
  en, ta, hi, ml, kn: en, te: en
};

// 4. Test
// Navigate to /survey-boards
// Click Malayalam (മലയാളം)
// Verify UI is in Malayalam
```

---

## Resources

### Translation Services
- Google Cloud Translation API
- DeepL API
- Microsoft Translator
- Amazon Translate

### Fonts
- Google Fonts (Noto Sans family supports 800+ languages)
- Adobe Fonts

### Testing Tools
- BrowserStack (test on real devices)
- Chrome DevTools (responsive mode)
- React Query DevTools

---

## Support

For questions or issues:
1. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for troubleshooting
2. Review existing language implementations (Tamil as reference)
3. Create GitHub issue with label `translation`
