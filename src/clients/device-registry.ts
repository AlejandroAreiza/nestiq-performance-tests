import http from 'k6/http';
import { config } from '../config/environment';

export function registerDevice(payload: object) {
  return http.post(
    `${config.baseUrl}/api/devices`,
    JSON.stringify(payload),
    { headers: { 'Content-Type': 'application/json' } }
  );
}