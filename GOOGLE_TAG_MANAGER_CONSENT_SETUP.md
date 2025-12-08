# Google Tag Manager Consent Mode Setup Guide

## Overview

This guide explains how to configure Google Tag Manager (GTM) to respect cookie consent and only fire tags after users accept cookies.

## Prerequisites

- Access to Google Tag Manager account
- GTM container ID configured in your website
- Cookie consent banner implemented (already done ✅)

---

## Part 1: Understanding Consent Mode

### What is Google Consent Mode v2?

Google Consent Mode v2 is a framework that allows your website to adjust how Google tags behave based on user consent. It has two modes:

1. **Default State (Denied)**: Before user consent, all tracking is blocked
2. **Granted State**: After user accepts, tracking is enabled

### Consent Types

| Consent Type | Purpose | Examples |
|-------------|---------|----------|
| `analytics_storage` | Google Analytics cookies | `_ga`, `_gid` |
| `ad_storage` | Advertising cookies | `_gcl_*`, remarketing |
| `functionality_storage` | Functional cookies | User preferences |
| `personalization_storage` | Personalization cookies | Recommendations |
| `security_storage` | Security cookies (always granted) | Fraud prevention |

---

## Part 2: GTM Container Setup

### Step 1: Access Your GTM Container

1. Go to https://tagmanager.google.com
2. Select your account and container
3. You should see your GTM container ID (e.g., `GTM-XXXXXXX`)

### Step 2: Verify Current Tags

1. In GTM, click **"Tags"** in the left sidebar
2. Review all tags currently configured:
   - Google Analytics 4 (GA4)
   - Google Ads Conversion Tracking
   - Microsoft Clarity
   - Any other tracking tags

---

## Part 3: Configure Consent Settings for Each Tag

### For Google Analytics 4 (GA4) Tag

1. **Open GA4 Tag**:
   - Click on your GA4 Configuration tag

2. **Add Consent Requirements**:
   - Scroll to **"Advanced Settings"**
   - Expand **"Consent Settings"**
   - Check: ☑️ **"Require additional consent for tag to fire"**

3. **Select Required Consent**:
   - Check: ☑️ **Analytics Storage**
   - This ensures GA4 only fires when user accepts analytics cookies

4. **Save the tag**

### For Google Ads Tags

1. **Open Google Ads Tag**:
   - Click on your Google Ads Conversion Tracking tag

2. **Add Consent Requirements**:
   - Expand **"Advanced Settings" > "Consent Settings"**
   - Check: ☑️ **"Require additional consent for tag to fire"**

3. **Select Required Consent**:
   - Check: ☑️ **Ad Storage**
   - Check: ☑️ **Analytics Storage** (if applicable)

4. **Save the tag**

### For Microsoft Clarity (or Similar Tools)

1. **Open Custom HTML Tag**:
   - Find your Clarity or similar tracking tag

2. **Add Consent Requirements**:
   - Expand **"Advanced Settings" > "Consent Settings"**
   - Check: ☑️ **"Require additional consent for tag to fire"**

3. **Select Required Consent**:
   - Check: ☑️ **Analytics Storage**

4. **Save the tag**

### For Custom Tracking Tags

For any custom tags you've created:

1. Open the tag
2. Go to **"Advanced Settings" > "Consent Settings"**
3. Enable consent requirement
4. Select appropriate consent type:
   - **Analytics** → `analytics_storage`
   - **Marketing/Ads** → `ad_storage`
   - **Functional** → `functionality_storage`

---

## Part 4: Create Consent Update Trigger (Optional but Recommended)

### Why Create This Trigger?

This trigger fires whenever user consent changes, allowing you to track consent events.

### Steps:

1. **Create New Trigger**:
   - Click **"Triggers"** in left sidebar
   - Click **"New"**
   - Name it: `Consent Update - Analytics Granted`

2. **Configure Trigger**:
   - Trigger Type: **Custom Event**
   - Event name: `cookie_consent_update`

3. **Add Condition** (Optional):
   - This trigger fires on: **Some Custom Events**
   - Condition: `cookie_consent` equals `granted`

4. **Save Trigger**

### Use This Trigger:

Attach this trigger to tags that should fire immediately after consent is granted.

---

## Part 5: Testing Your Setup

### Enable GTM Preview Mode

1. In GTM, click **"Preview"** button (top right)
2. Enter your website URL
3. Click **"Connect"**
4. A new window opens with GTM Debug panel at bottom

