# Database Architecture - Translation Storage

## Current Architecture (Correct by Design)

### MongoDB (SurveyTemplate Collection)
**Purpose:** Source of truth for ALL survey content and translations

**Data Stored:**
```javascript
{
  surveyId: "TM-T001",
  name: "Technology Adoption Survey",
  label: "Technology Adoption Survey",  // ← English (legacy/fallback)
  description: "Help us understand...", // ← English (legacy/fallback)

  // NEW: Multi-language translations
  translations: {
    "en": {
      label: "Technology Adoption Survey",
      description: "Help us understand...",
      instructions: "This survey takes approximately 5 minutes...",
      successMessage: "Thank you for completing this survey!",
      thankYouMessage: "Your response has been recorded successfully."
    },
    "ta": {
      label: "தொழில்நுட்ப தத்தெடுப்பு கணக்கெடுப்பு",
      description: "புரிந்து கொள்ள எங்களுக்கு உதவுங்கள்...",
      instructions: "இந்த கணக்கெடுப்பு சுமார் 5 நிமிடங்கள்...",
      successMessage: "இந்த கணக்கெடுப்பை முடித்ததற்கு நன்றி!",
      thankYouMessage: "உங்கள் பதில் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது."
    }
  },

  questions: [
    {
      id: "q1",
      text: "What smartphone do you use?", // ← English (legacy/fallback)
      translations: {
        "en": {
          text: "What smartphone do you use?",
          options: [
            { label: "Apple", value: "apple" },
            { label: "Samsung", value: "samsung" }
          ]
        },
        "ta": {
          text: "நீங்கள் எந்த ஸ்மார்ட்போனை பயன்படுத்துகிறீர்கள்?",
          options: [
            { label: "ஆப்பிள்", value: "apple" },
            { label: "சாம்சங்", value: "samsung" }
          ]
        }
      }
    }
  ]
}
```

✅ **MongoDB stores BOTH English AND Tamil translations**

---

### MySQL (Survey Table)
**Purpose:** Lightweight reference table with metadata

**Data Stored:**
```sql
CREATE TABLE surveys (
  id INT PRIMARY KEY,
  surveyId VARCHAR(20),           -- "TM-T001"
  templateMongoId VARCHAR(24),    -- MongoDB _id reference
  label VARCHAR(255),              -- English only (for admin display)
  industry VARCHAR(50),
  status VARCHAR(20),
  price DECIMAL(10,2),
  ...
)
```

❌ **MySQL does NOT store translations** (by design - it's just a reference table)

---

## How Translation Works (Current Implementation)

### API Request Flow:

1. **Frontend sends request:**
   ```
   GET /api/v1/surveys?lang=ta
   ```

2. **Backend controller (survey.controller.ts:93-157):**
   ```typescript
   // Fetch MySQL surveys
   const result = await SurveyService.list(filters);

   // Get language from middleware
   const language = ((req as any).language || 'en') as SupportedLanguage;

   // For each survey, fetch MongoDB template and localize
   const localizedData = await Promise.all(
     result.data.map(async (survey) => {
       const template = await SurveyTemplateService.getById(survey.templateMongoId);
       const localizedContent = template.getLocalizedContent(language);

       return {
         ...survey,
         label: localizedContent.label,        // ← Tamil label from MongoDB
         description: localizedContent.description
       };
     })
   );
   ```

3. **Response to frontend:**
   ```json
   {
     "success": true,
     "data": [
       {
         "surveyId": "TM-T001",
         "label": "தொழில்நுட்ப தத்தெடுப்பு கணக்கெடுப்பு",  // ← Tamil!
         "price": 40,
         ...
       }
     ],
     "metadata": {
       "language": "ta",
       "hasTranslation": true
     }
   }
   ```

---

## Answer to Your Question

### If you truncate both MongoDB and MySQL, then run `yarn seed:surveys`:

✅ **YES** - Both English AND Tamil translations will be added

**What gets stored:**

1. **MongoDB SurveyTemplate Collection:**
   - 20 survey templates
   - Each with `translations.en` (English)
   - Each with `translations.ta` (Tamil)
   - All questions with both language translations
   - All options with both language translations

2. **MySQL Survey Table:**
   - 20 survey records
   - Each with English `label` only
   - Each with `templateMongoId` linking to MongoDB
   - Metadata (price, industry, status, etc.)

### Current Seed Script (seed-surveys.ts) Does This:

**Lines 343-366:** Creates MongoDB template with translations:
```typescript
translations: {
  [SupportedLanguage.ENGLISH]: {   // 'en'
    label,
    description,
    instructions,
    successMessage,
    thankYouMessage
  },
  [SupportedLanguage.TAMIL]: {     // 'ta'
    label: tamilLabel,
    description: `${tamilLabel} பற்றி...`,
    instructions: `இந்த கணக்கெடுப்பு...`,
    successMessage: 'நன்றி!',
    thankYouMessage: 'பதிவு செய்யப்பட்டுள்ளது.'
  }
}
```

**Lines 389-403:** Creates question translations:
```typescript
translations: {
  [SupportedLanguage.ENGLISH]: {
    text: q.question,
    options: [...]
  },
  [SupportedLanguage.TAMIL]: {
    text: translateQuestion(q.question),
    options: translateOptions([...])
  }
}
```

**Lines 422-431:** Creates MySQL survey:
```typescript
{
  surveyId,
  templateMongoId: template._id.toString(),  // ← Links to MongoDB
  label,  // ← English only (for admin)
  ...
}
```

---

## Verification After Seeding

### 1. Check MongoDB has translations:
```bash
# Connect to MongoDB
mongosh

use thought_metrics

# Check one survey template
db.surveytemplates.findOne({ surveyId: "TM-T001" })
```

**Expected output:**
```javascript
{
  surveyId: "TM-T001",
  translations: {
    en: { label: "Technology Adoption Survey", ... },
    ta: { label: "தொழில்நுட்ப தத்தெடுப்பு கணக்கெடுப்பு", ... }
  },
  questions: [
    {
      translations: {
        en: { text: "What smartphone...", options: [...] },
        ta: { text: "நீங்கள் எந்த ஸ்மார்ட்போன....", options: [...] }
      }
    }
  ]
}
```

### 2. Check MySQL has survey records:
```bash
# Connect to MySQL
mysql -u root -p

use thought_metrics;

SELECT surveyId, label, templateMongoId FROM surveys LIMIT 5;
```

**Expected output:**
```
+----------+--------------------------------+-------------------------+
| surveyId | label                          | templateMongoId         |
+----------+--------------------------------+-------------------------+
| TM-T001  | Technology Adoption Survey     | 673c8f9a1b2c3d4e5f6a7b8c|
| TM-F002  | FMCG Product Survey            | 673c8f9a1b2c3d4e5f6a7b8d|
+----------+--------------------------------+-------------------------+
```

### 3. Test API returns Tamil:
```bash
curl "http://localhost:3000/api/v1/surveys?lang=ta" | jq '.data[0].label'
```

**Expected output:**
```
"தொழில்நுட்ப தத்தெடுப்பு கணக்கெடுப்பு"
```

---

## Summary

✅ **Current seed script IS correct and WILL add both English and Tamil translations**

- **MongoDB** = Stores FULL translations (English + Tamil)
- **MySQL** = Stores only English label (by design - it's metadata only)
- **API** = Fetches MongoDB and returns appropriate language
- **Frontend** = Receives translated content based on language toggle

### Run This Now:
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api
yarn seed:surveys
```

All 20 surveys will be created with both English and Tamil translations! 🚀
