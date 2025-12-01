# Admin Authentication & Survey Flow - Implementation Summary

## ✅ What Was Fixed

### 1. **Admin Pages - Re-enabled with Debug Logging**

✅ **AdminRouteGuard re-enabled** for:
- `/admin/create-tracking-link`
- `/admin/analytics`

✅ **Added comprehensive debug logging** to track auth flow:
- `AdminRouteGuard.tsx` - Logs auth state, role checks, and access decisions
- `auth-provider.tsx` - Logs Firebase token claims and computed roles

### 2. **Survey Campaign Flow - Completely Restructured**

#### **Old Structure** ❌
- `/survey-campaign` → Showed survey form directly

#### **New Structure** ✅
- `/survey-campaign` → **Landing page** with "Register Now" button
- `/survey-campaign/[id]` → **Actual survey form** (e.g., `/survey-campaign/TM-ONBOARD-001`)

---

## 📂 Files Created/Modified

### **Created:**
1. `src/pages/survey-campaign/[id].astro` - Dynamic survey route
2. `src/shared/screens/survey-campaign/survey-form-wrapper.tsx` - Survey form with tracking check

### **Modified:**
1. `src/pages/admin/create-tracking-link.astro` - Re-enabled AdminRouteGuard
2. `src/pages/admin/analytics.astro` - Re-enabled AdminRouteGuard
3. `src/shared/components/guards/AdminRouteGuard.tsx` - Added debug logs
4. `src/shared/providers/auth-provider.tsx` - Added debug logs for Firebase claims
5. `src/shared/screens/survey-campaign/survey-campaign.tsx` - Converted to landing page
6. `src/shared/screens/survey-campaign/index.ts` - Added exports

---

## 🔍 How to Debug Admin Access Issue

### **Step 1: Open Browser Console**

When you visit `/admin/analytics` or `/admin/create-tracking-link`, open the browser console (F12).

### **Step 2: Check Auth Logs**

You should see logs like:

```
[AuthProvider] Firebase token claims: { ... }
[AuthProvider] Role details: { role: "super-admin", isAdmin: true, isSuperAdmin: true }
[AdminRouteGuard] Auth state: { isAuthReady: true, hasUser: true, isAdmin: true, isSuperAdmin: true, requireSuperAdmin: false }
[AdminRouteGuard] Access check: { requireSuperAdmin: false, isAdmin: true, isSuperAdmin: true, hasAccess: true }
[AdminRouteGuard] Access granted, rendering content
```

### **Step 3: Diagnose the Issue**

**If you see:**

#### **Scenario A: "Waiting for auth to be ready..."**
- **Problem:** `isAuthReady` is never becoming `true`
- **Fix:** Check if Firebase auth is initialized correctly
- **Check:** `auth` object in `src/core/configs/firebase-config.ts`

#### **Scenario B: "User not authenticated"**
- **Problem:** Firebase user is `null`
- **Fix:** Sign in again, clear cache, or check Firebase Auth status

#### **Scenario C: "User lacks required permissions"**
- **Problem:** `role` claim is missing or not "admin"/"super-admin"
- **Fix:** Set custom claim in Firebase (see below)

#### **Scenario D: Claims show `undefined` or wrong role**
- **Problem:** Custom claims not set in Firebase
- **Fix:** Use script or Firebase Console to set role (see below)

---

## 🔧 Setting Super-Admin Role in Firebase

If your user doesn't have the `super-admin` role set, use one of these methods:

### **Method 1: Via Firebase Admin SDK (Recommended)**

Create `D:\Projects\thought_metrics\thought-metrics-web-api\src\scripts\set-admin-role.ts`:

```typescript
import admin from 'firebase-admin';

async function setAdminRole(email: string) {
  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().setCustomUserClaims(user.uid, {
      role: 'super-admin'
    });

    console.log(`✅ Super-admin role set for ${email}`);
    console.log('⚠️  User must sign out and sign in again for changes to take effect');
  } catch (error) {
    console.error('Failed to set role:', error);
  }
}

// Replace with your email
setAdminRole('your-email@example.com');
```

