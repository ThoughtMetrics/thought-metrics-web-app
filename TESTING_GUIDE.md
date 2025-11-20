# Translation Feature Testing Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [End-to-End Testing](#end-to-end-testing)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Setup
- Frontend running on `http://localhost:4200`
- Backend API running on `http://localhost:3000` (or your configured port)
- MongoDB connection established
- MySQL connection established
- User authenticated (Firebase/Auth system)

### Check Configuration
```bash
# Frontend (.env or .env.local)
VITE_BASE_URL=http://localhost:3000
VITE_BASE_API_VERSION=v1

# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/thought-metrics
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=thought_metrics
```

---

## Frontend Testing

### 1. Start Frontend Development Server

```bash
cd C:\Projects\thought-metrics-web-app
yarn dev
```

Server should start at `http://localhost:4200`

### 2. Test Language Store

**Location:** Survey Boards Page (`/survey-boards`)

**Test Cases:**

✅ **TC1: Language Toggle Visibility**
- Navigate to `/survey-boards`
- **Expected:** Language toggle buttons (English | தமிழ்) visible at top right
- **Screenshot Location:** Header section

✅ **TC2: Switch to Tamil**
- Click on "தமிழ்" button
- **Expected:**
  - Button becomes active (highlighted)
  - All UI text changes to Tamil immediately
  - Welcome message: "வரவேற்பு"
  - Verify Profile: "உங்கள் சுயவிவரத்தை சரிபார்க்கவும்/புதுப்பிக்கவும்"

✅ **TC3: Switch Back to English**
- Click on "English" button
- **Expected:**
  - All UI text changes to English
  - Welcome message: "Welcome"
  - Verify Profile: "Verify/update your profile"

✅ **TC4: LocalStorage Persistence**
- Switch to Tamil
- Refresh the page (F5)
- **Expected:** Language remains Tamil after refresh

✅ **TC5: Survey Card Translation**
- **English Mode:**
  - Status badges: "Available", "Draft Saved", "Submitted", "Approved", "Declined"
  - Time: "15 min"
  - Empty state: "No Surveys Available Yet"
- **Tamil Mode:**
  - Status badges: "கிடைக்கிறது", "வரைவு சேமிக்கப்பட்டது", "சமர்ப்பிக்கப்பட்டது", etc.
  - Time: "15 நிமிட"
  - Empty state: "இன்னும் கணக்கெடுப்புகள் இல்லை"

### 3. Test Survey Detail Page

**Location:** Survey Detail Page (`/survey-boards/TM-AD001`)

**Test Cases:**

✅ **TC6: Survey Questions in Tamil**
- Switch to Tamil language
- Click on any survey card
- **Expected:**
  - Question header: "கேள்வி 1 இல் 10"
  - Navigation: "பின்செல்" (Back), "அடுத்து" (Next)
  - Comment label: "கருத்தைச் சேர்க்கவும்"
  - Progress: "10% முழுமை"

✅ **TC7: Navigation Buttons**
- **English Mode:**
  - Back button: "Back"
  - Next button: "Next"
  - Submit button (last question): "Submit"
- **Tamil Mode:**
  - Back button: "பின்செல்"
  - Next button: "அடுத்து"
  - Submit button: "சமர்ப்பிக்கவும்"

✅ **TC8: Completed Survey Message**
- Complete and submit a survey
- Try to access it again
- **Expected (English):**
  - "Survey Already Completed"
  - "Back to Surveys" button
- **Expected (Tamil):**
  - "கணக்கெடுப்பு ஏற்கனவே முடிக்கப்பட்டது"
  - "கணக்கெடுப்புகளுக்குத் திரும்பு" button

### 4. Test Loading States

✅ **TC9: Loading Message**
- Navigate to survey page
- **Expected (English):** "Loading..."
- **Expected (Tamil):** "ஏற்றுகிறது..."

✅ **TC10: Error States**
- Navigate to non-existent survey
- **Expected (English):** "The requested resource was not found."
- **Expected (Tamil):** "கோரப்பட்ட ஆதாரம் கிடைக்கவில்லை."

---

