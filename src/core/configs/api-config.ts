// src/core/configs/api-config.ts

// Helper to get PUBLIC env vars (available on server and client)
const getPublicEnv = (key: string): string | undefined => {
  // Client-side: read from window.__APP_CONFIG__ (injected during SSR)
  if (typeof window !== 'undefined' && window.__APP_CONFIG__) {
    return window.__APP_CONFIG__[key as keyof typeof window.__APP_CONFIG__];
  }

  // Server-side: Priority to import.meta.env (local dev), fallback to process.env (Docker)
  return (
    import.meta.env[key] ||
    (typeof process !== 'undefined' && process.env
      ? process.env[key]
      : undefined)
  );
};

// Helper to get SERVER-ONLY env vars (never exposed to client)
const getServerEnv = (key: string): string | undefined => {
  // Server-side only: Priority to import.meta.env (local dev), fallback to process.env (Docker)
  return (
    import.meta.env[key] ||
    (typeof process !== 'undefined' && process.env
      ? process.env[key]
      : undefined)
  );
};

// // Helper to get the correct Firebase authDomain
// // The authDomain MUST be a domain where Firebase Hosting is configured
// const getFirebaseAuthDomain = (): string => {
//   // Server-side: always use default
//   if (typeof window === 'undefined') {
//     return getPublicEnv('PUBLIC_FIREBASE_AUTH_DOMAIN') || 'thought-metrics.firebaseapp.com';
//   }

//   const hostname = window.location.hostname;

//   console.log('[API Config] Determining authDomain for hostname:', hostname);

//   // For production domains with Firebase Hosting configured,
//   // use the same domain as authDomain to avoid cross-origin storage issues
//   if (hostname === 'www.thoughtmetrics.com' || hostname === 'thoughtmetrics.com') {
//     console.log('[API Config] Using production authDomain: www.thoughtmetrics.com');
//     return 'www.thoughtmetrics.com';
//   }

//   // For Azure staging
//   if (hostname.includes('azurewebsites.net')) {
//     console.log('[API Config] Using Azure authDomain:', hostname);
//     return hostname;
//   }

//   // For localhost: Use Firebase default domain
//   // WARNING: This will cause cross-origin storage issues with redirect flow!
//   // The auth state will be stored in thought-metrics.firebaseapp.com's IndexedDB
//   // but read from localhost's IndexedDB, causing getRedirectResult() to return null.
//   console.log('[API Config] Using Firebase default authDomain (localhost detected - cross-origin issue expected)');
//   return getPublicEnv('PUBLIC_FIREBASE_AUTH_DOMAIN') || 'thought-metrics.firebaseapp.com';
// };

// Returns API config at runtime
export const getAPIConfig = (): {
  siteURL: string;
  baseURL: string;
  baseAPIVersion: string;
  strapiURL: string;
  queueURL: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  gtmId: string;
  cookiebotId: string;
  gSiteVerification: string;
  publicRazorpayKeyId: string;
  razorpayKeySecret: string;
  apiPath: string;
  timeout: number;
  headers: Record<string, string>;
} => {
  return {
    siteURL:
      getPublicEnv('PUBLIC_SITE_URL') || 'https://www.thoughtmetrics.com',
    // SERVER-ONLY: STRAPI_API_URL is never exposed to the browser
    strapiURL: getPublicEnv('PUBLIC_STRAPI_API_URL') || '',

    // PUBLIC: These are available on both server and client
    baseURL: getPublicEnv('PUBLIC_BASE_URL') || '',
    baseAPIVersion: getPublicEnv('PUBLIC_BASE_API_VERSION') || '',
    queueURL: getPublicEnv('PUBLIC_QUEUE_URL') || '',
    firebaseConfig: {
      apiKey: getPublicEnv('PUBLIC_FIREBASE_API_KEY') || '',
      authDomain: getPublicEnv('PUBLIC_FIREBASE_AUTH_DOMAIN')|| '',
      projectId: getPublicEnv('PUBLIC_FIREBASE_PROJECT_ID') || '',
      storageBucket: getPublicEnv('PUBLIC_FIREBASE_STORAGE_BUCKET') || '',
      messagingSenderId:
        getPublicEnv('PUBLIC_FIREBASE_MESSAGING_SENDER_ID') || '',
      appId: getPublicEnv('PUBLIC_FIREBASE_APP_ID') || '',
      measurementId: getPublicEnv('PUBLIC_MEASUREMENT_ID') || '',
    },
    gtmId: getPublicEnv('PUBLIC_GTM_ID') || '',
    gSiteVerification: getPublicEnv('PUBLIC_GOOGLE_SITE_VERIFICATION') || '',
    publicRazorpayKeyId: getPublicEnv('PUBLIC_RAZORPAY_KEY_ID') || '',
    razorpayKeySecret: getServerEnv('RAZORPAY_KEY_SECRET') || '',
    cookiebotId: getPublicEnv('PUBLIC_COOKIEBOT_ID') || '',
    apiPath: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
