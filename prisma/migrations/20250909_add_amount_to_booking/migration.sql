-- Migration: add_amount_to_booking
-- Adds `amount` (DECIMAL) and `currency` (TEXT) columns to the Booking table.

BEGIN;

-- Add amount as DECIMAL(10,2) if it doesn't exist yet
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "amount" DECIMAL(10,2);

-- Add currency as text (nullable) if it doesn't exist yet
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "currency" TEXT;

COMMIT;
