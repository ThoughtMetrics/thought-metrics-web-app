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
}

export {};