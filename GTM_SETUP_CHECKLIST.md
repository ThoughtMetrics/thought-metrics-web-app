# GTM Consent Mode Setup - Quick Checklist

## 🎯 Goal
Configure Google Tag Manager to respect cookie consent and only fire tracking after user accepts.

---

## ✅ Pre-Setup (Already Complete)

- [x] Cookie consent banner implemented
- [x] Google Consent Mode v2 script added
- [x] Privacy policy updated with cookie information
- [x] ConsentMode.astro loads before GTM

---

## 📋 Step-by-Step Checklist

### 1️⃣ Access GTM
- [ ] Go to https://tagmanager.google.com
- [ ] Login with your Google account
- [ ] Select your GTM container (GTM-XXXXXXX)

### 2️⃣ Find Your Tags
- [ ] Click **"Tags"** in left sidebar
- [ ] List all your tags:
  - [ ] Google Analytics 4 (GA4)
  - [ ] Google Ads (if any)
  - [ ] Microsoft Clarity (if any)
  - [ ] Custom tracking tags (if any)

### 3️⃣ Configure GA4 Tag (MOST IMPORTANT)

**For each GA4 tag:**
- [ ] Click on the GA4 tag name
- [ ] Scroll down to **"Advanced Settings"**
- [ ] Click to expand **"Consent Settings"**
- [ ] Check: ☑️ **"Require additional consent for tag to fire"**
- [ ] In the consent types section, check: ☑️ **"Analytics Storage"**
- [ ] Click **"Save"** button

**Visual Guide:**
```
Tag Configuration
├── Tag Setup (leave as is)
├── Triggering (leave as is)
└── Advanced Settings (expand this) ⬇️
    └── Consent Settings (expand this) ⬇️
        ☑️ Require additional consent for tag to fire
        Consent types required:
        ☑️ Analytics Storage
        ☐ Ad Storage
        ☐ Functionality Storage
        ☐ Personalization Storage
```

### 4️⃣ Configure Google Ads Tags (If Applicable)

**For each Google Ads tag:**
- [ ] Click on the tag
- [ ] Expand **"Advanced Settings" > "Consent Settings"**
- [ ] Check: ☑️ **"Require additional consent for tag to fire"**
- [ ] Check: ☑️ **"Ad Storage"**
- [ ] Check: ☑️ **"Analytics Storage"** (if tracking conversions)
- [ ] Click **"Save"**

### 5️⃣ Configure Other Tracking Tags

**For Microsoft Clarity, Hotjar, etc.:**
- [ ] Click on each custom tracking tag
- [ ] Expand **"Advanced Settings" > "Consent Settings"**
- [ ] Check: ☑️ **"Require additional consent for tag to fire"**
- [ ] Check: ☑️ **"Analytics Storage"**
- [ ] Click **"Save"**

### 6️⃣ Test in Preview Mode

**Start Preview:**
- [ ] Click **"Preview"** button (top right in GTM)
- [ ] Enter your website URL: `http://localhost:4200` (or your live URL)
- [ ] Click **"Connect"**
- [ ] New window opens with debug panel at bottom

**Test 1: Before Consent**
- [ ] Open browser console: F12 → Console tab
- [ ] Clear storage:
  ```javascript
  localStorage.clear();
  location.reload();
  ```
- [ ] Cookie banner appears ✅
- [ ] In GTM Debug panel:
  - [ ] GA4 tag shows "Not Fired" ✅
  - [ ] Other tracking tags show "Not Fired" ✅
- [ ] In Network tab (F12 → Network):
  - [ ] No requests to `google-analytics.com` ✅

**Test 2: After Accepting**
- [ ] Click **"Accept"** button on banner
- [ ] In GTM Debug panel:
  - [ ] `cookie_consent_update` event appears ✅
  - [ ] GA4 tag shows "Fired" ✅
  - [ ] Other tags show "Fired" ✅
- [ ] In Network tab:
  - [ ] Requests to `google-analytics.com/collect` appear ✅
  - [ ] Cookies `_ga` and `_gid` are set ✅

**Test 3: After Declining**
- [ ] Clear storage again (console):
  ```javascript
  localStorage.clear();
  location.reload();
  ```
- [ ] Click **"Decline"** button
- [ ] In GTM Debug panel:
  - [ ] GA4 tag shows "Not Fired" ✅
  - [ ] Other tracking tags show "Not Fired" ✅

**Test 4: Persistence**
- [ ] After accepting, refresh page
- [ ] Banner doesn't appear ✅
- [ ] GA4 fires automatically ✅

### 7️⃣ Verify in Google Analytics

- [ ] Go to your GA4 property: https://analytics.google.com
- [ ] Click **"Reports" > "Realtime"**
- [ ] Open your website (with consent accepted)
- [ ] Within 30 seconds:
  - [ ] Active users count increases ✅
  - [ ] Your page view appears ✅

