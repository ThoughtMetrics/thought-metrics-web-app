# 🎯 Campaign Tracking System - Complete Guide

## Table of Contents

1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [Creating Campaign Tracking Links](#creating-campaign-tracking-links)
4. [Testing Guide](#testing-guide)
5. [Implementation Details](#implementation-details)
6. [Database Setup](#database-setup)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Overview

This system allows you to create tracking links for campaigns that guide users through registration and surveys while tracking their journey. Users can be directed to specific surveys (allocated surveys) or to the general survey boards.

**Key Features:**
- Campaign tracking with UTM parameters
- Allocated survey routing (optional)
- Conditional UI based on authentication state
- Analytics tracking throughout user journey
- localStorage-based persistence

---

## User Flow

### Complete Flow Diagram

```
User clicks tracking link
        ↓
http://localhost:3000/t/{shortCode}
        ↓
Backend tracks visit & redirects
        ↓
http://localhost:4200/survey-campaign?tm_link_id=xxx&utm_source=xxx&allocated_survey=xxx
        ↓
┌─────────────────────────────────────────┐
│  Survey Campaign Landing Page           │
│                                         │
│  IF NOT LOGGED IN:                      │
│    → "Register Now" button              │
│    → Redirects to /sign-up              │
│                                         │
│  IF LOGGED IN:                          │
│    → "Take Survey" button               │
│    → If allocated_survey exists:        │
│       → /surveys/{surveyId}             │
│    → Else:                              │
│       → /survey-boards                  │
└─────────────────────────────────────────┘
        ↓
After Signup (if not logged in):
        ↓
IF allocated_survey exists:
  → /surveys/{surveyId}
ELSE:
  → /survey-boards
```

### Scenario A: New User with Allocated Survey

```
1. User clicks: http://localhost:3000/t/BdhzgJU6
   ↓
2. Backend redirects to:
   http://localhost:4200/survey-campaign?tm_link_id=xxx&allocated_survey=TM-AM001
   ↓
3. Survey Campaign Page:
   - Shows "Register Now" button
   - Stores tm_allocated_survey="TM-AM001" in localStorage
   ↓
4. User clicks "Register Now" → /sign-up?tm_link_id=xxx&allocated_survey=TM-AM001
   ↓
5. User completes signup
   ↓
6. tracker.js redirects to: /surveys/TM-AM001
```

### Scenario B: New User WITHOUT Allocated Survey

```
1. User clicks tracking link (no allocated survey)
   ↓
2. Backend redirects to survey-campaign page
   ↓
3. User completes signup
   ↓
4. tracker.js redirects to: /survey-boards
```

### Scenario C: Existing User (Logged In)

```
1. User clicks tracking link
   ↓
2. Survey Campaign Page shows "Take Survey" button
   ↓
3. User clicks button
   ↓
4. If allocated_survey exists → /surveys/{surveyId}
   Else → /survey-boards
```

---

## Creating Campaign Tracking Links

### Option 1: Admin Panel (Recommended)

1. **Navigate to Admin Panel:**
   ```
   http://localhost:4200/admin/create-tracking-link
   ```

2. **Fill in the form:**
   ```
   Campaign Name: "Instagram Lifestyle Survey Campaign"
   Destination URL: http://localhost:4200/survey-campaign
   UTM Source: instagram
   UTM Medium: social
   UTM Campaign: lifestyle_q4_2024
   UTM Term: (optional)
   UTM Content: (optional)
   Allocated Survey ID: TM-AM001  ← (OPTIONAL)
   Post-Signup Redirect: /survey-campaign (optional)
   Auto-redirect to signup: ✅ (checked)
   ```

3. **Create and Copy Link:**
   - Click "Create Tracking Link"
   - Copy the generated link: `http://localhost:3000/t/{shortCode}`

### Option 2: API Call

```bash
curl -X POST http://localhost:3000/api/v1/analytics/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Instagram Lifestyle Survey",
    "destinationUrl": "http://localhost:4200/survey-campaign",
    "utmSource": "instagram",
    "utmMedium": "social",
    "utmCampaign": "lifestyle_q4_2024",
    "allocatedSurveyId": "TM-AM001",
    "redirectToSignup": false
  }'
```

### Campaign Flow Options

**A. Direct to Specific Survey (with allocated survey):**
```javascript
{
  "allocatedSurveyId": "TM-AM001",  // Specific survey
  "redirectToSignup": false          // Go to survey-campaign first
}
```

**B. Browse All Surveys:**
```javascript
{
  "allocatedSurveyId": null,         // No specific survey
  "redirectToSignup": false          // Go to survey-campaign → survey-boards
}
```

**C. Force Signup First:**
```javascript
{
  "redirectToSignup": true,          // Force signup
  "allocatedSurveyId": "TM-AM001"    // Then go to this survey
}
```

---

## Testing Guide

### Prerequisites

1. **Start both servers:**
   ```bash
   # Frontend (port 4200)
   cd C:\Projects\thought-metrics-web-app
   yarn dev

   # Backend (port 3000)
   cd D:\Projects\thought_metrics\thought-metrics-web-api
   # Run your backend start command
   ```

2. **Login as admin:**
   - Go to: `http://localhost:4200/login`
   - Use admin credentials

### Test 1: Create Tracking Link with Allocated Survey

**Steps:**
1. Go to: `http://localhost:4200/admin/create-tracking-link`
2. Fill form:
   ```
   Campaign Name: Test Campaign - Allocated Survey
   Destination URL: http://localhost:4200/survey-campaign
   UTM Source: test
   UTM Campaign: allocated_survey_test
   Allocated Survey ID: TM-AM001
   ```
3. Create link and copy tracking URL

**Expected Result:**
- ✅ Link created successfully
- ✅ Short code and full URL displayed

### Test 2: New User Flow with Allocated Survey

**Steps:**
1. Open **incognito window**
2. Visit: `http://localhost:3000/t/{shortCode}`

**Expected Results:**
- ✅ Redirects to survey-campaign page with params
- ✅ Shows "Register Now" button
- ✅ Campaign name displayed
- ✅ Benefits section visible

3. **Check DevTools → Local Storage:**
   ```
   tm_link_id: [uuid]
   tm_allocated_survey: TM-AM001
   tm_utm_source: test
   tm_utm_campaign: allocated_survey_test
   ```

4. Click "Register Now" and complete signup

**Expected Results:**
- ✅ Redirects to: `/surveys/TM-AM001` (NOT `/survey-boards`)

### Test 3: New User Flow WITHOUT Allocated Survey

**Steps:**
1. Create link WITHOUT allocated survey
2. Open incognito window
3. Complete signup

**Expected Results:**
- ✅ Redirects to: `/survey-boards`

### Test 4: Logged-In User with Allocated Survey

**Steps:**
1. Login normally
2. Visit tracking link

**Expected Results:**
- ✅ Shows "Take Survey" button (NOT "Register Now")
- ✅ Shows user email in greeting
- ✅ Message indicates special survey waiting
- ✅ Clicking button redirects to: `/surveys/TM-AM001`

### Test 5: Logged-In User WITHOUT Allocated Survey

**Steps:**
1. Login to account
2. Visit tracking link WITHOUT allocated survey

**Expected Results:**
- ✅ Shows "Browse Surveys" button
- ✅ Redirects to: `/survey-boards`

---

## Implementation Details

### Files Modified/Created

#### NEW Files:
- `src/services/api/tracking-link.service.ts` - Dedicated tracking link service
- `src/shared/screens/survey-campaign/SurveyCampaignPage.tsx` - Campaign landing page

#### UPDATED Files:
- `src/services/api/analytics.service.ts` - Refactored (overview/visitors only)
- `src/core/hooks/queries/analytics/index.queries.ts` - Updated imports
- `src/shared/screens/admin/tracking-links/TrackingLinkForm.tsx` - Added allocated survey field
- `src/pages/survey-campaign.astro` - Updated import
- `public/js/tracker.js` - Updated redirect logic

#### NO CHANGES NEEDED:
- `src/shared/screens/auth/respondent-sign-up.tsx` - Already compatible

### Service Architecture

#### tracking-link.service.ts
```typescript
export interface CreateTrackingLinkData {
  name: string;
  destinationUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  allocatedSurveyId?: string; // OPTIONAL
  postSignupRedirect?: string;
  redirectToSignup?: boolean;
}

class TrackingLinkService {
  async createTrackingLink(data: CreateTrackingLinkData) {
    // Cleans and validates data
    // Removes empty/null values
    return await apiService.post(endpoint, requestData);
  }
}
```

### Tracking System Logic

#### tracker.js - onUserRegistered()
```javascript
const onUserRegistered = (userId, userEmail) => {
  // Track registration event
  track('user_registered', { userId, email, sourceLinkId });

  // Priority redirect logic:
  const allocatedSurveyId = localStorage.getItem('tm_allocated_survey');

  if (allocatedSurveyId) {
    // 1. Highest priority: allocated survey
    redirectTo = `/surveys/${allocatedSurveyId}`;
    localStorage.removeItem('tm_allocated_survey');
  } else {
    // 2. Fallback: redirect_after or default to survey-boards
    redirectTo = localStorage.getItem('tm_redirect_after_signup') || '/survey-boards';
  }

  window.location.href = redirectTo;
};
```

### localStorage Keys Used

| Key | Description | Example |
|-----|-------------|---------|
| `tm_link_id` | Tracking link UUID | `01b7597e-9e0b-...` |
| `tm_allocated_survey` | Allocated survey ID | `TM-AM001` |
| `tm_utm_source` | UTM source | `instagram` |
| `tm_utm_campaign` | UTM campaign | `lifestyle_survey` |
| `tm_user_registered` | Registration flag | `true` |

---

## Database Setup

### Backend Changes (Already Completed by User)

The backend has been updated with:
- ✅ `allocated_survey_id` column added to `tracking_links` table
- ✅ Migration scripts executed
- ✅ API endpoint accepts `allocatedSurveyId` field
- ✅ Post-Signup Redirect made optional

### Database Verification

**Check tracking link:**
```sql
SELECT
  id,
  name,
  short_code,
  destination_url,
  utm_source,
  utm_campaign,
  allocated_survey_id,
  is_active,
  created_at
FROM tracking_links
WHERE short_code = 'abc123';
```

**Check link visits:**
```sql
SELECT COUNT(*) as total_visits
FROM link_visits
WHERE tracking_link_id = (
  SELECT id FROM tracking_links WHERE short_code = 'abc123'
);
```

**Check user registrations:**
```sql
SELECT
  lr.user_id,
  lr.tracking_link_id,
  tl.name as campaign_name,
  tl.allocated_survey_id,
  lr.created_at
FROM link_registrations lr
JOIN tracking_links tl ON lr.tracking_link_id = tl.id
WHERE tl.short_code = 'abc123'
ORDER BY lr.created_at DESC;
```

### Update Existing Link (if needed)

```sql
UPDATE tracking_links
SET
  destination_url = 'http://localhost:4200/survey-campaign',
  allocated_survey_id = 'TM-AM001',
  updated_at = NOW()
WHERE short_code = 'BdhzgJU6';
```

---

## Troubleshooting

### Issue: Tracking link shows 404

**Check:**
- [ ] Backend server running on port 3000?
- [ ] Backend route `/t/:shortCode` configured?
- [ ] Tracking link exists in database?
- [ ] `short_code` matches database value?

**Solution:** Verify backend is running and route handler is set up correctly.

### Issue: Allocated survey not working

**Check:**
- [ ] URL contains `allocated_survey` parameter?
- [ ] localStorage has `tm_allocated_survey` key?
- [ ] Browser console for JavaScript errors?
- [ ] `window.ThoughtMetrics` object exists?

**Debug Steps:**
1. Open DevTools → Console
2. Type: `localStorage.getItem('tm_allocated_survey')`
3. Type: `window.ThoughtMetrics.isFromTrackingLink()`
4. Check for errors in console

**Solution:** Ensure tracker.js is loaded and survey-campaign page stores the param.

### Issue: User redirects to survey-boards instead of allocated survey

**Check:**
- [ ] `allocated_survey` param in URL?
- [ ] localStorage persisted after signup?
- [ ] tracker.js `onUserRegistered()` being called?
- [ ] Survey ID is valid (exists in database)?

**Debug:**
```javascript
// Before signup
console.log(localStorage.getItem('tm_allocated_survey')); // Should show survey ID

// After signup (in tracker.js)
const allocatedSurveyId = localStorage.getItem('tm_allocated_survey');
console.log('Allocated Survey:', allocatedSurveyId); // Should show survey ID
```

**Solution:** Verify survey-campaign page is storing the value in localStorage.

### Issue: Params lost during signup redirect

**Check:**
- [ ] Survey-campaign page preserves params in redirect?
- [ ] Signup page URL contains all params?
- [ ] localStorage fallback working?

**Debug:**
```javascript
// In survey-campaign page
const params = new URLSearchParams(window.location.search);
console.log('All params:', Object.fromEntries(params));
```

**Solution:** Ensure handleRegisterClick() properly preserves params.

### Issue: Logged-in user sees "Register Now"

**Check:**
- [ ] AuthProvider loaded?
- [ ] Firebase auth state ready?
- [ ] `user` object exists in context?
- [ ] `isAuthReady` is true?

**Debug:**
```javascript
// In SurveyCampaignPage component
console.log('Auth Ready:', isAuthReady);
console.log('User:', user);
console.log('Is Logged In:', !!user);
```

**Solution:** Wait for `isAuthReady` before rendering UI.

### Issue: "Cannot read property 'onRegistered' of undefined"

**Cause:** tracker.js not loaded or failed to initialize

**Solution:**
1. Check if `public/js/tracker.js` exists
2. Verify script is included in HTML layout
3. Check browser console for load errors
4. Ensure script loads before signup component

---

## FAQ

### Q: What if allocated_survey_id is not provided?
**A:** User will be redirected to `/survey-boards` to browse all available surveys.

### Q: Can I change the allocated survey after creating the link?
**A:** Yes! Update the `tracking_links` table directly or use the admin panel edit feature (if implemented).

### Q: What happens if the user is already logged in?
**A:** They skip the signup flow and go directly to the survey (if allocated) or survey-boards.

### Q: How do I track which users came from which campaign?
**A:** Check the `link_registrations` table - it links users to their source tracking link ID.

### Q: Can one user be tracked by multiple campaigns?
**A:** The system stores the most recent tracking link ID. If a user clicks multiple tracking links, the last one will be recorded.

### Q: What is the difference between allocatedSurveyId and postSignupRedirect?
**A:**
- `allocatedSurveyId`: Specific survey to redirect to after signup (highest priority)
- `postSignupRedirect`: General page redirect if no allocated survey exists

### Q: Do I need to specify both fields?
**A:** No, both are optional:
- Only `allocatedSurveyId` → Redirects to that survey
- Only `postSignupRedirect` → Redirects to that page
- Neither specified → Defaults to `/survey-boards`
- Both specified → `allocatedSurveyId` takes priority

### Q: How long is tracking data persisted?
**A:**
- `tm_link_id`: Persists for 30 days
- `tm_allocated_survey`: Until used (cleaned up after signup)
- `tm_utm_*`: Persists for 30 days
- Session data: Clears after 30 minutes of inactivity

### Q: Can I test without backend changes?
**A:** No, the backend must support the `allocated_survey_id` field. However, the backend changes have already been completed by the user.

---

## Example Campaigns

### Campaign 1: Instagram Lifestyle Survey
```javascript
{
  "name": "Instagram - Lifestyle Survey Dec 2024",
  "destinationUrl": "http://localhost:4200/survey-campaign",
  "utmSource": "instagram",
  "utmMedium": "social",
  "utmCampaign": "lifestyle_survey_dec_2024",
  "allocatedSurveyId": "TM-LF001",
  "redirectToSignup": false
}
```
**Flow:** Instagram → survey-campaign → register → TM-LF001

### Campaign 2: Email Newsletter
```javascript
{
  "name": "Email Newsletter - General Survey",
  "destinationUrl": "http://localhost:4200/survey-campaign",
  "utmSource": "email",
  "utmMedium": "newsletter",
  "utmCampaign": "monthly_dec_2024",
  "allocatedSurveyId": null,
  "redirectToSignup": false
}
```
**Flow:** Email → survey-campaign → register → survey-boards

### Campaign 3: WhatsApp Referral
```javascript
{
  "name": "WhatsApp Referral Program",
  "destinationUrl": "http://localhost:4200/survey-campaign",
  "utmSource": "whatsapp",
  "utmMedium": "referral",
  "utmCampaign": "referral_2024",
  "allocatedSurveyId": "TM-RF001",
  "redirectToSignup": false
}
```
**Flow:** WhatsApp → survey-campaign → register → TM-RF001

---

## Analytics Dashboard

View campaign performance:
```
http://localhost:4200/admin/analytics
```

**Metrics Available:**
- Unique visitors per link
- Registrations (conversions)
- Conversion rate (%)
- UTM source breakdown
- Recent visitor details
- Click timestamps
- User demographics (from signup data)

---

## Production Checklist

Before deploying to production:

- [ ] Update all URLs from `localhost` to production domains
- [ ] Test with real survey IDs from production database
- [ ] Verify SSL certificates for HTTPS
- [ ] Set up monitoring for tracking errors
- [ ] Configure analytics dashboard access
- [ ] Test email/social sharing of tracking links
- [ ] Verify mobile responsiveness
- [ ] Check cross-browser compatibility
- [ ] Set up error logging (Sentry, etc.)
- [ ] Document campaign creation process for team

---

## Quick Start Summary

1. **Create Tracking Link:**
   - Admin panel: `http://localhost:4200/admin/create-tracking-link`
   - Add survey ID if directing to specific survey

2. **Share Link:**
   - Copy: `http://localhost:3000/t/{shortCode}`
   - Share on social media, email, etc.

3. **Test Flow:**
   - Incognito → click link → signup → verify redirect

4. **Monitor:**
   - View analytics: `http://localhost:4200/admin/analytics`
   - Check conversion rates
   - Track user journey

---

**Status:** ✅ Implementation Complete
**Last Updated:** 2024-12-02
**Backend Status:** ✅ Updated with migration scripts
**Frontend Status:** ✅ All components implemented and tested

---

**You're all set!** 🎉

For questions or issues, refer to the [Troubleshooting](#troubleshooting) section or check browser console for detailed error messages.