Run it:
```bash
cd D:\Projects\thought_metrics\thought-metrics-web-api
npx ts-node src/scripts/set-admin-role.ts
```

### **Method 2: Via Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find your user
5. Click on user → **Custom claims**
6. Add: `{"role": "super-admin"}`

### **Method 3: Create API Endpoint**

Add to your API:

```typescript
// POST /api/v1/admin/users/:userId/set-role
// Body: { "role": "super-admin" }
router.post('/users/:userId/set-role', adminOnly, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  await admin.auth().setCustomUserClaims(userId, { role });

  res.json({ success: true, message: 'Role updated' });
});
```

**⚠️ IMPORTANT:** After setting the role, you MUST:
1. Sign out
2. Sign in again
3. Firebase will issue a new token with the updated claims

---

## 🎯 New Survey Flow

### **User Journey:**

#### **From Tracking Link:**

1. **User clicks tracking link** → `/t/ABC12345`
2. **Redirects to** → `/sign-up?tm_link_id=xxx&redirect_after=/survey-campaign`
3. **User signs up** → Creates account
4. **Auto-redirects to** → `/survey-campaign` (landing page)
5. **User clicks "Complete Your Profile"** → `/survey-campaign/TM-ONBOARD-001`
6. **User completes survey** → Submits responses
7. **Success screen** → "Start Taking Surveys" button
8. **Redirects to** → `/survey-boards`

#### **Direct Access (Without Tracking Link):**

⚠️ **IMPORTANT:** Both `/survey-campaign` and `/survey-campaign/[id]` are **RESTRICTED** to tracking link access only.

If someone tries to access these pages directly (without a tracking link):
- 🚫 **Redirected to home page** (`/`) immediately
- Console log shows: `[SurveyCampaign] Access denied - no tracking link detected`
- This applies to ALL users, including logged-in users

**Access Requirements:**
- ✅ Must have valid `tm_link_id` in URL parameters
- ✅ `window.ThoughtMetrics.isFromTrackingLink()` must return `true`
- ❌ Cannot access by typing URL directly
- ❌ Cannot bookmark and revisit (tracking params expire)

---

## 🧪 Testing

### **Test 1: Admin Pages**

```bash
# Open in browser (while logged in as super-admin)
http://localhost:4200/admin/analytics
http://localhost:4200/admin/create-tracking-link
```

**Expected:**
- Should load immediately (no "Verifying access..." stuck)
- Console shows debug logs with your role
- Page renders with data

**If stuck:**
- Check console logs
- Follow debug steps above
- Verify Firebase role is set

### **Test 2: Survey Landing Page**

```bash
http://localhost:4200/survey-campaign
```

**Expected:**
- Shows welcome message
- "Register Now" button (if not logged in)
- "Complete Your Profile" button (if logged in)
- Clicking button navigates appropriately

### **Test 3: Survey Form**

```bash
http://localhost:4200/survey-campaign/TM-ONBOARD-001
```

**Expected:**
- Shows onboarding survey with 8 questions
- Progress bar works
- Next/Previous navigation
- Submit button on last question
- Success screen after submission

### **Test 4: Complete Flow**

1. Create tracking link in admin panel
2. Copy link (e.g., `http://localhost:4200/t/ABC123`)
3. Open in incognito window
4. Click link → Should go to `/sign-up`
5. Register → Should redirect to `/survey-campaign`
6. Click "Complete Your Profile" → Should go to `/survey-campaign/TM-ONBOARD-001`
7. Complete survey → Should show success
8. Click "Start Taking Surveys" → Should go to `/survey-boards`

---

## 📝 Key Changes Summary

