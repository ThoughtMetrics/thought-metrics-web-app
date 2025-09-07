const API_CONFIG = {
  strapiURL: import.meta.env.STRAPI_API_URL || 'http://192.168.0.208:1338',
  apiPath: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const getStrapiApiUrl = (endpoint = '') => {
  return `${API_CONFIG.strapiURL}${API_CONFIG.apiPath}${endpoint}`;
};

export default API_CONFIG;
