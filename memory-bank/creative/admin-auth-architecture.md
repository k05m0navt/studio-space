🎨🎨🎨 ENTERING CREATIVE PHASE: ARCHITECTURE (Admin Auth & RBAC)

## Problem
Secure admin endpoints and admin dashboard with minimal dependencies, consistent with existing Prisma/Sessions and JWT.

## Options Analysis
### Option 1: JWT + Prisma Session (Current stack)
- Pros: Minimal deps; already modeled (`Session`, `User`); works with RSC; easy header-based auth
- Cons: Need to manage token storage/refresh; client wiring
- Complexity: Medium; Time: 0.5–1 day

### Option 2: NextAuth.js (Credentials/JWT)
- Pros: Mature; adapters available; session helpers
- Cons: Adds dependency and provider complexity; fits Pages Router patterns more; overkill for MVP
- Complexity: Medium-High; Time: 1–2 days

### Option 3: Supabase Auth
- Pros: Out-of-box auth; dashboard; SSR helpers
- Cons: External dependency; migration effort; token bridging with Prisma Sessions
- Complexity: Medium; Time: 1–2 days

## Decision
Choose Option 1: JWT + Prisma Session. Aligns with current code and minimizes scope.

## Implementation Guidelines
- Split endpoints: `app/api/auth/login/route.ts`, `.../register/route.ts`
- Use `lib/prisma` and `lib/auth.requireRole(['ADMIN'])` to protect `app/api/admin/*`
- Admin UI stores JWT in `localStorage`; attach `Authorization: Bearer <token>` to admin fetches
- Handle 401/403 → clear token and show login; expire sessions server-side by `expiresAt`

## Verification
- Admin GET/POST return 401 without token; 403 for non-admin
- Successful login creates `Session`, returns `{ token, user }`

🎨🎨🎨 EXITING CREATIVE PHASE