### Test Scenario 1: Before Consent

1. **Clear cookies and localStorage**:
   ```javascript
   // In browser console
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

2. **Refresh page**
3. **In GTM Debug panel, check**:
   - ❌ GA4 tag should NOT fire
   - ❌ Google Ads tag should NOT fire
   - ❌ Other tracking tags should NOT fire
   - ✅ Only tags without consent requirements should fire

4. **In Network tab**:
   - ❌ No requests to `google-analytics.com/collect`
   - ❌ No requests to `googleadservices.com`

### Test Scenario 2: After Accepting Consent

1. **Click "Accept" on cookie banner**
2. **In GTM Debug panel, check**:
   - ✅ `cookie_consent_update` event fires
   - ✅ GA4 tag fires
   - ✅ Google Ads tag fires (if applicable)
   - ✅ Other tracking tags fire

3. **In Network tab**:
   - ✅ Requests to `google-analytics.com/collect` appear
   - ✅ Analytics cookies (`_ga`, `_gid`) are set

### Test Scenario 3: After Declining Consent

1. **Clear cookies and localStorage again**
2. **Refresh page**
3. **Click "Decline" on cookie banner**
4. **In GTM Debug panel, check**:
   - ❌ GA4 tag should NOT fire
   - ❌ Tracking tags should NOT fire
   - ✅ Only necessary tags fire

### Test Scenario 4: Consent Persistence

1. **Accept consent**
2. **Refresh page**
3. **Check**:
   - ✅ Banner doesn't appear (consent remembered)
   - ✅ Analytics fires automatically
   - ✅ Tracking works as expected

---

## Part 6: Verify Consent Mode in Google Analytics

### Check in GA4 Real-Time Report

1. Go to your **Google Analytics 4 property**
2. Click **"Reports" > "Realtime"**
3. Open your website with consent accepted
4. Within 30 seconds, you should see:
   - ✅ Active users count increases
   - ✅ Page views tracked
   - ✅ Events recorded

### Check Consent Signals

1. In GA4, go to **"Admin"**
2. Under **"Data collection and modification"**, click **"Data streams"**
3. Click your web data stream
4. Scroll to **"Consent mode"**
5. Verify status shows: **"Active"**

---

## Part 7: Common Issues and Solutions

### Issue 1: Tags Fire Before Consent

**Symptoms**: GA4 fires immediately on page load

**Solution**:
1. Check that ConsentMode.astro loads BEFORE GTM
2. Verify consent settings enabled on tag
3. Clear GTM preview cache and retry

### Issue 2: Tags Don't Fire After Consent

**Symptoms**: Accepting cookies doesn't trigger tags

**Solution**:
1. Check browser console for JavaScript errors
2. Verify `window.dataLayer` exists
3. Check that `gtag('consent', 'update', ...)` is called
4. Test with `dataLayer.push()` manually:
   ```javascript
   dataLayer.push({
     event: 'cookie_consent_update',
     cookie_consent: 'granted'
   });
   ```

### Issue 3: Consent Not Persisting

**Symptoms**: Banner appears on every page

**Solution**:
1. Check localStorage quota (shouldn't be issue)
2. Verify `tm_cookie_consent` key in localStorage
3. Check for code clearing localStorage

### Issue 4: GTM Preview Not Working

**Solution**:
1. Disable ad blockers (they block GTM preview)
2. Clear browser cache
3. Use incognito/private mode
4. Check browser console for errors

---

## Part 8: Advanced Configuration (Optional)

### Create Consent Variables

For more advanced tracking of consent choices:

1. **Create Data Layer Variable**:
   - Variables > New > Data Layer Variable
   - Name: `DLV - Cookie Consent Status`
   - Data Layer Variable Name: `cookie_consent`

2. **Use in Triggers**:
   - Create triggers based on consent status
   - Example: Fire remarketing only if `cookie_consent` = `granted`

### Track Consent Changes

Create a GA4 event to track when users accept/decline:

1. **Create GA4 Event Tag**:
   - Tag Type: Google Analytics: GA4 Event
   - Event Name: `cookie_consent_action`
   - Event Parameters:
     - `consent_status`: `{{DLV - Cookie Consent Status}}`

2. **Trigger**: Cookie Consent Update

### Granular Consent (Future Enhancement)

If you want separate consent for Analytics vs Marketing:

```javascript
// In CookieConsentBanner.tsx
gtag('consent', 'update', {
  'analytics_storage': analyticsConsent ? 'granted' : 'denied',
  'ad_storage': marketingConsent ? 'granted' : 'denied',
});
```

---

## Part 9: Publish Your Changes

### Before Publishing

✅ **Pre-publish Checklist**:
- [ ] All tracking tags have consent settings enabled
- [ ] Tested in Preview mode (accept scenario)
- [ ] Tested in Preview mode (decline scenario)
- [ ] Verified no tags fire before consent
- [ ] Verified tags fire after consent
- [ ] Checked GA4 real-time reports
- [ ] Tested on mobile device
- [ ] Reviewed all triggers

### Publishing Steps

1. In GTM, click **"Submit"** (top right)
2. Add **Version Name**: `Added Consent Mode v2 Requirements`
3. Add **Version Description**:
   ```
   - Enabled consent requirements for all tracking tags
   - GA4: Requires analytics_storage
   - Google Ads: Requires ad_storage
   - Clarity: Requires analytics_storage
   - Tested and verified working correctly
   ```
4. Click **"Publish"**

### After Publishing

1. **Clear your browser cache**
2. **Visit your website in incognito mode**
3. **Repeat all tests from Part 5**
4. **Monitor GA4 for the next 24 hours**:
   - Check for any drop in traffic (shouldn't happen if done correctly)
   - Verify consent rate in custom reports

---

## Part 10: Monitoring and Compliance

### Track Consent Acceptance Rate

Create a custom report in GA4:

1. Go to **"Explore"** in GA4
2. Create new exploration
3. Add dimensions: `Event name`
4. Add metrics: `Event count`
5. Filter: `event_name` = `cookie_consent_update`
6. Break down by `consent_status` parameter

### Monthly Audit Checklist

- [ ] Review GTM tags for consent settings
- [ ] Check for new tags without consent requirements
- [ ] Verify consent banner still appears for new users
- [ ] Test consent flow in multiple browsers
- [ ] Review privacy policy for accuracy
- [ ] Check for new cookie types being set

### Compliance Documentation

Keep records of:
1. When consent mode was implemented
2. GTM container version with consent settings
3. Testing results and screenshots
4. Privacy policy version with cookie information
5. Any consent-related user complaints

---

## Quick Reference Card

### GTM Tag Consent Requirements

| Tag Type | Required Consent | Setting Location |
|----------|-----------------|------------------|
| GA4 Configuration | `analytics_storage` | Advanced Settings > Consent Settings |
| GA4 Event | `analytics_storage` | Advanced Settings > Consent Settings |
| Google Ads Conversion | `ad_storage` | Advanced Settings > Consent Settings |
| Google Ads Remarketing | `ad_storage` + `ad_user_data` | Advanced Settings > Consent Settings |
| Clarity/Hotjar | `analytics_storage` | Advanced Settings > Consent Settings |
| Facebook Pixel | `ad_storage` | Advanced Settings > Consent Settings |

### Testing Commands

```javascript
// Check dataLayer
console.log(window.dataLayer);

