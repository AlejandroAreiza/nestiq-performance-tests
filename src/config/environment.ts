const BASE_URLS: Record<string, string> = {
  local: 'http://localhost:5283',
};

const env = __ENV.ENVIRONMENT || 'local';

export const config = {
  baseUrl: BASE_URLS[env],
};