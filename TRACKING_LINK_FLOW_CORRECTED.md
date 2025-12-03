# Tracking Link Flow - Corrected Implementation

## Problem Fixed

**Issue:** Tracking links were incorrectly redirecting to `/sign-up` instead of the destination URL due to faulty `redirectToSignup` logic.

**Solution:** Removed `redirectToSignup` override logic. Tracking links now ALWAYS redirect to the specified `destinationUrl`, with proper tracking parameters.

---

## Correct Flow

### 1. Creating a Tracking Link

**Form Fields:**
```
- Campaign Name: "Thought Metrics Survey Campaign DEC 2025"
- Destination URL: "/survey_campaign" (endpoint only, not full URL)
- UTM Parameters: source, medium, campaign, term, content
- Allocated Survey ID: "TM-AM001" (optional)
- Post-Signup Redirect: "" (optional, empty = default behavior)
```

**Important:**
- `destinationUrl` should be an **endpoint path** like `/survey_campaign`, `/`, or `/advocate-landing`
- NOT a full URL like `https://www.thoughtmetrics.com/survey_campaign`

---

### 2. User Clicks Tracking Link

**Example:** User clicks `https://www.thoughtmetrics.com/t/q5i26H4R`

**Backend Processing (analytics.controller.ts:144-184):**

```typescript
// ALWAYS redirects to destinationUrl (NOT /sign-up)
const redirectUrl = new URL(link.destinationUrl, baseUrl);
// Result: https://www.thoughtmetrics.com/survey_campaign

// Add tracking parameters
redirectUrl.searchParams.set("tm_link_id", link.id);
redirectUrl.searchParams.set("utm_source", link.utmSource);
redirectUrl.searchParams.set("utm_medium", link.utmMedium);
// ... other UTM params

// Add allocated survey if specified
if (link.allocatedSurveyId) {
  redirectUrl.searchParams.set("allocated_survey", "TM-AM001");
}

// Add post-signup redirect if specified
if (link.postSignupRedirect) {
  redirectUrl.searchParams.set("redirect_after", link.postSignupRedirect);
}

// Redirect to destination
res.redirect(302, redirectUrl.toString());
```

**Result:** User lands on:
```
https://www.thoughtmetrics.com/survey_campaign?
  tm_link_id={uuid}
  &utm_source=social
  &utm_medium=whatsapp
  &utm_campaign=thought_metrics_survey_campaign_dec_2025
  &utm_term=thought+metrics+promotion
  &utm_content=lifestyle_habits_survey
  &allocated_survey=TM-AM001
```

---

### 3. Destination Page Behavior

**If destination is `/survey_campaign`:**

The `SurveyCampaignPage.tsx` component:

```typescript
// Reads parameters from URL
const params = new URLSearchParams(window.location.search);
const linkId = params.get('tm_link_id');
const allocatedSurvey = params.get('allocated_survey'); // "TM-AM001"

// Stores in localStorage
if (allocatedSurvey) {
  localStorage.setItem('tm_allocated_survey', allocatedSurvey);
}

// Conditional rendering based on auth status
if (user) {
  // User is logged in
  return <Button onClick={() => handleTakeSurvey()}>Take Survey</Button>;
} else {
  // User is NOT logged in
  return <Button onClick={() => handleRegisterClick()}>Register Now</Button>;
}
```

**Behavior:**

1. **Not Logged In:**
   - Shows "Register Now" button
   - Clicking navigates to: `/sign-up?tm_link_id={uuid}&utm_source=social&...&allocated_survey=TM-AM001`

2. **Logged In:**
   - Shows "Take Survey" button
   - Clicking navigates to:
     - `/surveys/TM-AM001` if `allocated_survey` is present
     - `/survey-boards` if no allocated survey

---

### 4. Sign-Up Flow

**When user clicks "Register Now":**

User lands on `/sign-up` with all tracking parameters:
```
/sign-up?
  tm_link_id={uuid}
  &utm_source=social
  &utm_medium=whatsapp
  &allocated_survey=TM-AM001
```

**After successful registration:**

The `tracker.js` or sign-up page logic:

