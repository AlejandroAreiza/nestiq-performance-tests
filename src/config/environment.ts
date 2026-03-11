const BASE_URLS: Record<string, string> = {
  local: 'http://localhost:5283',
  staging: 'https://staging.nestiq.com',
};

const env = __ENV.ENVIRONMENT || 'local';

export const config = {
  baseUrl: BASE_URLS[env],
};