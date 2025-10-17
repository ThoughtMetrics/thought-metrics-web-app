// src/core/configs/api-config.ts

// Helper to get PUBLIC env vars (available on server and client)
const getPublicEnv = (key: string): string | undefined => {
  // Client-side: read from window.__APP_CONFIG__ (injected during SSR)
  if (typeof window !== "undefined" && window.__APP_CONFIG__) {
    return window.__APP_CONFIG__[key as keyof typeof window.__APP_CONFIG__];
  }

  // Server-side: Priority to import.meta.env (local dev), fallback to process.env (Docker)
  return import.meta.env[key] || (typeof process !== "undefined" && process.env ? process.env[key] : undefined);
};

// Helper to get SERVER-ONLY env vars (never exposed to client)
const getServerEnv = (key: string): string | undefined => {
  // Server-side only: Priority to import.meta.env (local dev), fallback to process.env (Docker)
  return import.meta.env[key] || (typeof process !== "undefined" && process.env ? process.env[key] : undefined);
};

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
  return {
    // SERVER-ONLY: STRAPI_API_URL is never exposed to the browser
    strapiURL: getServerEnv("STRAPI_API_URL") || "",

    // PUBLIC: These are available on both server and client
    baseURL: getPublicEnv("PUBLIC_BASE_URL") || "",
    baseAPIVersion: getPublicEnv("PUBLIC_BASE_API_VERSION") || "",
    firebaseConfig: {
      apiKey: getPublicEnv("PUBLIC_FIREBASE_API_KEY") || "",
      authDomain: getPublicEnv("PUBLIC_FIREBASE_AUTH_DOMAIN") || "",
      projectId: getPublicEnv("PUBLIC_FIREBASE_PROJECT_ID") || "",
      storageBucket: getPublicEnv("PUBLIC_FIREBASE_STORAGE_BUCKET") || "",
      messagingSenderId: getPublicEnv("PUBLIC_FIREBASE_MESSAGING_SENDER_ID") || "",
      appId: getPublicEnv("PUBLIC_FIREBASE_APP_ID") || "",
    },
    apiPath: "/api",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  };
};
