# Archive: Admin performance improvements (2025-09-06)

## Summary
Batched settings read, added short TTL caches, paginated heavy endpoints (bookings/users), optimized client rendering (memoization, OptimizedImage, removed per-row animations), added debounced search, and prefetching to speed up Admin → Services and dashboard loads.

## Files changed
- app/api/settings/services/route.ts (batched read, cache)
- app/api/admin/stats/route.ts (safe selects, stats cache)
- app/api/admin/bookings/route.ts (pagination)
- app/api/admin/users/route.ts (pagination)
- hooks/useServiceToggle.ts (fetch timeout, refetchOnMount:false)
- app/[locale]/admin/page.tsx (prefetch, deferred loads, debounce search)
- components/admin/ServiceToggleCard.tsx (memo + OptimizedImage)
- components/admin/BookingsTable.tsx (new lightweight table)

## Decisions & rationale
- Batch DB requests for settings to reduce latency and DB round-trips.
- Use short in-memory TTL caches (services 60s, stats 30s) for low-staleness admin UX gains.
- Paginate large lists to avoid heavy payloads and reduce client render time.
- Move image previews to `OptimizedImage` (Next.js Image wrapper) for layout stability and lazy loading.
- Remove heavy per-row animations to reduce CPU during list rendering.

## Verification notes
- Local dev server tested: endpoints return expected shapes; no Prisma errors from missing columns.
- Manual interaction: Services tab renders immediately after login due to prefetch; bookings/users fetched on-demand with pagination.

## Next steps
1. Add UI pagination controls for bookings/users (client-side) — recommended.
2. Persist service image public URLs in settings to avoid per-request URL computation.
3. Consider Redis for cross-instance cache in production.

---
Archived at: 2025-09-06T22:07:22.124359Z
