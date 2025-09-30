// src/core/configs/api-config.ts
interface RuntimeConfig {
  VITE_BASE_URL?: string;
  VITE_BASE_API_VERSION?: string;
  VITE_STRAPI_API_URL?: string;
  VITE_SITE_URL?: string;
}

// Returns API config at runtime
export const getAPIConfig = (): {
  baseURL: string;
  baseAPIVersion: string;
  strapiURL: string;
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
    apiPath: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
