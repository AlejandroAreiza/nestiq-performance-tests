import { check } from 'k6';
import { Options } from 'k6/options';
import { registerDevice } from '../../clients/device-registry';
import { generateDevice } from '../../helpers/data-factory';

export const options: Options = {
  stages: [
    { duration: '30s', target: 50   },  // ramp up to 50 users
    { duration: '30s', target: 100  },  // ramp up to 100 users
    { duration: '30s', target: 200  },  // ramp up to 200 users
    { duration: '30s', target: 400  },  // ramp up to 400 users
    { duration: '30s', target: 0    },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // more relaxed under stress
    http_req_failed:   ['rate<0.05'],  // allow up to 5% errors under stress
  },
};

export default function () {
  const response = registerDevice(generateDevice());

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  if (response.status !== 201) {
    console.log(`Failed at VU ${__VU}: ${response.status} - ${response.body}`);
  }
}