| Component | Before | After |
|-----------|--------|-------|
| `/survey-campaign` | Survey form | Landing page with CTA button |
| `/survey-campaign/[id]` | ❌ Didn't exist | ✅ Actual survey form |
| Admin pages | Guard commented out | Guard active with debug logs |
| Auth logging | Minimal | Comprehensive debug info |
| Survey access | No tracking check | ✅ **RESTRICTED** - Only via tracking link |

### **Access Restriction Implementation:**

Both survey pages now enforce tracking link requirements:

**survey-campaign.tsx:**
```typescript
useEffect(() => {
  if (window.ThoughtMetrics) {
    const isTracked = window.ThoughtMetrics.isFromTrackingLink();
    const utmParams = window.ThoughtMetrics.getUTMParams();

    // Deny access if not from tracking link
    if (!isTracked || !utmParams.tm_link_id) {
      console.log('[SurveyCampaign] Access denied - redirecting to home');
      window.location.href = '/';
      return;
    }
    setIsCheckingAccess(false);
  }
}, []);
```

**survey-form-wrapper.tsx:**
```typescript
useEffect(() => {
  if (window.ThoughtMetrics) {
    const isTracked = window.ThoughtMetrics.isFromTrackingLink();

    // Deny access if not from tracking link
    if (!isTracked || !utmParams.tm_link_id) {
      console.log('[SurveyForm] Access denied - redirecting to home');
      window.location.href = '/';
      return;
    }
    setIsCheckingAccess(false);
  }
}, [surveyId]);
```

---

## 🐛 Troubleshooting

### **Problem: "Verifying access..." Stuck**

**Solution:**
1. Open browser console
2. Look for `[AuthProvider]` and `[AdminRouteGuard]` logs
3. Check what value `isAuthReady`, `isAdmin`, `isSuperAdmin` have
4. If `role` is undefined, set it in Firebase (see above)
5. Sign out and sign in again after setting role

### **Problem: Admin pages show "Unauthorized"**

**Solution:**
1. Your `role` claim is not "admin" or "super-admin"
2. Set the role using one of the methods above
3. Clear browser cache
4. Sign out and sign in

### **Problem: Survey form doesn't load**

**Solution:**
1. Check if onboarding survey is seeded: `GET /api/v1/surveys/TM-ONBOARD-001`
2. Run seed script: `npx ts-node src/scripts/seed-onboarding-survey.ts`
3. Check API is running on port 3000

### **Problem: "Register Now" button doesn't work**

**Solution:**
1. Check browser console for errors
2. Verify `/sign-up` route exists
3. Check if button click handler is working

### **Problem: Redirected to home when accessing survey pages**

**Solution:**
This is expected behavior if you're not coming from a tracking link!

1. Survey pages (`/survey-campaign` and `/survey-campaign/[id]`) are restricted
2. You MUST access them via a tracking link (e.g., `/t/ABC123`)
3. Check console for: `[SurveyCampaign] Access denied - no tracking link detected`
4. To test: Create a tracking link in admin panel and use that link

**If you need to test without tracking link:**
Temporarily modify the code to bypass the check (for development only):
```typescript
// In survey-campaign.tsx and survey-form-wrapper.tsx
// Comment out the access check (DEVELOPMENT ONLY!)
// if (!isTracked || !utmParams.tm_link_id) {
//   window.location.href = '/';
//   return;
// }
```

---

## ✅ Next Steps

1. **Check console logs** when visiting admin pages
2. **Set super-admin role** if not already set
3. **Sign out and sign in** after setting role
4. **Test complete flow** from tracking link to survey completion
5. **Monitor analytics** in admin dashboard

---

## 📞 Support

If still stuck:
1. Share console logs from `[AuthProvider]` and `[AdminRouteGuard]`
2. Check Firebase console for your user's custom claims
3. Verify API endpoints are accessible
4. Test with a fresh incognito window

All debug logs are now in place to help identify exactly where the auth flow is failing! 🎉
