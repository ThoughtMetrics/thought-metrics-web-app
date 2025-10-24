# Layout.astro Update Instructions

## Quick Copy-Paste Guide

### 1. Add Imports (After line 9)

```astro
import GoogleTagManager from '@/shared/components/analytics/GoogleTagManager.astro';
import MicrosoftClarity from '@/shared/components/analytics/MicrosoftClarity.astro';
import Cookiebot from '@/shared/components/analytics/Cookiebot.astro';
```

**Location:** Add after `import faviconSvg from '@assets/icons/thought-metrics.svg';`

---

### 2. Add Cookiebot (In `<head>`, after RuntimeConfig)

```astro
<!-- CRITICAL: RuntimeConfig must be first to prevent hydration errors -->
<RuntimeConfig />

<!-- Cookie Consent (Must load before other tracking scripts) -->
<Cookiebot />
```

**Location:** Around line 38, right after `<RuntimeConfig />`

---

### 3. Add GTM & Clarity (In `<head>`, after SEOHead)

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

**Location:** Around line 71-80, right after the `<SEOHead>` component

---

### 4. Add GTM Noscript (In `<body>`, first thing)

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

**Location:** Around line 152, right after `<body id="root">` opening tag

---

## Complete Updated Layout.astro Structure

```astro
---
import RuntimeConfig from '@components/RuntimeConfig.astro';
import SEOHead from '@/shared/components/SEOHead.astro';
import '@styles/global.css';
import '@styles/animations.css';
import '@styles/variables.css';
import '@styles/markdown.css';
import AppWrapper from '@/shared/components/AppWrapper';
import faviconSvg from '@assets/icons/thought-metrics.svg';
// ⬇️ ADD THESE IMPORTS
import GoogleTagManager from '@/shared/components/analytics/GoogleTagManager.astro';
import MicrosoftClarity from '@/shared/components/analytics/MicrosoftClarity.astro';
import Cookiebot from '@/shared/components/analytics/Cookiebot.astro';

export interface Props {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

const {
  title = 'Thought Metrics',
  description = 'Thought Metrics Website',
  keywords,
  ogImage,
  ogType,
  canonical,
  noindex,
  nofollow,
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <!-- CRITICAL: RuntimeConfig must be first to prevent hydration errors -->
    <RuntimeConfig />

    <!-- ⬇️ ADD COOKIEBOT HERE -->
    <!-- Cookie Consent (Must load before other tracking scripts) -->
    <Cookiebot />

    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href={faviconSvg.src} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />

    <meta name="google-site-verification" content="-yZOthuzoNTG-TuxrdHd4TPsKgbJobv0khZRx_Vnslk" />

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css"
    />

    <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"
    ></script>

    <!-- Status bar styling for iOS -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />

    <!-- Theme color for browser UI -->
    <meta name="theme-color" content="#ffffff" />

    <meta name="generator" content={Astro.generator} />

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

    <!-- ⬇️ ADD GTM & CLARITY HERE -->
    <!-- Analytics & Tracking -->
    <GoogleTagManager />
    <MicrosoftClarity />

    <!-- Allow additional head content from pages -->
    <slot name="head" />
    <!-- Page Loader Styles -->
    <style>
      #page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(251, 238, 238, 0.95);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }

      #page-loader.active {
        opacity: 1;
        visibility: visible;
      }

      .loader-spinner {
        width: 60px;
        height: 60px;
        border: 4px solid #e8505e33;
        border-top-color: #e8505e;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .loader-text {
        margin-top: 20px;
        font-family: 'Barlow', system-ui;
        font-size: 16px;
        color: #e8505e;
        font-weight: 500;
        letter-spacing: 0.5px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Fade animation for loader */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    </style>
  </head>
  <body id="root">
    <!-- ⬇️ ADD GTM NOSCRIPT HERE -->
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
      <div class="loader-spinner"></div>
      <div class="loader-text">Loading...</div>
    </div>

    <AppWrapper client:only="react">
      <slot />
    </AppWrapper>

    <!-- Page Navigation Loader Script -->
    <script>
      // Show loader on navigation start
      document.addEventListener('astro:before-preparation', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
          loader.classList.add('active');
        }
      });

      // Hide loader when page is ready
      document.addEventListener('astro:page-load', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
          // Add a small delay to ensure content is visible
          setTimeout(() => {
            loader.classList.remove('active');
          }, 300);
        }
      });

      // Hide loader on initial page load
      document.addEventListener('DOMContentLoaded', () => {
        const loader = document.getElementById('page-loader');
        if (loader) {
          loader.classList.remove('active');
        }
      });
    </script>
  </body>
</html>
```

---

## RuntimeConfig.astro Update

**File:** `src/shared/components/RuntimeConfig.astro`

Replace the `runtimeConfig` object (lines 13-30) with:

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

---

## Environment Variables to Add

Add these to your `.env` file:

```env
# Microsoft Clarity (FREE)
PUBLIC_CLARITY_PROJECT_ID=

# Cookiebot
PUBLIC_COOKIEBOT_ID=

# Razorpay (if needed)
PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=  # Backend only - DO NOT expose to frontend
```

---

## Verification Checklist

After making these changes:

1. ✅ Save all files
2. ✅ Restart dev server (`yarn dev`)
3. ✅ Open http://localhost:4200
4. ✅ Open Browser DevTools → Console
5. ✅ Check for GTM script: Look for `gtm.js` in Network tab
6. ✅ Type `dataLayer` in console (should return an array)
7. ✅ Check for Clarity: Look for `clarity.ms` in Network tab
8. ✅ Check for Cookiebot: Should see consent banner (if ID configured)

---

**Questions?** See the full guide: `SEO_ANALYTICS_IMPLEMENTATION_GUIDE.md`
