# SEO & Analytics Implementation Guide

## ✅ What Has Been Implemented

### 1. **Analytics Components Created**
- ✅ `src/shared/components/analytics/GoogleTagManager.astro`
- ✅ `src/shared/components/analytics/MicrosoftClarity.astro`
- ✅ `src/shared/components/analytics/Cookiebot.astro`

### 2. **SEO Utilities Created**
- ✅ `src/core/utils/seo.utils.ts` - Comprehensive SEO helpers

### 3. **Payment Integration Created**
- ✅ `src/core/utils/razorpay.utils.ts` - Complete Razorpay integration

---

## 📋 Step-by-Step Implementation

### STEP 1: Update Environment Variables

Add these to your `.env` file:

```env
# ==============================================
# Analytics & Tracking
# ==============================================

# Microsoft Clarity (FREE - Sign up at https://clarity.microsoft.com)
PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id

# Cookiebot (Sign up at https://www.cookiebot.com)
PUBLIC_COOKIEBOT_ID=your_cookiebot_id

# ==============================================
# Payment Gateway (IF NEEDED)
# ==============================================

# Razorpay (Sign up at https://dashboard.razorpay.com)
PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx

# BACKEND ONLY - DO NOT expose to frontend
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### STEP 2: Update RuntimeConfig.astro

**File:** `src/shared/components/RuntimeConfig.astro`

Replace the `runtimeConfig` object (around line 13-30) with:

```typescript
const runtimeConfig = {
  // API Configuration
  PUBLIC_STRAPI_API_URL: getEnv('PUBLIC_STRAPI_API_URL'),
  PUBLIC_BASE_URL: getEnv('PUBLIC_BASE_URL'),
  PUBLIC_BASE_API_VERSION: getEnv('PUBLIC_BASE_API_VERSION'),
  PUBLIC_SITE_URL: getEnv('PUBLIC_SITE_URL'),

  // Firebase Config
  PUBLIC_FIREBASE_API_KEY: getEnv('PUBLIC_FIREBASE_API_KEY'),
  PUBLIC_FIREBASE_AUTH_DOMAIN: getEnv('PUBLIC_FIREBASE_AUTH_DOMAIN'),
  PUBLIC_FIREBASE_PROJECT_ID: getEnv('PUBLIC_FIREBASE_PROJECT_ID'),
  PUBLIC_FIREBASE_STORAGE_BUCKET: getEnv('PUBLIC_FIREBASE_STORAGE_BUCKET'),
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID: getEnv('PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  PUBLIC_FIREBASE_APP_ID: getEnv('PUBLIC_FIREBASE_APP_ID'),

  // Analytics & Tracking
  PUBLIC_MEASUREMENT_ID: getEnv('PUBLIC_MEASUREMENT_ID'),
  PUBLIC_GTM_ID: getEnv('PUBLIC_GTM_ID'),
  PUBLIC_GOOGLE_SITE_VERIFICATION: getEnv('PUBLIC_GOOGLE_SITE_VERIFICATION'),
  PUBLIC_CLARITY_PROJECT_ID: getEnv('PUBLIC_CLARITY_PROJECT_ID'),
  PUBLIC_COOKIEBOT_ID: getEnv('PUBLIC_COOKIEBOT_ID'),

  // Payment Gateway
  PUBLIC_RAZORPAY_KEY_ID: getEnv('PUBLIC_RAZORPAY_KEY_ID'),
};
```

### STEP 3: Update Layout.astro

**File:** `src/layouts/Layout.astro`

#### 3a. Add imports at the top (after line 9):
```astro
import GoogleTagManager from '@/shared/components/analytics/GoogleTagManager.astro';
import MicrosoftClarity from '@/shared/components/analytics/MicrosoftClarity.astro';
import Cookiebot from '@/shared/components/analytics/Cookiebot.astro';
```

#### 3b. Add Cookiebot in `<head>` (after RuntimeConfig, around line 38):
```astro
<!-- CRITICAL: RuntimeConfig must be first to prevent hydration errors -->
<RuntimeConfig />

<!-- Cookie Consent (Must load before other tracking scripts) -->
<Cookiebot />
```

#### 3c. Add GTM and Clarity before closing `</head>` (around line 80, after SEOHead):
```astro
<!-- SEO Meta Tags (Following PRO India SEO Guidelines) -->
<SEOHead
  title={title}
  description={description}
  keywords={keywords}
  ogImage={ogImage}
  ogType={ogType}
  canonical={canonical}
  noindex={noindex}
  nofollow={nofollow}
/>

<!-- Analytics & Tracking -->
<GoogleTagManager />
<MicrosoftClarity />
```

#### 3d. Add GTM noscript in `<body>` (right after opening `<body>` tag, around line 152):
```astro
<body id="root">
  <!-- Google Tag Manager (noscript fallback) -->
  <noscript>
    <iframe
      src={`https://www.googletagmanager.com/ns.html?id=${import.meta.env.PUBLIC_GTM_ID}`}
      height="0"
      width="0"
      style="display:none;visibility:hidden"
    ></iframe>
  </noscript>

  <!-- Page Loader -->
  <div id="page-loader">
```

---

## 🔧 How Each Tool Works

### 1. **Google Tag Manager (GTM)**

**Purpose:** Central hub for managing ALL tracking tags

**How It Works:**
```
Your Website
    ↓
GTM Container Loads
    ↓
GTM Dashboard (online)
    ├── Google Analytics 4
    ├── Microsoft Clarity
    ├── Pinterest Tag
    └── Any other tracking scripts
```

**Setup Steps:**
1. Go to https://tagmanager.google.com
2. Create a new container for your website
3. Get GTM ID (format: `GTM-XXXXXXX`)
4. Already in your `.env`: `PUBLIC_GTM_ID=GTM-TCGQWXKM`
5. **In GTM Dashboard:**
   - Add GA4 Tag: Tags → New → Google Analytics: GA4 Configuration
   - Measurement ID: Use your `PUBLIC_MEASUREMENT_ID`
   - Trigger: All Pages
   - Save & Publish

**Benefits:**
- Add/remove tracking without code changes
- Better performance (async loading)
- Single source of truth

---

### 2. **Google Analytics 4 (GA4)**

**Purpose:** Track website traffic, user behavior, conversions

**How It Works:**
```
User visits page
    ↓
GTM loads GA4 script
    ↓
GA4 tracks:
    - Page views
    - Events (clicks, scrolls, form submissions)
    - User demographics
    - Traffic sources
    - Conversions
    ↓
Data appears in GA4 Dashboard
```

**Setup Steps:**
1. Go to https://analytics.google.com
2. Create a GA4 property
3. Get Measurement ID (format: `G-XXXXXXXXXX`)
4. Already in your `.env`: `PUBLIC_MEASUREMENT_ID=G-4FBZCSRFDY`
5. Add to GTM (see GTM setup above)

**Best Practices:**
- Set up goals for conversions (form submissions, purchases)
- Enable enhanced measurement (scrolls, outbound clicks)
- Link to Search Console for SEO data
- Review weekly: Traffic sources, top pages, user flow

---

### 3. **Microsoft Clarity** (FREE!)

**Purpose:** Session recordings + heatmaps to understand user behavior

**How It Works:**
```
User interacts with site
    ↓
Clarity records:
    - Mouse movements
    - Clicks (including rage clicks)
    - Scrolling behavior
    - Form interactions
    ↓
Watch recordings in Clarity Dashboard
```

**What You Get:**
- **Session Recordings:** Watch exactly how users navigate
- **Heatmaps:** See where users click most
- **Rage Clicks:** Identify frustration points (user clicks same spot repeatedly)
- **Dead Clicks:** Find broken UI elements
- **Quick Back:** Pages that make users leave immediately

**Setup Steps:**
1. Sign up at https://clarity.microsoft.com (FREE, no credit card)
2. Add your website URL
3. Get Project ID (alphanumeric string)
4. Add to `.env`:
   ```env
   PUBLIC_CLARITY_PROJECT_ID=your_project_id
   ```
5. Component will auto-load (already created)

**Best Practices:**
- Watch 10-20 sessions weekly
- Filter by:
  - Device type (mobile vs desktop)
  - Country
  - Rage clicks (find problems)
- Use insights to improve UX

**GDPR Compliant:** Clarity doesn't collect PII (personally identifiable info)

---

### 4. **Cookiebot**

**Purpose:** Legal compliance for cookie consent (GDPR, CCPA)

**How It Works:**
```
User visits site
    ↓
Cookiebot loads FIRST (blocks other scripts)
    ↓
Shows consent banner:
    - Necessary (always allowed)
    - Preferences (optional)
    - Statistics (GA4, Clarity) ← User chooses
    - Marketing (Ads, Pinterest) ← User chooses
    ↓
User accepts/declines
    ↓
Cookiebot tells GTM which scripts to load
    ↓
Only approved scripts run
```

**Setup Steps:**
1. Sign up at https://www.cookiebot.com
2. Add your domain
3. Scan your website (Cookiebot will auto-detect cookies)
4. Get Domain Group ID (cbid)
5. Add to `.env`:
   ```env
   PUBLIC_COOKIEBOT_ID=your_cbid
   ```
6. Component will auto-load (already created)

**Configure in Dashboard:**
- Statistics category: GA4, Clarity, Hotjar
- Marketing category: Pinterest Tag, Facebook Pixel
- Customize banner text and colors
- Generate privacy policy

**Legal Coverage:**
- GDPR (EU)
- CCPA (California)
- ePrivacy Directive
- LGPD (Brazil)

**Testing:**
- Always test in incognito/private mode
- Verify scripts don't load without consent
- Check consent persists across pages

---

### 5. **Razorpay** (Indian Payment Gateway)

**Purpose:** Accept payments in India (UPI, Cards, Netbanking, Wallets)

**How It Works:**
```
User clicks "Pay Now"
    ↓
Razorpay Checkout Modal Opens
    ↓
User selects payment method:
    - UPI (Google Pay, PhonePe, Paytm)
    - Credit/Debit Cards
    - Netbanking
    - Wallets (Paytm, MobiKwik)
    ↓
Payment processed securely by Razorpay
    ↓
Webhook notifies your backend
    ↓
You verify payment signature
    ↓
Fulfill order
```

**Setup Steps:**
1. Sign up at https://dashboard.razorpay.com
2. Complete KYC verification
3. Get API Keys:
   - **Key ID** (public - for frontend)
   - **Key Secret** (private - for backend ONLY)
4. Add to `.env`:
   ```env
   PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxx  # Backend only!
   ```

**Usage in React Component:**

```tsx
import { useRazorpayCheckout, convertToPaise, formatAmount } from '@utils/razorpay.utils';

function CheckoutButton() {
  const { openCheckout, isLoading } = useRazorpayCheckout();

  const handlePayment = async () => {
    try {
      await openCheckout({
        amount: convertToPaise(500), // ₹500 → 50000 paise
        currency: 'INR',
        name: 'Premium Subscription',
        description: 'Monthly subscription',
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9999999999'
        },
        onSuccess: async (response) => {
          // Payment successful!
          console.log('Payment ID:', response.razorpay_payment_id);

          // IMPORTANT: Verify signature on backend
          const verified = await fetch('/api/verify-payment', {
            method: 'POST',
            body: JSON.stringify(response)
          });

          if (verified.ok) {
            // Fulfill order
            alert('Payment successful!');
          }
        },
        onFailure: (error) => {
          console.error('Payment failed:', error);
          alert('Payment failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <button onClick={handlePayment} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Pay ₹500'}
    </button>
  );
}
```

**Backend Verification (CRITICAL):**

```typescript
// Backend API route: /api/verify-payment
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  // Verify signature
  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // ✅ Payment verified! Fulfill order
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } else {
    // ❌ Signature mismatch! Fraud attempt
    return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
  }
}
```

**Security Checklist:**
- ✅ Never expose `RAZORPAY_KEY_SECRET` to frontend
- ✅ Always verify payment signature on backend
- ✅ Use HTTPS in production
- ✅ Implement rate limiting (prevent spam)
- ✅ Log all payment attempts

**Razorpay Dashboard:**
- View all payments: Dashboard → Payments
- Test mode: Use test cards (4111 1111 1111 1111)
- Production mode: Activate account after KYC
- Set up webhooks: Settings → Webhooks
- Configure payment methods: Settings → Payment Methods

---

## 🎯 SEO Utilities Usage

### 1. **Validate Meta Tags**

```typescript
import { validateSEOMetadata, logSEOValidation } from '@utils/seo.utils';

const metadata = {
  title: 'Top Market Research Company in India | Thought Metrics',
  description: 'Leading market research and consumer insights company in India. Expert qualitative & quantitative research services for brands.',
  keywords: ['market research', 'consumer insights', 'india'],
};

// In development, logs warnings if title/description are too long
logSEOValidation(metadata, '/about');

// Or get validation result
const result = validateSEOMetadata(metadata);
if (!result.isValid) {
  console.error('SEO Errors:', result.errors);
}
```

### 2. **Generate URL Slugs**

```typescript
import { generateSlug } from '@utils/seo.utils';

// Example 1: Basic
const slug = generateSlug('The Perfect SEO Guideline');
// Returns: "perfect-seo-guideline"

// Example 2: With focus keyword
const slug2 = generateSlug(
  'Understanding Market Research Methods',
  'market research'
);
// Returns: "understanding-market-research-methods"
// Warns if focus keyword missing
```

### 3. **Image SEO**

```typescript
import { generateImageSEO } from '@utils/seo.utils';

const { filename, alt } = generateImageSEO({
  filename: 'photo-123.jpg',
  keyword: 'market research india',
  alt: 'Team conducting qualitative interview'
});

// Result:
// filename: "market-research-india-photo-123.jpg"
// alt: "market research india - Team conducting qualitative interview"
```

### 4. **Content Validation**

```typescript
import { validateKeywordsInFirstWords, validateHeadingStructure } from '@utils/seo.utils';

// Check if keywords appear in first 100 words
const content = 'Your blog content here...';
const keywords = ['market research', 'consumer insights'];
const missing = validateKeywordsInFirstWords(content, keywords, 100);

if (missing.length > 0) {
  console.warn('Missing keywords in first 100 words:', missing);
}

// Validate H1/H2/H3 structure
const html = '<h1>Main Title</h1><h2>Subheading</h2>...';
const headingResult = validateHeadingStructure(html);

if (!headingResult.isValid) {
  console.error('Heading issues:', headingResult.issues);
}
```

### 5. **Character Counter (for forms)**

```typescript
import { getCharacterCountStatus } from '@utils/seo.utils';

// Real-time validation in forms
const titleStatus = getCharacterCountStatus(title, 60, 30);

if (titleStatus.status === 'error') {
  // Show red: "5 characters over limit"
} else if (titleStatus.status === 'warning') {
  // Show yellow: "10 characters below recommended minimum"
} else {
  // Show green: "15 characters remaining"
}
```

---

## 📊 Testing & Verification

### 1. **GTM & GA4:**
- Open browser DevTools → Network tab
- Filter: `gtm.js` and `analytics`
- Should see GTM script load
- Check: `dataLayer` in Console (type: `dataLayer`)

### 2. **Clarity:**
- Visit your site
- Go to Clarity dashboard
- Click "Recordings" (should see your session after ~5 minutes)

### 3. **Cookiebot:**
- Open site in incognito mode
- Should see consent banner
- Decline all → Verify GA4/Clarity don't load
- Accept all → Verify they do load

### 4. **Razorpay:**
- Use test mode keys
- Test card: `4111 1111 1111 1111`
- CVV: any 3 digits
- Expiry: any future date
- Verify payment appears in Razorpay dashboard

---

## 🎓 PRO India SEO Guidelines Summary

### Meta Tags:
- **Title:** 60 chars max, includes keywords
- **Description:** 160 chars max, generates curiosity
- **Keywords:** 5-10 keywords, comma-separated

### Content:
- Keywords in first 100 words ✅
- Single H1 per page ✅
- H2/H3 for subheadings ✅
- Max 2 internal links (dofollow, keyword anchors)
- External links to authoritative sources (mixed dofollow/nofollow)

### Images:
- Filename includes keyword
- Alt tag explains image with keyword
- Max 200KB size
- Featured: 600×315px or 1200×630px

### URL Slugs:
- Lowercase only
- Hyphens instead of spaces
- Remove function words (a, the, and)
- Include focus keyword

---

## 🚀 Next Steps

### Immediate (Do Now):
1. ✅ Add environment variables to `.env`
2. ✅ Update `RuntimeConfig.astro` with new config
3. ✅ Update `Layout.astro` with analytics components
4. ✅ Sign up for Clarity (FREE)
5. ✅ Sign up for Cookiebot
6. ✅ Configure GA4 in GTM dashboard
7. ✅ Test in incognito mode

### Optional (If Needed):
- Set up Razorpay if you need payments
- Configure webhook URLs in Razorpay dashboard
- Set up backend payment verification

### Weekly Maintenance:
- Review GA4: Traffic, top pages, conversions
- Watch 10-20 Clarity sessions
- Check Search Console for SEO issues
- Update meta tags based on performance

---

## 📞 Support Resources

- **GTM:** https://support.google.com/tagmanager
- **GA4:** https://support.google.com/analytics
- **Clarity:** https://learn.microsoft.com/en-us/clarity
- **Cookiebot:** https://www.cookiebot.com/en/help
- **Razorpay:** https://razorpay.com/docs
- **PRO India SEO:** Guidelines PDF provided

---

## ⚠️ Important Notes

### Security:
- ✅ Only PUBLIC_ prefixed vars exposed to browser
- ❌ Never expose RAZORPAY_KEY_SECRET to frontend
- ✅ Always verify Razorpay signatures on backend
- ✅ Use HTTPS in production

### Performance:
- GTM loads scripts asynchronously (doesn't block page load)
- Clarity is lightweight (~30KB)
- Cookiebot may slightly delay other scripts (by design, for compliance)

### Testing:
- Always test in incognito/private mode
- Use browser DevTools to verify script loading
- Check Console for errors
- Test payment flow end-to-end before going live

---

**🎉 You're All Set!**

All components are created and ready to use. Just follow the steps above to integrate them into your Layout.astro and configure the environment variables.

Questions? Check the inline documentation in each component file!