```javascript
// Read allocated survey from localStorage
const allocatedSurvey = localStorage.getItem('tm_allocated_survey');

if (allocatedSurvey) {
  // Redirect to specific survey
  window.location.href = `/surveys/${allocatedSurvey}`; // /surveys/TM-AM001
  localStorage.removeItem('tm_allocated_survey'); // Clean up
} else {
  // Check for redirect_after parameter
  const redirectAfter = new URLSearchParams(window.location.search).get('redirect_after');

  if (redirectAfter) {
    window.location.href = redirectAfter;
  } else {
    // Default behavior
    window.location.href = '/survey-boards';
  }
}
```

---

### 5. Other Destination Pages

**If destination is `/` or `/advocate-landing` or other pages:**

- User is redirected directly to that page with tracking params
- No special signup/survey logic
- Just track the visit with `tm_link_id` and UTM parameters

---

## Field Explanations

### Destination URL
- **What:** Endpoint path where user lands when clicking the tracking link
- **Example:** `/survey_campaign`, `/`, `/advocate-landing`
- **NOT:** Full URLs like `https://www.thoughtmetrics.com/survey_campaign`

### Allocated Survey ID
- **What:** Specific survey ID to redirect user to after signup
- **Example:** `TM-AM001`, `TM-LF002`
- **When Used:** Only after user completes signup/login
- **Priority:** Highest priority for post-signup redirect

### Post-Signup Redirect
- **What:** Alternative page to redirect to after signup (if no allocated survey)
- **Example:** `/survey-campaign`, `/survey-boards`, `/dashboard`
- **When Used:** Only if `Allocated Survey ID` is empty
- **Default:** `/survey-boards` if not specified

### redirectToSignup (Deprecated)
- **Status:** ❌ NO LONGER USED
- **Reason:** Was causing confusion and breaking the flow
- **Replaced By:** Destination page logic handles signup routing

---

## Priority Order for Post-Signup Redirect

```
1. Allocated Survey ID (highest priority)
   ↓ If empty
2. Post-Signup Redirect parameter
   ↓ If empty
3. Default: /survey-boards
```

**Example:**

- `allocated_survey=TM-AM001` → Redirects to `/surveys/TM-AM001` ✅
- `allocated_survey` (empty) + `redirect_after=/survey-campaign` → Redirects to `/survey-campaign` ✅
- Both empty → Redirects to `/survey-boards` ✅

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: User Clicks Tracking Link                          │
│  https://www.thoughtmetrics.com/t/q5i26H4R                  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Backend Redirect Handler                           │
│  - Reads tracking link from database                        │
│  - Builds redirect URL with destinationUrl                  │
│  - Adds: tm_link_id, UTM params, allocated_survey           │
│  - Redirects to: /survey_campaign?params...                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Destination Page (/survey_campaign)                │
│  - Stores allocated_survey in localStorage                  │
│  - Checks if user is logged in                              │
└─────────────────────────────────────────────────────────────┘
           ↓                                    ↓
    ┌──────────────┐                  ┌─────────────────┐
    │ NOT LOGGED IN│                  │  LOGGED IN      │
    └──────────────┘                  └─────────────────┘
           ↓                                    ↓
  Show "Register Now"              Show "Take Survey"
           ↓                                    ↓
  Navigate to /sign-up      ┌──────────────────┴──────────────────┐
  with tracking params      │                                     │
           ↓                │  allocated_survey?                  │
┌─────────────────────┐    │                                     │
│ Sign-Up Page        │    │  YES: /surveys/TM-AM001             │
│ - User registers    │    │  NO: /survey-boards                 │
│ - tracker.js runs   │    └─────────────────────────────────────┘
└─────────────────────┘
           ↓
   Check localStorage
   tm_allocated_survey?
           │
     ┌─────┴─────┐
     │           │
    YES         NO
     │           │
     ↓           ↓
/surveys/TM-AM001   /survey-boards
   (or)             (default)
redirect_after path
```

---

## Testing Checklist

### ✅ Basic Tracking Link Flow

1. **Create Tracking Link:**
   - Name: "Test Campaign"
   - Destination URL: `/survey_campaign`
   - Allocated Survey: `TM-AM001`
   - Click "Create"

2. **Click Tracking Link:**
   - Copy generated link: `https://www.thoughtmetrics.com/t/{shortCode}`
   - Open in incognito window
   - **Expected:** Lands on `/survey_campaign?allocated_survey=TM-AM001&...`
   - **NOT:** `/sign-up` directly

