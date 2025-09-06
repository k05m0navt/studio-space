# Archive: Service Pricing & Images (2025-09-06)

## Summary
Added per-service pricing (price, currency, unit) and admin UI to manage these settings. Implemented image upload/delete backed by Supabase storage (bucket `service-images`). Server computes booking `amount` (duration × rate) and stores `amount` and `currency` on Booking.

## Artifacts
- app/api/settings/services/route.ts (GET/PUT/POST/DELETE)
- components/admin/ServiceToggleCard.tsx (price/currency/unit + image UI)
- hooks/useServiceToggle.ts, hooks/useServicePricing.ts
- app/api/bookings/route.ts (booking amount computation)
- prisma/schema.prisma (Booking.amount, Booking.currency)

## Verification
- Admin can set price/currency/unit and upload/delete images.
- Booking review shows computed total; booking row stores amount and currency.
- Settings API returns public URLs for images.

## Next steps
- Run Prisma migration: `npx prisma migrate dev --name add-booking-pricing`
- Create Supabase bucket `service-images` and set policy.
- Add CI smoke tests for service settings and booking price computation.

Archived: 2025-09-06 17:52:44Z
