const API_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_URL,
  baseAPIVersion: import.meta.env.VITE_BASE_API_VERSION,
  strapiURL: import.meta.env.VITE_STRAPI_API_URL,
  apiPath: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
