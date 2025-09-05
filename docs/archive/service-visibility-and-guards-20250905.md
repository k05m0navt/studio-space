# Archive: Service Visibility + Server Guards
Date: 2025-09-05
Authors: Dev (implemented), Admin (configured)

Summary
- Implemented feature flags for `studio` and `coworking` services across the app.
- Navbar now hides links for disabled services (server-provided initial state + client refresh).
- Server-side guards added to service pages to prevent direct URL access when disabled.
- Client UI kept in separate client components; pages dynamically import them after guard check.

Files changed / added
- Modified: `components/navbar.tsx` — accepts server `services` prop, initializes client state from it, fetches `/api/settings/services` and filters nav items (desktop + mobile).
- Modified: `app/[locale]/layout.tsx` — loads service flags from DB (Prisma) and passes `services={...}` to `Navbar`.
- Modified: `app/[locale]/coworking/page.tsx` — server guard: reads `services.coworking.enabled` and renders server "Service unavailable" when disabled; dynamically imports `CoworkingClient`.
- Added: `app/[locale]/coworking/CoworkingClient.tsx` — client UI for coworking.
- Modified: `app/[locale]/studio/page.tsx` — server guard: reads `services.studio.enabled` and renders server "Service unavailable" when disabled; dynamically imports `StudioClient`.
- Added: `app/[locale]/studio/StudioClient.tsx` — client UI for studio.
- No changes to `app/api/settings/services/route.ts` (existing GET/PUT used).

Why this approach
- Server-side initial state (layout) prevents flashing disabled links on reload and reduces hydration mismatch.
- Server guards (page-level) prevent bypassing flags via direct URL; client-side nav filter improves UX.
- Dynamic imports keep client modules from being evaluated until server-side guard passes.

Verification performed
- Confirmed `app/api/settings/services` exists and returns shape: { studio: { enabled: boolean }, coworking: { enabled: boolean } }.
- Navbar receives server `services` and hides links after initial render; client fetch keeps state fresh.
- Visiting `/studio` or `/coworking` when disabled renders server-side "Service unavailable" message (no 404 RSC fallback).
- Searched for stray `notFound()` / `redirect()` — only app 404 page remains.

Manual test instructions
1. Restart dev server (required after server-side edits): stop and run `npm run dev`.
2. Confirm API: `curl -s http://localhost:3000/api/settings/services | jq .`
3. Disable coworking in admin (or via DB): set `services.coworking.enabled = \"false\"`.
4. Hard-refresh site:
   - Navbar should not show coworking link on reload (desktop + mobile).
   - Visiting `/coworking` should show the server "Service unavailable" message.
5. Re-enable and confirm page accessible again.

Rollback notes
- Revert the four page/component files above to prior commits to remove guards.
- If you prefer redirect instead of server message, change page guards to `redirect()` or middleware.

Recommendations / next steps
- Extract a small shared helper `lib/settings.ts` for reading service flags from Prisma (DRY).
- Add an integration/e2e test toggling flags and verifying nav + page behavior.
- Consider middleware-based gating if many routes require the same guard (or redirects).

---

Archive created.,
