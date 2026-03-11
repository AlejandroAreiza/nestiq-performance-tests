import { check } from 'k6';
import { Options } from 'k6/options';
import { registerDevice } from '../../clients/device-registry';
import { generateDevice } from '../../helpers/data-factory';

export const options: Options = {
  stages: [
    { duration: '30s', target: 10 },  // ramp up to 10 users
    { duration: '1m',  target: 10 },  // hold at 10 users
    { duration: '30s', target: 0  },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed:   ['rate<0.01'], // less than 1% errors
  },
};

export default function () {
  const response = registerDevice(generateDevice());

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  // log failed responses
  if (response.status !== 201) {
    console.log(`Failed: ${response.status} - ${response.body}`);
  }
}
/*
## Understanding the stages

VUs
 10 |        /──────────────\
  5 |      /                 \
  0 |────/                    \────
      30s ramp    1m hold    30s ramp down 
*/