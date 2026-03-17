# 🚀 NestIQ — Performance Tests

Performance tests for the NestIQ smart home IoT platform using [k6](https://k6.io/).

---

## 🛠️ Prerequisites

- [k6](https://k6.io/docs/getting-started/installation/) installed
- [Node.js](https://nodejs.org/) v18+
- Target service running (local or staging)

---

## ⚙️ Setup

### 1. Start the target service

Clone and run the device-registry service locally:

```bash
git clone https://github.com/AlejandroAreiza/nestiq-device-registry.git
cd nestiq-device-registry
npm install
npm run start:dev
```

The service will run at `http://localhost:5283`.

### 2. Install dependencies

```bash
npm install
```

---

## 🏃 Running Tests

```bash
npm run load-test    # normal load
npm run stress-test  # push to limits
npm run spike-test   # sudden burst
```

**Against staging:**
```bash
ENVIRONMENT=staging npm run load-test
```

---

## 📁 Structure

```
src/
├── config/
│   └── environment.ts        ← base URLs per environment
├── clients/
│   └── device-registry.ts    ← HTTP calls
├── scenarios/
│   └── device-registry/
│       ├── load-test.ts
│       ├── stress-test.ts
│       └── spike-test.ts
└── helpers/
    └── data-factory.ts       ← test data generation
```

---

## 🧪 Test Scenarios

### Load Test
Simulates normal expected traffic. Validates the API performs well under typical day-to-day load.

```
VUs
 10 |────────────────────────────\
  7 |          /                  \
  5 |        /                     \
  3 |      /                        \
  1 |────/                           \────
     0s  30s          90s           120s
      ramp up    hold 1min        ramp down
```

- **0s → 30s** — gradually ramp up from 1 to 10 users
- **30s → 90s** — hold at 10 concurrent users for 1 minute
- **90s → 120s** — gradually ramp down from 10 to 0 users

**Thresholds:**
- p(95) response time < 500ms
- error rate < 1%

---

### Stress Test
Gradually pushes the API beyond its limits to find the breaking point and observe how it degrades.

```
VUs
400 |────────────────────────\
300 |          /              \
200 |        /                 \
100 |      /                    \
 50 |    /                       \
  0 |──/                          \────
     0s  30s  60s  90s  120s     150s
          ramp up gradually    ramp down
```

- **0s → 30s** — ramp up to 50 users
- **30s → 60s** — ramp up to 100 users
- **60s → 90s** — ramp up to 200 users
- **90s → 120s** — ramp up to 400 users
- **120s → 150s** — ramp down to 0 users

**Thresholds:**
- p(95) response time < 2000ms
- error rate < 5%

---

### Spike Test
Simulates a sudden burst of traffic — like a flash sale or a viral event — to observe how the API absorbs and recovers from the spike.

```
VUs
500 |               /‾‾‾‾‾‾‾\
 10 |‾‾‾‾‾‾‾‾‾‾‾‾‾/           \‾‾‾‾‾‾‾‾‾‾
  0 |                                      \────
     0s   10s  15s          25s  30s      45s
      normal   spike  hold      recovery  ramp down
```

- **0s → 10s** — normal load, 10 users
- **10s → 15s** — sudden spike to 500 users
- **15s → 25s** — hold at 500 users
- **25s → 30s** — drop back to 10 users
- **30s → 40s** — recovery period at 10 users
- **40s → 45s** — ramp down to 0 users

**Thresholds:**
- p(95) response time < 3000ms
- error rate < 10%

---

## 🌍 Environments

| Environment | Base URL |
|---|---|
| `local` | `http://localhost:5283` |
| `staging` | `https://staging.nestiq.com` |

---

## ⚠️ Important

Performance tests create real data in the database. Always run against a dedicated environment and clean up after:

```bash
# Clean up after tests (local)
psql -U postgres -c "TRUNCATE TABLE \"Devices\";" nestiq_device_registry
```