3. **Not Logged In:**
   - **Expected:** See "Register Now" button
   - Click button
   - **Expected:** Navigate to `/sign-up?allocated_survey=TM-AM001&...`

4. **Complete Signup:**
   - Fill form and register
   - **Expected:** Redirect to `/surveys/TM-AM001`
   - **NOT:** `/survey-boards` or `/survey-campaign`

### ✅ Logged In Flow

1. **Click Same Tracking Link (logged in):**
   - **Expected:** Lands on `/survey_campaign?allocated_survey=TM-AM001&...`

2. **See "Take Survey" Button:**
   - Click button
   - **Expected:** Navigate to `/surveys/TM-AM001`

### ✅ No Allocated Survey

1. **Create Link Without Allocated Survey:**
   - Allocated Survey ID: (empty)
   - Post-Signup Redirect: `/dashboard`

2. **Complete Signup:**
   - **Expected:** Redirect to `/dashboard`

3. **If Post-Signup Redirect Also Empty:**
   - **Expected:** Redirect to `/survey-boards` (default)

### ✅ Different Destination Pages

1. **Destination: `/`:**
   - **Expected:** Lands on homepage with tracking params
   - No signup prompt

2. **Destination: `/advocate-landing`:**
   - **Expected:** Lands on advocate landing page
   - Tracking params attached

---

## Code Changes Summary

### Backend Changes

**File:** `analytics.controller.ts`

**Before (WRONG):**
```typescript
if (link.redirectToSignup) {
  redirectUrl = new URL("/sign-up", baseUrl);
} else {
  redirectUrl = new URL(link.destinationUrl);
}
```

**After (CORRECT):**
```typescript
// ALWAYS redirect to destinationUrl
const redirectUrl = new URL(link.destinationUrl, baseUrl);
```

### Frontend Changes

**Files:**
- `TrackingLinkForm.tsx` (Create)
- `EditTrackingLinkForm.tsx` (Edit)

**Changes:**
1. Removed "Auto-redirect to signup page" checkbox
2. Changed Destination URL to endpoint path (not full URL)
3. Added "None (uses default)" option for Post-Signup Redirect
4. Added info box explaining the flow
5. Updated default values:
   - `destinationUrl`: `/survey_campaign` (was full URL)
   - `postSignupRedirect`: `''` (was `/survey-campaign`)
   - `redirectToSignup`: `false` (was `true`)

---

## Migration Notes

### Existing Tracking Links

**If existing links have:**
- `destinationUrl`: `https://www.thoughtmetrics.com/survey_campaign` ✅ Still works
- `redirectToSignup`: `true` ❌ Now ignored, uses `destinationUrl` instead

**Recommended Action:**
1. Review existing tracking links
2. Update `destinationUrl` to use endpoint paths instead of full URLs
3. Clear `redirectToSignup` flag (not needed anymore)
4. Test each link to ensure proper redirect

---

## FAQ

**Q: Why was the old `redirectToSignup` flag removed?**
A: It was overriding the `destinationUrl` and causing confusion. The destination page should control the signup flow, not the tracking link.

**Q: Can I still force a direct redirect to signup?**
A: Yes! Set `destinationUrl` to `/sign-up` instead of using the `redirectToSignup` flag.

**Q: What if I want tracking link to go to signup AND then to a survey?**
A:
- Option 1: Set `destinationUrl: /sign-up`, `allocatedSurveyId: TM-AM001` → Goes to signup, then survey
- Option 2: Set `destinationUrl: /survey_campaign`, `allocatedSurveyId: TM-AM001` → Shows register button on survey page, then goes to survey after signup

**Q: What's the difference between `allocated_survey` and `redirect_after`?**
A:
- `allocated_survey`: Specific survey ID, highest priority for post-signup redirect
- `redirect_after`: Alternative page path if no allocated survey specified

**Q: Can I track other pages besides /survey_campaign?**
A: Yes! Any page can be a destination:
- `/` → Homepage
- `/advocate-landing` → Advocate landing
- `/sign-up` → Direct signup
- `/survey-boards` → Survey list
- Any other page

---

**Status:** ✅ Fully Fixed and Tested
**Last Updated:** 2024-12-03
**Breaking Changes:** Yes - requires backend restart and review of existing links
