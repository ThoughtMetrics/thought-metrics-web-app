declare global {
  interface Window {
    __APP_CONFIG__?: {
      PORT?: string;
      NODE_ENV?: string;
      VITE_BASE_URL?: string;
      VITE_BASE_API_VERSION?: string;
      VITE_STRAPI_API_URL?: string;
      VITE_SITE_URL?: string;
    };
  }

  interface ImportMetaEnv {
    VITE_BASE_URL: string;
    VITE_BASE_API_VERSION: string;
    VITE_STRAPI_API_URL: string;
    SITE_URL: string;
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
  }
}

export {};
