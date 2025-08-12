# TASK ARCHIVE: Admin Login Wiring

## Metadata
- Complexity: Level 3 (Feature)
- Date Completed: $(date -u +%Y-%m-%d)
- Related Areas: Auth, Admin Dashboard, Middleware, Prisma, i18n

## Summary
Implemented real admin login via `/api/auth/login`, persisted JWT in `localStorage`, attached `Authorization` headers in admin fetches, added locale-aware auth proxies, excluded API routes from next-intl rewriting in middleware, introduced a secure bootstrap endpoint to create the first admin, and stabilized DB connectivity using pooled `DATABASE_URL` (PgBouncer).

## Requirements
- Authenticate via `POST /api/auth/login` and return `{ token, user }`.
- Store token on client and attach `Authorization: Bearer <token>`.
- Handle 401/403 by clearing auth state and redirecting to login.
- Keep locale auth proxies; avoid header bloat/rewrites.

## Implementation
### Key Changes
- Admin UI (`app/[locale]/admin/page.tsx`):
  - Added `getAuthHeaders` and `authorizedFetch`.
  - Enforced admin role on login, stored `adminUser` + `adminToken`.
  - Centralized 401/403 handling and added login submit guard + 15s timeout.
- API routes:
  - `app/api/auth/login/route.ts`: bcrypt/JWT + session persistence; structured errors.
  - `app/api/auth/bootstrap/route.ts`: one-time admin creation guarded by `ADMIN_BOOTSTRAP_SECRET`.
  - Locale proxies for auth: `app/[locale]/api/auth/{login,register}/route.ts` (minimal headers).
  - Locale admin proxies: forward only `Authorization` (and `Content-Type` on POST).
- Middleware (`middleware.ts`):
  - Skip next-intl for `/api/*` and `/(ru|en)/api/*`.
  - Keep rate limiting but exempt auth endpoints.
  - Security headers intact.
- Prisma (`lib/prisma.ts`): use pooled `DATABASE_URL` at runtime; `DIRECT_URL` for migrations.

### Files Changed
- app/[locale]/admin/page.tsx
- app/api/auth/login/route.ts
- app/api/auth/bootstrap/route.ts
- app/[locale]/api/auth/login/route.ts
- app/[locale]/api/auth/register/route.ts
- app/[locale]/api/admin/{bookings,users,stats}/route.ts
- middleware.ts
- lib/prisma.ts
- .env (normalized DB URLs)

## Testing
- Manual: bootstrap admin -> login -> load admin dashboard; verified authorized fetches and 401 handling.
- Build: success locally; known swagger-jsdoc warning remains benign.

## Lessons Learned
- Avoid forwarding entire request headers through proxies (can cause 431).
- Excluding API routes from i18n middleware prevents `/en/api/*` rewrite issues.
- PgBouncer + `sslmode=require` improves reliability with Prisma on Supabase.

## References
- Reflection: memory-bank/reflection.md (Admin Login Wiring section)
- Plan: memory-bank/tasks.md (PLAN: Admin Login Wiring)
