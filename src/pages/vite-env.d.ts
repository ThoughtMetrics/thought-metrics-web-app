/// <reference types="astro/client" />
/// <reference types="vite/client" />

// SVG imports with vite-plugin-svgr
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const SVGComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default SVGComponent;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

// Image imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

interface Window {
  __APP_CONFIG__?: {
    // Only PUBLIC_ prefixed variables are exposed to the browser
    // Razor key secret is server-only and NOT included here for security
    PUBLIC_BASE_URL?: string;
    PUBLIC_BASE_API_VERSION?: string;
    PUBLIC_SITE_URL?: string;
    PUBLIC_FIREBASE_API_KEY?: string;
    PUBLIC_FIREBASE_AUTH_DOMAIN?: string;
    PUBLIC_FIREBASE_PROJECT_ID?: string;
    PUBLIC_FIREBASE_STORAGE_BUCKET?: string;
    PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string;
    PUBLIC_FIREBASE_APP_ID?: string;
    PUBLIC_MEASUREMENT_ID?: string;
    PUBLIC_GTM_ID?: string;
    PUBLIC_GOOGLE_SITE_VERIFICATION?: string;
    PUBLIC_CLARITY_PROJECT_ID?: string;
    PUBLIC_COOKIEBOT_ID?: string;
    PUBLIC_RAZORPAY_KEY_ID?: string;
  };
}

interface ImportMetaEnv {
  PUBLIC_STRAPI_API_URL: string;
  PUBLIC_BASE_URL: string;
  PUBLIC_BASE_API_VERSION: string;
  PUBLIC_SITE_URL: string;
  PUBLIC_FIREBASE_API_KEY: string;
  PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  PUBLIC_FIREBASE_PROJECT_ID: string;
  PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  PUBLIC_FIREBASE_APP_ID: string;
  PUBLIC_MEASUREMENT_ID: string;
  PUBLIC_GTM_ID: string;
  PUBLIC_GOOGLE_SITE_VERIFICATION: string;
  PUBLIC_CLARITY_PROJECT_ID: string;
  PUBLIC_COOKIEBOT_ID: string;
  PUBLIC_RAZORPAY_KEY_ID: string;
}