### 8️⃣ Publish GTM Changes

**Before publishing, verify:**
- [ ] All tags have consent settings enabled
- [ ] Tested accept scenario ✅
- [ ] Tested decline scenario ✅
- [ ] Tested on mobile device ✅
- [ ] GA4 real-time working ✅

**Publish:**
- [ ] Click **"Submit"** (top right in GTM)
- [ ] Version Name: `Consent Mode v2 - Cookie Compliance`
- [ ] Version Description:
  ```
  Added consent requirements to all tracking tags:
  - GA4: Requires analytics_storage
  - Google Ads: Requires ad_storage
  - Other tracking: Requires analytics_storage
  Tested and verified working correctly.
  ```
- [ ] Click **"Publish"**

### 9️⃣ Post-Launch Verification

**Immediately after publishing:**
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Visit site in incognito mode
- [ ] Verify banner appears
- [ ] Test accept flow again
- [ ] Check GA4 real-time reports

**Within 24 hours:**
- [ ] Monitor GA4 for traffic patterns
- [ ] Check for any unusual drops
- [ ] Verify consent rate is reasonable (typically 60-80%)

### 🔟 Documentation

- [ ] Take screenshot of GTM consent settings
- [ ] Note GTM container version number
- [ ] Record date of implementation
- [ ] Save this checklist as evidence of compliance

---

## 🚨 Common Mistakes to Avoid

❌ **Mistake 1**: Not enabling consent settings on ALL tags
✅ **Solution**: Review every tag, even custom ones

❌ **Mistake 2**: Publishing without testing
✅ **Solution**: Always use Preview mode first

❌ **Mistake 3**: Wrong consent type selected
✅ **Solution**: Analytics = `analytics_storage`, Ads = `ad_storage`

❌ **Mistake 4**: ConsentMode loads AFTER GTM
✅ **Solution**: Already fixed in Layout.astro ✅

❌ **Mistake 5**: Not checking GA4 after publishing
✅ **Solution**: Monitor real-time reports immediately

---

## 📱 Quick Test Commands

**Open browser console (F12) and run:**

```javascript
// 1. Check if consent banner is working
localStorage.getItem('tm_cookie_consent')
// Should return null (no consent) or JSON object

// 2. Check dataLayer
console.log(window.dataLayer)
// Should show array of events

// 3. Check consent status
console.log(window.dataLayer.filter(e => e[0] === 'consent'))
// Shows consent commands

// 4. Manually test consent grant (for debugging)
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'ad_storage': 'granted'
});

// 5. Trigger consent event manually
dataLayer.push({
  event: 'cookie_consent_update',
  cookie_consent: 'granted'
});
```

---

## 🎓 Key Concepts

### What is Consent Mode?
- Framework that controls when tracking scripts run
- Default = denied (privacy-first)
- Updates to granted when user accepts

### Why is This Important?
- **Legal Compliance**: GDPR, DPDP Act, CCPA
- **User Privacy**: Respect user choices
- **Trust Building**: Transparent data practices

### What Happens If I Don't Do This?
- ❌ Violates GDPR/privacy laws
- ❌ Potential fines up to €20M or 4% of revenue
- ❌ Loss of user trust
- ❌ Tracking works but may be illegal

---

## 📞 Need Help?

### GTM Not Loading?
**Check:** Is ad blocker enabled? (Disable for testing)

### Tags Still Fire Before Consent?
**Check:** ConsentMode.astro in correct position in Layout.astro

### Preview Mode Not Working?
**Try:** Incognito mode, different browser, disable extensions

### Consent Banner Not Appearing?
**Check:** Console for JavaScript errors, verify component loaded

---

## ✨ Success Criteria

You're done when:
- ✅ Cookie banner appears on first visit
- ✅ NO tracking before consent
- ✅ Tracking STARTS after consent
- ✅ Consent persists across pages
- ✅ GA4 shows data after consent
- ✅ GTM published successfully

---

## 📄 Files Modified

- ✅ `src/shared/components/CookieConsentBanner.tsx` - Banner component
- ✅ `src/shared/components/analytics/ConsentMode.astro` - Consent init
- ✅ `src/layouts/Layout.astro` - Layout integration
- ✅ `src/core/constants/page-constants/privacy-policy-constant.ts` - Privacy policy

---

## ⏱️ Estimated Time

- **GTM Configuration**: 15-20 minutes
- **Testing**: 15 minutes
- **Publishing**: 2 minutes
- **Post-launch monitoring**: 30 minutes
- **Total**: ~1 hour

---

## 🎉 Completion

When all checkboxes are marked:
1. Take a screenshot of this checklist
2. Save in project documentation
3. Notify team that consent mode is live
4. Monitor analytics for next 24-48 hours

**Date Completed**: _______________
**Completed By**: _______________
**GTM Version**: _______________

---

**Last Updated**: 2025-12-08
