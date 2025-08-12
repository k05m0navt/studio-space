# Tasks (Single Source of Truth)

- [x] Initialize Memory Bank structure
- [x] Gather user goal/task for this session: "Analyze entire app and help finish it"
- [x] Determine complexity level: Level 3 (multi-feature refactor)
- [x] If Level 2-4: switch to PLAN → CREATIVE → IMPLEMENT → QA
## Backlog to finish app (prioritized)
1. Unify Prisma client usage via `lib/prisma` across all API routes.

   - Include `lib/auth.ts` to use shared `prisma` wrapper.

2. Protect admin API (`app/api/admin/*`) with `requireRole([`ADMIN])`; standardize JSON shape.
3. Implement real admin login using `POST /api/auth/login`; store JWT; attach Authorization header in admin fetches.
4. Refactor `app/[locale]/book/page.tsx` to reuse `components/booking-form` or extract shared form; wire to `/api/bookings`.
5. Internationalize `components/booking-form.tsx` and switch to localized router, fix redirect path.
6. Replace Gallery images with `next/image` or `OptimizedImage`; move assets to WebP with sizes.
7. Use availability API in booking UI; remove hardcoded slots.
8. Standardize Prisma import in `app/api/auth/route.ts` to use `@/lib/prisma`.
9. Add tests for booking APIs and admin stats with Jest.
10. Audit CSP and security headers; remove unsafe-eval if feasible.

# Feature Planning Document: Finish Studio Space MVP

## Requirements Analysis
- Core Requirements:
  - Secure admin endpoints with JWT auth and RBAC via `requireRole([ADMIN])`.
  - Unify Prisma usage through `@/lib/prisma` to prevent multiple clients.
  - Single, i18n-ready booking flow using `/api/bookings` and `/api/bookings/availability`.
  - Real admin login via `/api/auth/login`; persist JWT; attach `Authorization: Bearer <token>` for admin fetches.
  - Consistent i18n navigation and locale-aware redirects.
  - Image optimization with `next/image` or `OptimizedImage` and WebP assets.
- Technical Constraints:
  - Next.js 15 + React 19; App Router with RSC preference.
  - Prisma client output at `app/generated/prisma`; wrapper at `lib/prisma` with `DIRECT_URL`.
  - next-intl routing (`/en`, `/ru` segments). PWA + CSP headers in `middleware.ts`.

## Component Analysis
- Affected Components/Routes:
  - API: `app/api/admin/{bookings,users,stats}/route.ts`, `app/api/bookings/*`, `app/api/auth/*`.
  - Proxies: `app/[locale]/api/admin/*` (keep as thin proxies).
  - Lib: `lib/prisma.ts`, `lib/auth.ts`.
  - UI: `app/[locale]/admin/page.tsx`, `app/[locale]/book/page.tsx`, `components/booking-form.tsx`, `app/[locale]/gallery/page.tsx`.

## Design Decisions
- Architecture:
  - Use a single Prisma instance from `lib/prisma` in all routes.
  - Split auth endpoints into dedicated files: `app/api/auth/login/route.ts` and `app/api/auth/register/route.ts`.
  - Wrap admin APIs with `requireRole([ADMIN])` (optionally allow `[ADMIN,MODERATOR]`).
  - Use i18n router (`@/i18n/routing`) for locale-aware navigation from client components.
- UI/UX:
  - Replace duplicated booking page form with `components/booking-form.tsx` or extract shared subcomponents.
  - Switch gallery images to `OptimizedImage`/`next/image` with sizes and lazy loading.
- Algorithms:
  - Availability computed server-side from existing bookings; client consumes `unavailableSlots` only.

## Implementation Strategy
1. Security & Data Layer (Phase 1)
   - Refactor all API routes to import `prisma` from `@/lib/prisma` (remove `new PrismaClient()`).
   - Create `app/api/auth/login/route.ts` and `app/api/auth/register/route.ts` by moving logic out of `app/api/auth/route.ts` and fixing imports to `@/lib/prisma`.
   - Protect `app/api/admin/*` with `requireRole([ADMIN])`; standardize JSON responses and error handling.
2. Booking Flow (Phase 2)
   - Update `app/[locale]/book/page.tsx` to render `<BookingForm />` (remove duplicate logic) or extract shared pieces.
   - Internationalize `components/booking-form.tsx` using `useTranslations(booking)` and use i18n `useRouter` for success redirect (e.g., `router.push(/booking-success)` locale-aware).
   - Ensure booking UI uses `/api/bookings/availability` results to disable time slots (remove hard-coded examples).
3. UX/Performance (Phase 3)
   - Replace plain `<img>`/`motion.img` usage in `app/[locale]/gallery/page.tsx` with `OptimizedImage`/`next/image` and confirm WebP assets/sizes.
   - Minor accessibility: ensure primary CTAs are focus-visible, add `aria-*` where missing.
4. QA (Phase 4)
   - Add Jest + RTL config; unit tests for `POST /api/bookings` (validation/conflict), admin stats aggregation, and auth login flow.
   - Tighten CSP (attempt to remove `unsafe-eval`/inline where feasible, or scope to required origins).

## Detailed Steps
- Step A: Prisma unification
  - Files: `app/api/**/route.ts`, `app/[locale]/api/**/route.ts`, `app/api/auth/*`.
  - Replace `import { PrismaClient } from ...` + `new PrismaClient()` with `import { prisma } from @/lib/prisma`.
- Step B: Auth endpoints split
  - Create `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts` using logic from current `app/api/auth/route.ts` and `zod` validation.
  - Remove path-based branching on `pathname`; ensure each route returns `{ token, user }` and persists `Session`.
- Step C: Admin API protection
  - Wrap handlers in `requireRole([ADMIN])`; return 401/403 consistently; document expected response shapes.
- Step D: Admin UI wiring
  - In `app/[locale]/admin/page.tsx`, replace local credential check with real login flow calling `/api/auth/login` and store JWT in `localStorage`.
  - For data fetches, add `Authorization` header using stored token; handle 401 by clearing token and showing login.
- Step E: Booking form unification + i18n
  - Render `components/booking-form.tsx` in `app/[locale]/book/page.tsx` and remove duplicate form code.
  - Update `components/booking-form.tsx` to use `useTranslations` and i18n `useRouter` from `@/i18n/routing` for locale-aware navigation to `/booking-success`.
- Step F: Gallery optimization
  - Use `OptimizedImage` with sizes; ensure assets in `public/images/gallery/*.webp` and include width/height or responsive sizes.
- Step G: Tests & CSP
  - Add tests for bookings, admin stats, and auth; refine CSP to drop `unsafe-eval` if compatible with current libs.

## Dependencies
- Environment: `DIRECT_URL`, `JWT_SECRET` must be set.
- Packages: Jest + RTL (dev) if tests are added.

## Challenges & Mitigations
- Multiple Prisma clients creating connection churn → unify via `lib/prisma`.
- Auth route path design mismatch (`/api/auth/route.ts` vs `/api/auth/login`) → split into dedicated routes.
- CSP constraints with animations → if removal of `unsafe-inline` breaks, scope rules minimally.

## Creative Phases Required
- UI/UX Design: No (minor edits only).
- Architecture: No (standard refactor).
- Algorithm: No.

## Status
- [x] Initialization complete
- [x] Planning complete
- [x] Technology validation complete
- [x] Implementation complete
- [x] Reflection complete
- [x] Archiving complete

## Technology Stack
- Framework: Next.js 15 (App Router, RSC priority)
- Language: TypeScript
- Database: PostgreSQL via Prisma
- Auth: JWT + Prisma `Session` model, optional Supabase later
- i18n: next-intl

## Technology Validation Checkpoints
- [x] Build runs after Prisma import unification
- [x] Auth routes respond at `/api/auth/login` and `/api/auth/register`
- [x] Admin endpoints enforce RBAC
- [ ] Booking flow works end-to-end in both locales

## NEXT RECOMMENDED MODE
- IMPLEMENT MODE (no creative phases required)

## Reflection Highlights (Mid-implementation)
- **What Went Well**: RBAC enforced across admin and bookings GET; Prisma wrapper adopted in APIs; availability API live and consumed; locale-aware admin proxies in place.
- **Challenges**: `lib/auth.ts` uses its own Prisma client; auth routes not split; booking UI duplicated; gallery not using next/image.
- **Lessons Learned**: Consolidate data/auth layers first; prefer dedicated route files over pathname branching; standardize response shape early.
- **Next Steps**: Refactor `lib/auth.ts` to use shared prisma; create `/api/auth/{login,register}` routes; reuse `components/booking-form` in `app/[locale]/book/page.tsx` with i18n; optimize gallery images; run build and smoke tests.

## Archive
- **Date**: 2025-08-12
- **Archive Document**: /Users/k05m0navt/Work/VashaStudio/studio-space/docs/archive/finish-studio-space-mvp-phases-1-2-20250812.md
- **Status**: COMPLETED


## Deployment Fixes
- [x] Ensure Prisma Client is generated on Vercel by adding `postinstall` and prepending `prisma generate` to `build` script in `package.json`.


## Archive
- **Date**: 2025-08-12
- **Archive Document**: /Users/k05m0navt/Work/VashaStudio/studio-space/docs/archive/vercel-prisma-generate-fix-20250812.md
- **Status**: COMPLETED

## PLAN: Booking Flow E2E + Gallery Optimization (Level 3)

### Requirements
- [x] i18n-ready booking form uses /api/bookings and /api/bookings/availability
- [x] Success redirect uses locale-aware router to /booking-success
- [x] Replace gallery images with OptimizedImage/next/image using WebP + sizes

### Components Affected
- app/[locale]/book/page.tsx
- components/booking-form.tsx
- app/[locale]/gallery/page.tsx
- lib/auth.ts (JWT usage in admin fetches)

### Implementation Steps
1. [ ] Render <BookingForm /> in app/[locale]/book/page.tsx
2. [ ] Add useTranslations to components/booking-form.tsx; replace text literals
3. [ ] Use i18n useRouter from @/i18n/routing for redirect to /booking-success
4. [ ] Wire availability API to disable/unselect unavailable slots
5. [ ] Swap gallery images to OptimizedImage with sizes and WebP assets

### Dependencies
- JWT_SECRET, DIRECT_URL set
- Images available in public/images/gallery/*.webp

### Challenges & Mitigations
- Locale routing edge cases → rely on i18n router helpers
- Availability race conditions → revalidate on submit, display conflict errors

### Status
- [x] Planning complete
- [x] Implementation complete

### Next Mode
- REFLECT


## BUILD: Booking Flow E2E + Gallery Optimization

### Items Completed
- [x] Render <BookingForm /> in app/[locale]/book/page.tsx (Server Component)
- [x] Booking form uses useTranslations for labels and copy
- [x] Success redirect uses i18n useRouter to /booking-success
- [x] Availability API wired to disable unavailable time slots
- [x] Gallery images switched to OptimizedImage with responsive sizes

### Verification
- yarn build: SUCCESS (swagger-jsdoc warning only)


## Archive
- **Date**: 2025-08-12
- **Archive Document**: /Users/k05m0navt/Work/VashaStudio/studio-space/docs/archive/booking-flow-e2e-gallery-optimization-20250812.md
- **Status**: COMPLETED


## PLAN: Admin Login Wiring (Level 3)

### Requirements
- [x] Use `POST /api/auth/login` to authenticate and receive `{ token, user }`
- [x] Store JWT in `localStorage` as `adminToken` and set `adminAuth=authenticated`
- [x] Attach `Authorization: Bearer <token>` to all admin fetches
- [x] Handle 401/403 by clearing token, showing login form, and surfacing i18n toast
- [x] Keep locale-aware admin proxy routes; forward headers intact
- [x] Use `messages/*` i18n keys for auth toasts and states

### Components Affected
- `app/[locale]/admin/page.tsx`
- `app/[locale]/api/admin/{bookings,users,stats}/route.ts` (verify header forwarding)
- `lib/auth.ts` (no change required for this task)
- `messages/{en,ru}.json` (strings already present)

### Architecture Considerations
- Introduce a small client helper to centralize token header injection and 401 handling:
  - `authorizedFetch(input, init?)` → adds `Authorization` header if token exists; on 401/403 clears auth storage and returns an error shape
  - `getAuthHeaders()` → returns `{ Authorization: Bearer <token> } | {}`
- Keep token in `localStorage` for now (future: httpOnly cookie)
- Use locale-aware paths for client fetches (existing proxies)

### Implementation Strategy
1. Add `authorizedFetch` and `getAuthHeaders` inside `app/[locale]/admin/page.tsx` (scoped for now) or a tiny `lib/client-auth.ts`.
2. Update `AdminLoginForm` submit to also persist `user` as `adminUser` (stringified) and keep existing token/adminAuth writes.
3. Replace direct `fetch` calls in `loadDashboardData` with `authorizedFetch` and handle unauthorized by:
   - Clearing token/admin flags
   - `setIsAuthenticated(false)` and showing login form
   - Toast `auth.sessionExpired` or `common.unauthorized`
4. On mount, if token present, attempt a lightweight authorized call (e.g., stats) to validate session; fallback to login on 401.
5. Ensure proxy routes keep forwarding `Authorization` (already implemented); no changes expected.
6. Add minimal JSDoc comments for helpers and key functions.

### Detailed Steps
- [x] Create `authorizedFetch` + `getAuthHeaders`
- [x] Store `user` in `localStorage` on successful login
- [x] Migrate admin data fetches to `authorizedFetch`
- [x] Add 401/403 handling: clear storage, set unauthenticated, toast
- [x] Validate session on mount via a single authorized call

### Dependencies
- `JWT_SECRET` set in environment (server)
- Working endpoints: `/api/auth/login`, `/api/admin/{bookings,users,stats}`

### Challenges & Mitigations
- Token expiry / invalidation → centralized 401 handler resets state and prompts login
- UI state flicker on re-auth → gate data loads behind `isAuthenticated`, show spinner while validating

### Status
- [x] Planning complete
- [x] Implementation complete

### Next Mode
- REFLECT

undefined

### Requirements
- [ ] Add Jest + RTL and unit tests for bookings, admin stats, and auth login
- [ ] Tighten CSP headers; remove unsafe-eval if feasible

### Components Affected
- app/api/bookings/*
- app/api/admin/*
- app/api/auth/*
- middleware.ts

### Implementation Steps
1. [x] Configure Jest + RTL in project; add scripts
2. [x] Write tests for POST /api/bookings (validation, conflict)
3. [x] Write tests for admin stats aggregation
4. [x] Write tests for /api/auth/login happy/error paths
5. [x] Audit CSP in middleware.ts; reduce unsafe-* and add necessary sources
6. [x] Build and run tests locally

### Dependencies
- Node 18+, jest, @testing-library/react, ts-jest

### Status
- [x] Planning complete
- [x] Implementation complete
- [x] QA complete

### Next Mode
- ARCHIVE
### Overview
- Add Jest + RTL testing setup; create unit tests for critical APIs (bookings, admin stats, auth login).
- Harden CSP in `middleware.ts` to reduce unsafe directives while keeping app functional.

### Files to Modify
- `package.json` (scripts: test, test:watch, coverage; devDependencies: jest, ts-jest, @types/jest, @testing-library/react, @testing-library/jest-dom, whatwg-node/fetch or undici)
- `jest.config.ts` (ts-jest preset, ESM support, testEnvironment: node, setupFilesAfterEnv)
- `tsconfig.json` (include `types: ["jest", "@testing-library/jest-dom"]` in tests context or create `tsconfig.test.json`)
- `tests/api/bookings.test.ts`
- `tests/api/admin-stats.test.ts`
- `tests/api/auth-login.test.ts`
- `middleware.ts` (CSP header adjustments)

### Testing Strategy
- Unit-test route handlers by invoking exported `GET/POST` with `Request` from undici (Node 18) and asserting `Response` JSON/status.
- Mock Prisma via `jest.mock("@/lib/prisma")` returning controlled data for each test.
- Validate error paths (validation failures, 401/403) and happy paths.
- Use coverage thresholds to ensure meaningful coverage.
- CI-ready: `yarn build && yarn test --ci --runInBand`.

### Potential Challenges
- Next.js route handler testing in Node: ensure `global.fetch/Request/Response` via undici polyfill in Jest setup.
- Prisma mocking complexity: export a minimal interface from `@/lib/prisma` to simplify mocks.
- CSP tightening may break analytics or external assets; iterate by whitelisting exact origins.

### Technology Validation
- [x] Node 18+ with undici fetch available in Jest env
- [x] jest + ts-jest configuration compiles TS tests
- [x] Minimal sample test runs and passes
- [x] `yarn build` remains successful after adding configs

### Status
- [x] Planning complete

### Next Mode
- IMPLEMENT
