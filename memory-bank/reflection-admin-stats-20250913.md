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
