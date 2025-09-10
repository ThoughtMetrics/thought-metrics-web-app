const API_CONFIG = {
  strapiURL: import.meta.env.STRAPI_API_URL || 'http://172.168.14.116:1338',
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
