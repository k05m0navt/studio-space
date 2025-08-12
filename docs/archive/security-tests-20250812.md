# Archive: Security & Test Coverage (Level 2) — 2025-08-12

## Summary
Implemented Jest + ts-jest (ESM), polyfilled fetch APIs, and added unit tests for:
- POST /api/bookings (happy, conflict, validation)
- GET /api/admin/stats (RBAC path with JWT+session mock)
- POST /api/auth/login (happy, invalid, validation)

Tightened CSP by removing \unsafe-eval\ while keeping \unsafe-inline\ for now. All tests pass; build succeeds.

## Key Changes
- package.json: test scripts, dev deps
- jest.config.ts: ts-jest + ESM + alias mapping
- tests/setup/jest.setup.ts: fetch/Request/Response polyfills
- tests/api/*.test.ts: bookings, admin stats, auth login
- middleware.ts: CSP updated

## Verification
- yarn test: PASS (3 suites, 8 tests)
- yarn build: SUCCESS (swagger-jsdoc warning remains)

## Reflection Link
- See memory-bank/reflection.md (Security & Test Coverage section)

## Follow-ups
- Consider removing \unsafe-inline\ with non-inline assets
- Extract shared response helpers
