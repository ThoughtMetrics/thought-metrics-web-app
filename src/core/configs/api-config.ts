// src/core/configs/api-config.ts
interface RuntimeConfig {
  VITE_BASE_URL?: string;
  VITE_BASE_API_VERSION?: string;
  VITE_STRAPI_API_URL?: string;
  VITE_SITE_URL?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
}

// Returns API config at runtime
export const getAPIConfig = (): {
  baseURL: string;
  baseAPIVersion: string;
  strapiURL: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  apiPath: string;
  timeout: number;
  headers: Record<string, string>;
} => {
  // Wait until window.__APP_CONFIG__ exists
  const runtimeConfig: RuntimeConfig =
    typeof window !== 'undefined' && window.__APP_CONFIG__
      ? window.__APP_CONFIG__
      : {};

  return {
    baseURL: import.meta.env.VITE_BASE_URL ?? runtimeConfig.VITE_BASE_URL,
    baseAPIVersion:
      import.meta.env.VITE_BASE_API_VERSION ??
      runtimeConfig.VITE_BASE_API_VERSION,
    strapiURL:
      import.meta.env.VITE_STRAPI_API_URL ?? runtimeConfig.VITE_STRAPI_API_URL,
    firebaseConfig: {
      apiKey:
        import.meta.env.VITE_FIREBASE_API_KEY ??
        runtimeConfig.VITE_FIREBASE_API_KEY,
      authDomain:
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
        runtimeConfig.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:
        import.meta.env.VITE_FIREBASE_PROJECT_ID ??
        runtimeConfig.VITE_FIREBASE_PROJECT_ID,
      storageBucket:
        import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
        runtimeConfig.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId:
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ??
        runtimeConfig.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:
        import.meta.env.VITE_FIREBASE_APP_ID ??
        runtimeConfig.VITE_FIREBASE_APP_ID,
    },
    apiPath: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
