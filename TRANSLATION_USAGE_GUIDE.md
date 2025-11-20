# Translation Usage Guide for Auth Pages

## ✅ Completed Work

### 1. Translation Keys Added
**File:** `src/core/i18n/translations.ts`

**Added Sections:**
- ✅ `industries` - All 13 industry types (English + Tamil)
- ✅ `auth.login` - Complete login page translations (English + Tamil)
- ✅ `auth.signup` - Complete signup page translations (English + Tamil)

### 2. Helper Function Created
**File:** `src/core/utils/industry-translator.ts`
- Maps industry values to translation keys
- `getIndustryLabel()` function for dynamic industry translation

### 3. Industry Filter Updated
**File:** `src/shared/screens/survey-boards/SurveyBoardsComponent.tsx`
- ✅ Now uses `translatedIndustryFilters` with `useLanguage()` hook
- Industry dropdown automatically switches between English/Tamil

---

## 🔧 Login Page Update Instructions

**File to Update:** `src/shared/screens/auth/AuthPage.tsx`

**Already Added:**
```typescript
// Line 18
import { useLanguage } from '@/core/hooks/use-language';

// Line 127
const { t, translations } = useLanguage();
```

**Replace These UI Texts:**

### Success Message (Line 270-273)
**Before:**
```tsx
<h2 className="text-2xl font-bold text-black mb-2">
  {ui.successMessage.title}
</h2>
<p className="text-black">{ui.successMessage.description}</p>
```

**After:**
```tsx
<h2 className="text-2xl font-bold text-black mb-2">
  {translations.auth.login.welcomeBack}
</h2>
<p className="text-black">{translations.auth.login.successMessage}</p>
```

### Page Title (Line 297-299)
**Before:**
```tsx
<h1 className="text-2xl font-medium text-black">
  {ui.pageTitle}
</h1>
```

**After:**
```tsx
<h1 className="text-2xl font-medium text-black">
  {translations.auth.login.pageTitle}
</h1>
```

### Google Sign-in Button
**Find and replace:**
```tsx
// Before
{ui.socialButtons.google}

// After
{translations.auth.signup.continueWithGoogle}
```

### Form Field Labels
**Find all instances and replace:**

```tsx
// Thought Metrics ID Label
{ui.fieldLabels.thoughtMetricsId}
// Replace with:
{translations.auth.login.thoughtMetricsId}

// Password Label
{ui.fieldLabels.password}
// Replace with:
{translations.auth.login.password}

// Remember Me Checkbox
{ui.checkboxLabels.rememberMe}
// Replace with:
{translations.auth.login.rememberMe}
```

### Buttons
```tsx
// Continue Button (not submitting)
{ui.buttons.continue}
// Replace with:
{translations.auth.login.continueButton}

// Signing In (submitting state)
{ui.buttons.continuing}
// Replace with:
{translations.auth.login.signingIn}

// Create Account Link
{ui.buttons.createAccount}
// Replace with:
{translations.auth.login.createAccount}
```

### Links
```tsx
// "Don't have an account?" text
{ui.links.noAccount}
// Replace with:
{translations.auth.login.noAccount}

// Reset password link
{ui.links.resetPassword}
// Replace with:
{translations.auth.login.resetPassword}
```

### Validation Messages
**Update the Zustand store's validation messages** (lines 60-63):

**Before:**
```typescript
if (!formData.thoughtMetricsId.trim())
  errors.thoughtMetricsId = validationMessages.thoughtMetricsId;
if (!formData.password.trim())
  errors.password = validationMessages.password;
```

**After:**
```typescript
if (!formData.thoughtMetricsId.trim())
  errors.thoughtMetricsId = translations.auth.login.thoughtMetricsIdRequired;
if (!formData.password.trim())
  errors.password = translations.auth.login.passwordRequired;
```

**Note:** You'll need to pass `translations` to the store, or better yet, keep using `validationMessages` but update the constant file.

---

## 🔧 Signup Page Update Instructions

**File to Update:** `src/shared/screens/auth/respondent-sign-up.tsx`