## Backend Testing

### 1. Test API Endpoints

#### Option 1: Using Browser
Navigate to:
```
http://localhost:3000/api/v1/surveys?lang=en
http://localhost:3000/api/v1/surveys?lang=ta
http://localhost:3000/api/v1/surveys/TM-AD001?lang=ta
```

#### Option 2: Using cURL

```bash
# Test English (default)
curl -X GET "http://localhost:3000/api/v1/surveys" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test Tamil
curl -X GET "http://localhost:3000/api/v1/surveys?lang=ta" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test Survey Details in Tamil
curl -X GET "http://localhost:3000/api/v1/surveys/TM-AD001?lang=ta" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Option 3: Using Postman

1. **GET** `http://localhost:3000/api/v1/surveys`
2. Add Query Param: `lang` = `ta`
3. Add Header: `Authorization` = `Bearer YOUR_TOKEN`
4. Send request

### 2. Verify API Response

✅ **TC11: Survey List Response**

**English Request:**
```json
{
  "success": true,
  "data": [
    {
      "surveyId": "TM-AD001",
      "label": "Smartphone Usage Survey",
      "price": "90.00",
      ...
    }
  ]
}
```

**Tamil Request (`?lang=ta`):**
```json
{
  "success": true,
  "data": [
    {
      "surveyId": "TM-AD001",
      "label": "ஸ்மார்ட்போன் பயன்பாட்டு கணக்கெடுப்பு",
      "price": "90.00",
      ...
    }
  ],
  "metadata": {
    "language": "ta",
    "hasTranslation": true
  }
}
```

✅ **TC12: Survey Details with Questions**

**Request:** `GET /api/v1/surveys/TM-AD001?lang=ta`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "survey": { ... },
    "template": {
      "label": "ஸ்மார்ட்போன் பயன்பாட்டு கணக்கெடுப்பு",
      "questions": [
        {
          "text": "நீங்கள் எந்த ஸ்மார்ட்போனை பயன்படுத்துகிறீர்கள்?",
          "config": {
            "options": [
              { "label": "ஆப்பிள்", "value": "apple" },
              { "label": "சாம்சங்", "value": "samsung" }
            ]
          }
        }
      ]
    },
    "metadata": {
      "language": "ta",
      "hasTranslation": true
    }
  }
}
```

### 3. Test Fallback Behavior

✅ **TC13: Unsupported Language**

**Request:** `GET /api/v1/surveys?lang=fr`

**Expected:** Should fallback to English (default)

✅ **TC14: No Language Parameter**

**Request:** `GET /api/v1/surveys`

**Expected:** Returns English (default)

---

## End-to-End Testing

### Complete User Flow

✅ **TC15: Full Survey Completion in Tamil**

1. **Login** as respondent
2. **Navigate** to `/survey-boards`
3. **Switch** language to Tamil (தமிழ்)
4. **Verify** all surveys show Tamil labels
5. **Click** on a survey card
6. **Verify** questions are in Tamil
7. **Answer** all questions
8. **Verify** navigation buttons are in Tamil
9. **Submit** survey
10. **Verify** success message in Tamil: "கணக்கெடுப்பு வெற்றிகரமாக முடிக்கப்பட்டது"

✅ **TC16: Language Switching Mid-Survey**

1. Start a survey in English
2. Answer 3 questions
3. Switch language to Tamil
4. **Expected:**
   - Page refetches with Tamil content
   - Previously answered questions remain answered
   - Remaining questions show in Tamil

✅ **TC17: Draft Persistence with Language**

1. Start survey in Tamil
2. Answer some questions
3. **Expected:** Draft saved with Tamil language preference
4. Reload page
5. **Expected:** Resumes in Tamil

---

## Troubleshooting

### Issue: Language Not Switching

**Symptoms:** UI remains in English after clicking Tamil

**Solutions:**
1. Check browser console for errors
2. Verify Zustand store is updating:
   ```javascript
   // In browser console
   localStorage.getItem('thought-metrics-language')
   ```
3. Check React Query devtools - queries should invalidate on language change

### Issue: API Returns English Despite `lang=ta`

**Symptoms:** Backend always returns English content

**Solutions:**
1. Verify middleware is attached:
   ```typescript
   // Check src/routes/v1/surveys.route.ts
   router.get('/', optionalLanguageMiddleware, ...)
   ```
2. Check MongoDB has translations:
   ```javascript
   // In MongoDB shell
   db.surveytemplates.findOne({ surveyId: "TM-AD001" }).translations
   ```
3. Verify language middleware logs (development mode):
   ```
   Language middleware: ta (from query)
   ```

### Issue: Missing Translations

**Symptoms:** Some text remains in English

**Solutions:**
1. Check translation keys exist in `src/core/i18n/translations.ts`
2. Verify component is using `useLanguage()` hook
3. Check for hardcoded strings in component

### Issue: Query Not Refetching on Language Change

**Symptoms:** Content doesn't update when language changes

**Solutions:**
1. Verify language is in queryKey:
   ```typescript
   queryKey: ['surveys', 'list', { lang: language }]
   ```
2. Check `queryClient.invalidateQueries()` is called in language store
3. Clear React Query cache manually

---

## Performance Testing

✅ **TC18: Query Caching**

1. Load survey list in English
2. Switch to Tamil (should refetch)
3. Switch back to English (should use cache)
4. **Expected:** Second English load is instant (from cache)

✅ **TC19: Translation Service Caching**

- Backend should cache translation results
- Check logs for cache hits (development mode)

---

## Accessibility Testing

✅ **TC20: Keyboard Navigation**

1. Use Tab key to navigate language toggle
2. Press Enter/Space to switch language
3. **Expected:** Keyboard accessible

✅ **TC21: ARIA Labels**

- Language toggle should have proper `aria-label`
- Current language should have `aria-current="true"`

---

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Mobile Testing

Test on mobile devices (or responsive mode):

✅ **TC22: Mobile Language Toggle**

- Language toggle should be visible
- Easy to tap (minimum 44x44px)
- Proper spacing

---

## Seed Data Testing (Optional)

### Run Seed Script

```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api
npx ts-node src/scripts/seed-surveys.ts
```

**Expected Output:**
```
🚀 Starting survey seed process...
✅ Database connections established
📋 Loading survey data from JSON...
✅ Loaded 20 surveys from JSON

