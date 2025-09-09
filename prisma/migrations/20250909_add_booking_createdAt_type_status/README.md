Migration: add composite index on Booking(createdAt, type, status)

This migration contains a single SQL statement that creates a composite index to speed up counts and queries that filter by createdAt, type, and status.

Apply with:
  - `psql "$DIRECT_URL" -f migration.sql` (or use your DB tool)
  - OR use Prisma Migrate (`prisma migrate deploy`) after ensuring the migration folder matches Prisma's format.

Note: `prisma migrate dev --create-only` failed in this environment due to shadow DB issues; the SQL is provided for manual application.