### Step 1: Add useLanguage Hook
```typescript
import { useLanguage } from '@/core/hooks/use-language';

// Inside component:
const { t, translations } = useLanguage();
```

### Step 2: Replace All UI Text

**Page Title:**
```tsx
// Before
{ui.pageTitle}
// After
{translations.auth.signup.pageTitle}
```

**Why Register Section:**
```tsx
// Before
{ui.whyRegister}
{ui.registerDescription}
// After
{translations.auth.signup.whyRegister}
{translations.auth.signup.registerDescription}
```

**Social Buttons:**
```tsx
// Before
{ui.socialButtons.facebook}
{ui.socialButtons.google}
// After
{translations.auth.signup.continueWithFacebook}
{translations.auth.signup.continueWithGoogle}
```

**Step Titles:**
```tsx
// Before
{ui.steps.step1.number} - {ui.steps.step1.title}
{ui.steps.step2.number} - {ui.steps.step2.title}
{ui.steps.step3.number} - {ui.steps.step3.title}
{ui.steps.step4.number} - {ui.steps.step4.title}

// After
{translations.auth.signup.step1} - {translations.auth.signup.yourInformation}
{translations.auth.signup.step2} - {translations.auth.signup.preferences}
{translations.auth.signup.step3} - {translations.auth.signup.paymentInfo}
{translations.auth.signup.step4} - {translations.auth.signup.surveys}
```

**Field Labels (Complete List):**
```tsx
{ui.fieldLabels.firstName} → {translations.auth.signup.firstName}
{ui.fieldLabels.lastName} → {translations.auth.signup.lastName}
{ui.fieldLabels.email} → {translations.auth.signup.email}
{ui.fieldLabels.password} → {translations.auth.signup.password}
{ui.fieldLabels.confirmPassword} → {translations.auth.signup.confirmPassword}
{ui.fieldLabels.phone} → {translations.auth.signup.phone}
{ui.fieldLabels.doorNumberOrStreetName} → {translations.auth.signup.doorNumber}
{ui.fieldLabels.district} → {translations.auth.signup.district}
{ui.fieldLabels.city} → {translations.auth.signup.city}
{ui.fieldLabels.state} → {translations.auth.signup.state}
{ui.fieldLabels.countryOrRegion} → {translations.auth.signup.country}
{ui.fieldLabels.zipCode} → {translations.auth.signup.zipCode}
{ui.fieldLabels.dateOfBirth} → {translations.auth.signup.dateOfBirth}
{ui.fieldLabels.gender} → {translations.auth.signup.gender}
```

**Participation Preferences:**
```tsx
// Title & Description
{ui.preferences.title} → {translations.auth.signup.participationPreferences}
{ui.preferences.description} → {translations.auth.signup.participationDescription}

// Options (from signUpFormConstant.participationOptions)
Replace the hardcoded labels with:
translations.auth.signup.thoughtMetricsFacilities
translations.auth.signup.phoneInterviews
translations.auth.signup.onlineInterviews
translations.auth.signup.interviewsAtHome
translations.auth.signup.localBusinesses
```

**Buttons:**
```tsx
{ui.buttons.next} → {translations.auth.signup.nextButton}
{ui.buttons.register} → {translations.auth.signup.registerButton}
{ui.buttons.processing} → {translations.auth.signup.processing}
```

**Terms & Privacy:**
```tsx
{ui.checkboxLabels.termsAccepted} → {translations.auth.signup.termsAccepted}
{ui.checkboxLabels.termsItem.terms} → {translations.auth.signup.termsAndConditions}
{ui.checkboxLabels.privacyAccepted.prefix} → {translations.auth.signup.privacyAccepted}
{ui.checkboxLabels.privacyItem.privacy} → {translations.auth.signup.privacyPolicy}
```

**Success Message:**
```tsx
{ui.successMessage.title} → {translations.auth.signup.welcomeMessage}
{ui.successMessage.description} → {translations.auth.signup.accountCreatedSuccess}
```

