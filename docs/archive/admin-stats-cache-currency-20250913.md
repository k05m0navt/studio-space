# ARCHIVE: Admin Stats Cache Sync & Currency Formatting — 2025-09-13

# REFLECTION: Admin Stats & Currency Formatting

**Date:** 2025-09-13

**Summary:** Fixed stats cache mismatch so admin stats endpoint uses shared cache utilities; included service currency in the response and updated admin UI to format monthly revenue using the returned currency.

**Files changed:**
- `app/api/admin/stats/route.ts` — switched to shared cache and added currency to response
- `app/[locale]/admin/page.tsx` — added `currency` to `Stats` and formatted revenue with Intl

**Successes:**
- Stats cache invalidation now works when bookings are confirmed.
- Monthly revenue displays with the configured service currency instead of hardcoded `$`.

**Challenges:**
- Ensuring the UI and API agree on currency; chose to prefer studio currency then coworking then fallback to `RUB`.

**Next improvements:**
- Persist booking `amount` on confirmation to ensure SUM(amount) aggregate is accurate.
- Consider showing currency code instead of symbol if symbol mismatch is confusing.


## Full Changes

- Implemented shared cache usage in `app/api/admin/stats/route.ts` so `invalidateStatsCache()` clears the same cache used by stats endpoint.
- Added `currency` to stats payload and resolved display formatting in `app/[locale]/admin/page.tsx` using Intl.NumberFormat.

## Verification

- Manual: Confirmed booking via admin UI and clicked Refresh — monthly revenue updated to reflect confirmed booking (cache invalidated).
- TypeScript check: `yarn tsc --noEmit` (project tests typing environment unrelated warnings exist).

## Files

```
app/api/admin/stats/route.ts
app/[locale]/admin/page.tsx
memory-bank/reflection-admin-stats-20250913.md
```

---

**Archived on:** 2025-09-13T00:30:17.465481Z
