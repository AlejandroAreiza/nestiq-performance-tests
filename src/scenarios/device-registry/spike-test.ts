import { check } from 'k6';
import { Options } from 'k6/options';
import { registerDevice } from '../../clients/device-registry';
import { generateDevice } from '../../helpers/data-factory';

export const options: Options = {
  stages: [
    { duration: '10s', target: 10  },  // normal load
    { duration: '5s',  target: 500 },  // sudden spike
    { duration: '10s', target: 500 },  // hold spike
    { duration: '5s',  target: 10  },  // drop back to normal
    { duration: '10s', target: 10  },  // recovery period
    { duration: '5s',  target: 0   },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // relaxed — spike is harsh
    http_req_failed:   ['rate<0.10'],  // allow up to 10% errors during spike
  },
};

export default function () {
  const response = registerDevice(generateDevice());

  check(response, {
    'status is 201': (r) => r.status === 201,
    'response time < 3000ms': (r) => r.timings.duration < 3000,
  });

  if (response.status !== 201) {
    console.log(`Failed at VU ${__VU}: ${response.status} - ${response.body}`);
  }
}