**Required Fields Note:**
```tsx
{ui.notes.requiredFields} → {translations.auth.signup.requiredFields}
```

**Validation Messages:**
All validation messages have corresponding keys in `translations.auth.signup.*Required` or `translations.auth.signup.*Invalid`

---

## 📝 Testing Checklist

### Login Page
- [ ] Page title changes to Tamil/English
- [ ] Form field labels translate
- [ ] Button text translates (Continue / தொடர்)
- [ ] Error messages translate
- [ ] Success message translates
- [ ] "Don't have an account?" translates

### Signup Page
- [ ] Page title translates
- [ ] All 15+ form fields translate
- [ ] Step headers translate (Step 1-4)
- [ ] Participation preferences translate
- [ ] Terms & privacy text translates
- [ ] Buttons translate
- [ ] Validation errors translate
- [ ] Success message translates

### Industry Filter
- [x] DONE - Dropdown shows Tamil industry names
- [x] DONE - "All Industries" = "அனைத்து துறைகள்"
- [x] DONE - Industry names update on language toggle

---

## 🚀 Quick Implementation Steps

1. **For Login Page:**
   ```bash
   # File: src/shared/screens/auth/AuthPage.tsx
   # Already has: import { useLanguage } from '@/core/hooks/use-language';
   # Already has: const { t, translations } = useLanguage();
   # TODO: Replace all {ui.*} with {translations.auth.login.*}
   ```

2. **For Signup Page:**
   ```bash
   # File: src/shared/screens/auth/respondent-sign-up.tsx
   # Add: import { useLanguage } from '@/core/hooks/use-language';
   # Add: const { t, translations } = useLanguage();
   # Replace: all {ui.*} with {translations.auth.signup.*}
   ```

3. **Find & Replace Helper:**
   Use VS Code's find and replace with regex:

   **Find:** `\{ui\.([a-zA-Z.]+)\}`

   Then manually replace each match with the appropriate translation key from the guide above.

---

## ✨ Benefits of This Implementation

1. **Single Source of Truth:** All translations in one file (`translations.ts`)
2. **Type-Safe:** TypeScript ensures all keys exist
3. **Easy to Add Languages:** Just add new language sections
4. **Automatic Switching:** Language toggle updates all text instantly
5. **Maintainable:** Clear separation of content and code
6. **Consistent:** Same translation system across entire app

---

## 📌 Translation Keys Reference

All available auth translation keys:

```typescript
translations.auth.login.pageTitle
translations.auth.login.thoughtMetricsId
translations.auth.login.password
translations.auth.login.rememberMe
translations.auth.login.continueButton
translations.auth.login.signingIn
translations.auth.login.createAccount
translations.auth.login.noAccount
translations.auth.login.resetPassword
translations.auth.login.welcomeBack
translations.auth.login.successMessage
translations.auth.login.invalidCredentials
translations.auth.login.loginFailed
translations.auth.login.thoughtMetricsIdRequired
translations.auth.login.passwordRequired

translations.auth.signup.pageTitle
translations.auth.signup.whyRegister
translations.auth.signup.registerDescription
translations.auth.signup.continueWithFacebook
translations.auth.signup.continueWithGoogle
translations.auth.signup.step1
translations.auth.signup.step2
translations.auth.signup.step3
translations.auth.signup.step4
translations.auth.signup.yourInformation
translations.auth.signup.preferences
translations.auth.signup.paymentInfo
translations.auth.signup.surveys
// ... (35+ more keys - see full list in translations.ts lines 470-533)
```

---

## 🎯 Next Steps

1. Update `AuthPage.tsx` with all translation replacements (see sections above)
2. Update `respondent-sign-up.tsx` with all translation replacements
3. Test both pages with English and Tamil language toggles
4. Verify all error messages display correctly in both languages
5. Check that form validation messages translate properly

**Estimated Time:** 30-45 minutes to update both files

**File Locations:**
- Login: `src/shared/screens/auth/AuthPage.tsx`
- Signup: `src/shared/screens/auth/respondent-sign-up.tsx`
- Translations: `src/core/i18n/translations.ts`
