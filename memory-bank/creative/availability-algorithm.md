🎨🎨🎨 ENTERING CREATIVE PHASE: ALGORITHM (Booking Availability)

## Problem
Compute unavailable and available hourly slots (09:00–17:00) for a given date and type using bookings with status in ['pending','confirmed'].

## Options Analysis
### Option 1: On-demand query per date
- Pros: Simple; fresh data; no infra
- Cons: Per-request compute cost
- Complexity: Low; Time: 0.5 day

### Option 2: Precomputed daily availability table
- Pros: Fast reads
- Cons: Write-through complexity; invalidation
- Complexity: Medium; Time: 1–2 days

### Option 3: Redis cache per (date,type)
- Pros: Fast; scalable
- Cons: Adds infra; cache invalidation
- Complexity: Medium; Time: 1 day

## Decision
Use Option 1 for MVP.

## Implementation Guidelines
- Query `booking` where: type = input, date within [startOfDay,endOfDay], status in ['pending','confirmed']
- For each booking with `start_time`/`end_time`, mark [startHour, endHour) as unavailable
- allSlots = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
- Return `{ unavailableSlots: unique, availableSlots: allSlots - unavailable }`
- Validate inputs: ISO date, type enum

## Verification
- Overlaps merged; empty result => all available; invalid input => 400

🎨🎨🎨 EXITING CREATIVE PHASE
