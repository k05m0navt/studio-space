# Tasks (Single Source of Truth)

- [x] Initialize Memory Bank structure
- [x] Gather user goal/task for this session: "Analyze entire app and help finish it"
- [x] Determine complexity level: Level 3 (multi-feature refactor)
- [x] If Level 2-4: switch to PLAN → CREATIVE → IMPLEMENT → QA
## Backlog to finish app (prioritized)
1. Unify Prisma client usage via `lib/prisma` across all API routes.
2. Protect admin API (`app/api/admin/*`) with `requireRole([`'ADMIN'])`; standardize JSON shape.
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
  - Secure admin endpoints with JWT auth and RBAC via `requireRole(['ADMIN'])`.
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
  - Wrap admin APIs with `requireRole(['ADMIN'])` (optionally allow `['ADMIN','MODERATOR']`).
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
   - Protect `app/api/admin/*` with `requireRole(['ADMIN'])`; standardize JSON responses and error handling.
2. Booking Flow (Phase 2)
   - Update `app/[locale]/book/page.tsx` to render `<BookingForm />` (remove duplicate logic) or extract shared pieces.
   - Internationalize `components/booking-form.tsx` using `useTranslations('booking')` and use i18n `useRouter` for success redirect (e.g., `router.push('/booking-success')` locale-aware).
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
  - Replace `import { PrismaClient } from ...` + `new PrismaClient()` with `import { prisma } from '@/lib/prisma'`.
- Step B: Auth endpoints split
  - Create `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts` using logic from current `app/api/auth/route.ts` and `zod` validation.
  - Remove path-based branching on `pathname`; ensure each route returns `{ token, user }` and persists `Session`.
- Step C: Admin API protection
  - Wrap handlers in `requireRole(['ADMIN'])`; return 401/403 consistently; document expected response shapes.
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
- [ ] Technology validation complete
- [ ] Implementation in progress

## Technology Stack
- Framework: Next.js 15 (App Router, RSC priority)
- Language: TypeScript
- Database: PostgreSQL via Prisma
- Auth: JWT + Prisma `Session` model, optional Supabase later
- i18n: next-intl

## Technology Validation Checkpoints
- [ ] Build runs after Prisma import unification
- [ ] Auth routes respond at `/api/auth/login` and `/api/auth/register`
- [ ] Admin endpoints enforce RBAC
- [ ] Booking flow works end-to-end in both locales

## NEXT RECOMMENDED MODE
- IMPLEMENT MODE (no creative phases required)

