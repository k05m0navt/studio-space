-- Migration: add composite index on Booking(createdAt, type, status)
-- Run this migration against your production/staging database to improve performance

CREATE INDEX IF NOT EXISTS idx_booking_createdAt_type_status
ON "Booking" ("createdAt", "type", "status");

-- Note: If your Booking table is in a different schema, adjust the table name accordingly.
