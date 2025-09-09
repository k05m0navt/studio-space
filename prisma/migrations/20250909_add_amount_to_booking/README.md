Migration: add_amount_to_booking

Files:
- migration.sql — SQL to add `amount` (DECIMAL(10,2)) and `currency` (TEXT) columns to the `Booking` table.

How to apply locally (development):
1. Ensure your `.env` DATABASE_URL points to a development database.
2. Run:

   npx prisma migrate dev --name add-amount-to-booking

   This will create and apply a migration based on `schema.prisma`. If you prefer to apply the raw SQL migration file instead, see the deploy instructions below.

How to apply in production (using raw SQL migration):
1. Ensure database backups are taken before applying schema changes.
2. Run the SQL in the `migration.sql` file against your Postgres database, for example:

   psql "$DATABASE_URL" -f prisma/migrations/20250909_add_amount_to_booking/migration.sql

3. Optionally, run `npx prisma migrate resolve --applied "20250909_add_amount_to_booking"` to mark the migration as applied in Prisma's migration history if you're managing migrations with Prisma.

Notes:
- This migration is intentionally additive and leaves columns nullable so it is backward compatible.
- If you use Prisma Migrate, prefer `npx prisma migrate dev` / `npx prisma migrate deploy` flows to keep Prisma migration history consistent.
