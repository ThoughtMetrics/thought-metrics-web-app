# Quick Cookie Consent Setup Guide

## ✅ What's Already Done

1. **Cookie Consent Banner Component** - Custom React component created
2. **Google Consent Mode v2** - Integrated with GTM
3. **Layout Updated** - Banner appears on all pages
4. **Cookiebot Removed** - No external dependencies

## 🔧 What You Need to Do Now

### 1. **Create Privacy Policy Page** (CRITICAL - Required by Law)

Create a file: `src/pages/privacy-policy.astro`

**Must include:**
- List of cookies used on your site
- Purpose of each cookie
- Third-party services (Google Analytics, etc.)
- How users can delete cookies
- User rights under GDPR/CCPA

**Example structure:**
```markdown
# Privacy Policy

## Cookies We Use

### Necessary Cookies
- `tm_cookie_consent` - Stores your cookie preferences (365 days)

### Analytics Cookies (Optional - Requires Consent)
- `_ga` - Google Analytics user ID (2 years)
- `_gid` - Google Analytics session (24 hours)

### How to Manage Cookies
You can change your cookie preferences at any time by clicking "Cookie Settings" in the footer.

### Your Rights
- Right to access your data
- Right to delete your data
- Right to opt-out of tracking
```

### 2. **Update Google Tag Manager**

**In GTM Dashboard:**
1. Go to your GTM container
2. For each tag (GA4, etc.):
   - Click "Advanced Settings" > "Consent Settings"
   - Check "Require additional consent for tag to fire"
   - Select: "Analytics Storage" = Required

This ensures tags only fire after user accepts cookies.

### 3. **Test the Implementation**

**Open your site in incognito mode:**

✅ Check:
- [ ] Cookie banner appears at bottom
- [ ] "Accept" button enables analytics
- [ ] "Decline" button blocks analytics
- [ ] Banner doesn't reappear after consent
- [ ] Privacy Policy link works

**Test Analytics:**
1. Open DevTools → Network tab
2. Filter by "google-analytics" or "collect"
3. Before accepting: No analytics requests
4. After accepting: Analytics requests appear

### 4. **Add Cookie Settings to Footer (Optional but Recommended)**

In your footer component, add:
```tsx
<button onClick={() => {
  localStorage.removeItem('tm_cookie_consent');
  window.location.reload();
}}>
  Cookie Settings
</button>
```

### 5. **Legal Review**

**Important:** This is a technical implementation. You should:
- Have a lawyer review your privacy policy
- Ensure compliance with GDPR (EU) and CCPA (California)
- Keep records of user consent (for audits)

## 🎨 Customization

### Change Banner Colors
Edit `src/shared/components/CookieConsentBanner.tsx`:
```tsx
// Line 133: Change primary button color
className="... bg-primary hover:bg-secondary ..."

// Line 127: Change decline button color
className="... bg-gray-100 hover:bg-gray-200 ..."
```

### Change Banner Position
```tsx
// Line 102: Change from bottom to top
className="fixed top-0 left-0 right-0 ..."
```

### Change Consent Expiry
```tsx
// Line 7: Change from 365 days to desired duration
const COOKIE_CONSENT_EXPIRY = 365; // Change this
```

## 🚀 Deploy Checklist

Before deploying to production:

- [ ] Privacy policy page created and linked
- [ ] GTM consent settings configured
- [ ] Tested in incognito mode
- [ ] Tested on mobile devices
- [ ] Analytics working after consent
- [ ] Legal team reviewed (if applicable)

## 📋 Quick Commands

**Start dev server:**
```bash
yarn dev
```

**Build for production:**
```bash
yarn build
```

**Preview production build:**
```bash
yarn preview
```

## 🆘 Troubleshooting

**Banner not showing:**
```bash
# Clear localStorage
localStorage.clear()
# Refresh page
```

**Analytics not working:**
- Check GTM preview mode
- Verify consent mode loads before GTM
- Check browser console for errors

**Need help?**
- See full guide: `COOKIE_CONSENT_IMPLEMENTATION.md`
- Check component: `src/shared/components/CookieConsentBanner.tsx`

---

**Status**: ✅ Technical implementation complete
**Next**: Create privacy policy page and test