Processing survey 1/20: Smartphone Usage Survey
  ✅ Created MongoDB template: TM-AD001
  ✅ Created MySQL survey: TM-AD001

Processing survey 2/20: Personal Care Products Survey
  ✅ Created MongoDB template: TM-PC001
  ✅ Created MySQL survey: TM-PC001

...

🎉 Seed completed successfully!
📊 Statistics:
   - Total surveys: 20
   - Successful: 20
   - Failed: 0
   - Duration: 5.2s
```

✅ **TC23: Verify Seeded Data**

1. Navigate to `/survey-boards`
2. **Expected:** 20 surveys visible
3. Switch to Tamil
4. **Expected:** All 20 surveys have Tamil labels
5. Open any survey
6. **Expected:** Questions are in Tamil

---

## Test Coverage Summary

| Category | Test Cases | Status |
|----------|-----------|--------|
| Frontend UI | TC1-TC10 | ✅ |
| Backend API | TC11-TC14 | ✅ |
| End-to-End | TC15-TC17 | ✅ |
| Performance | TC18-TC19 | ✅ |
| Accessibility | TC20-TC21 | ✅ |
| Mobile | TC22 | ✅ |
| Seed Data | TC23 | ✅ |

---

## Success Criteria

✅ **All must pass:**
1. UI switches between English and Tamil seamlessly
2. API returns correct language based on `lang` parameter
3. LocalStorage persists language preference
4. Queries refetch on language change
5. No TypeScript errors
6. No console errors
7. All 20 seeded surveys work in both languages

---

## Next Steps After Testing

1. ✅ **If all tests pass:** Deploy to staging
2. ❌ **If tests fail:** Check [Troubleshooting](#troubleshooting) section
3. 📝 **Report issues:** Create GitHub issue with test case number and error logs