// Check consent status
console.log(localStorage.getItem('tm_cookie_consent'));

// Manually grant consent (for testing)
gtag('consent', 'update', {
  'analytics_storage': 'granted',
  'ad_storage': 'granted'
});

// Manually trigger consent event
dataLayer.push({
  event: 'cookie_consent_update',
  cookie_consent: 'granted'
});
```

---

## Support Resources

- **Google Tag Manager Help**: https://support.google.com/tagmanager
- **Consent Mode Guide**: https://support.google.com/tagmanager/answer/10718549
- **GA4 Consent Settings**: https://support.google.com/analytics/answer/9976101
- **Testing Consent Mode**: https://developers.google.com/tag-platform/security/guides/consent

---

## Summary

### What You've Accomplished

✅ Cookie consent banner implemented
✅ Google Consent Mode v2 configured
✅ Privacy policy updated with cookie information
✅ GTM tags configured with consent requirements
✅ Testing procedures documented
✅ Compliance requirements met

### Next Actions Required

1. [ ] Configure consent settings for each GTM tag (15-30 minutes)
2. [ ] Test thoroughly in GTM Preview mode (15 minutes)
3. [ ] Publish GTM container (2 minutes)
4. [ ] Monitor GA4 for 24 hours after launch
5. [ ] Document completion date for compliance records

---

**Last Updated**: 2025-12-08
**Version**: 1.0.0
