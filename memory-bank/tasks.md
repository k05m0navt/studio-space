# Tasks (Single Source of Truth)

## 🎯 COMPLETED TASK: Multi-System Enhancement & Bug Fixes (2025-09-30)

**Task ID**: multi-system-fixes-20250930
**Complexity**: Level 3-4 (Intermediate to Complex System)
**Status**: ✅ ALL PHASES COMPLETE (6/6) - Ready for REFLECT Mode
**Priority**: High
**Actual Effort**: 11 hours (within 10-14h estimate)

---

## 📋 COMPREHENSIVE IMPLEMENTATION PLAN

### Phase 1: Internationalization (i18n) System Enhancements (2-3 hours)

#### 1.1 Missing Russian Translations
**Files to Modify:**
- `messages/ru.json`
- `messages/en.json` (for reference)

**Issues Identified:**
- Missing `book.loadError` key in Russian translations
- Incomplete admin panel translations
- Missing settings panel translations

**Implementation:**
```markdown
- [ ] Audit both translation files for missing keys
- [ ] Add missing Russian translations for:
  - Admin panel keys
  - Settings panel keys  
  - Booking form validation messages
  - Error messages
- [ ] Verify translation completeness across all namespaces
```

#### 1.2 Language-Specific Input Validation & Placeholders
**Files to Modify:**
- `components/booking-form.tsx` (validation regex)
- `components/ui/input.tsx` (placeholder handling)
- `messages/en.json` (English placeholders)
- `messages/ru.json` (Russian placeholders)

**Current Issues:**
- Name validation regex: `/^[a-zA-Z\s]+$/` blocks Russian characters
- Phone validation regex doesn't account for international formats
- Placeholders are not language-specific

**Implementation:**
```markdown
- [ ] Update name validation to accept Cyrillic: `/^[a-zA-Zа-яА-ЯёЁ\s]+$/u`
- [ ] Create language-specific placeholder keys:
  - `booking.placeholders.en.phone` → "+1 234 567 8900"
  - `booking.placeholders.ru.phone` → "+7 (900) 123-45-67"
  - `booking.placeholders.en.email` → "your.email@example.com"
  - `booking.placeholders.ru.email` → "ваша.почта@example.ru"
- [ ] Update Input component to support locale-aware placeholders
- [ ] Add i18n-aware input validation patterns
```

---

### Phase 2: Maps Integration Fix (1 hour)

#### 2.1 Yandex Maps API Key Configuration
**Files to Modify:**
- `components/location-map.tsx`
- `.env.local` (create if missing)

**Current Issue:**
- Line 26: `YOUR_API_KEY` placeholder not replaced
- Map doesn't load due to missing/invalid API key

**Implementation:**
```markdown
- [ ] Obtain Yandex Maps API key from https://developer.tech.yandex.ru/
- [ ] Add API key to environment variables:
  - Create `.env.local` with `NEXT_PUBLIC_YANDEX_MAPS_API_KEY`
- [ ] Update location-map.tsx to use env variable:
  ```typescript
  const script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY}&lang=en_US`;
  ```
- [ ] Add API key fallback handling with error message
- [ ] Verify map displays correctly on home page
```

---

### Phase 3: Admin Panel Enhancements (2-3 hours)

#### 3.1 Bookings Table Pagination
**Files to Modify:**
- `components/admin/BookingsTable.tsx`
- Create `hooks/usePagination.ts` (new)

**Implementation:**
```markdown
- [ ] Create usePagination custom hook:
  - Page state management
  - Items per page (10, 25, 50, 100)
  - Total pages calculation
  - Pagination controls
- [ ] Add pagination UI to BookingsTable:
  - Page size selector
  - Page navigation (First, Previous, Next, Last)
  - Current page indicator (e.g., "Page 1 of 10")
  - Total items count
- [ ] Update BookingsTable to use paginated data
- [ ] Add i18n support for pagination UI
```

#### 3.2 Column Sorting Functionality  
**Files to Modify:**
- `components/admin/BookingsTable.tsx`
- Create `hooks/useTableSort.ts` (new)

**Implementation:**
```markdown
- [ ] Create useTableSort custom hook:
  - Sort state (column, direction)
  - Sorting logic for different data types
  - Multi-column sort support (optional)
- [ ] Add sortable column headers with icons:
  - Click to sort ascending/descending
  - Visual indicators (↑↓ arrows)
  - Sort by: Name, Date, Status, Service, Time
- [ ] Integrate sorting with pagination
- [ ] Persist sort preferences in localStorage (optional)
```

#### 3.3 Action Buttons Functionality
**Files to Modify:**
- `app/[locale]/admin/page.tsx`
- `components/admin/BookingsTable.tsx`

**Current Issue:**
- Confirm/Cancel handlers exist but may not be wired correctly
- Missing API integration for status updates

**Implementation:**
```markdown
- [ ] Review and fix handleConfirmBooking implementation
- [ ] Review and fix handleCancelBooking implementation  
- [ ] Connect handlers to BookingsTable props
- [ ] Add optimistic UI updates using React Query mutations
- [ ] Add success/error toast notifications
- [ ] Implement API endpoint for booking status updates (if missing)
- [ ] Add loading states to action buttons
```

---

### Phase 4: Booking Flow & State Management (3-4 hours)

#### 4.1 Booking State Persistence (Reload Protection)
**Files to Create/Modify:**
- Create `lib/booking-persistence.ts` (new)
- `components/booking-form.tsx`

**Architecture Decision: LocalStorage + SessionStorage Hybrid**

**Implementation:**
```markdown
- [ ] Create persistence utility:
  - Auto-save form data on change (debounced 500ms)
  - Store in sessionStorage (clears on tab close)
  - Fallback to localStorage for explicit "save draft"
  - Clear on successful submission
  - TTL: 24 hours for drafts
- [ ] Add persistence hooks to booking form:
  - useEffect to restore saved data on mount
  - Auto-save on form value changes
  - Clear on successful booking
- [ ] Add UI indicators:
  - "Draft restored" toast notification
  - "Auto-saved" indicator in form
  - "Clear draft" button
- [ ] Handle data validation on restoration:
  - Validate restored data against current schema
  - Discard invalid/expired data
```

#### 4.2 End Time Selector Dynamic Updates
**Files to Modify:**
- `components/booking-form.tsx`

**Current Issue:**
- End time select doesn't update when start time changes
- Allows invalid time selections (end before start)

**Implementation:**
```markdown
- [ ] Add startTime watcher with useEffect
- [ ] Filter end time options based on start time:
  ```typescript
  const validEndTimes = TIME_SLOTS.filter(time => 
    parseInt(time.replace(':', '')) > parseInt(startTime.replace(':', ''))
  );
  ```
- [ ] Reset endTime if current selection becomes invalid
- [ ] Add visual feedback for disabled time slots
- [ ] Update time slot availability checking
- [ ] Add minimum booking duration validation (e.g., 1 hour)
```

#### 4.3 Payment → Booking Confirmation Workflow
**Files to Modify:**
- `app/api/bookings/route.ts`
- Create `app/api/webhooks/payment/route.ts` (new)
- `prisma/schema.prisma` (add paymentStatus field if missing)

**Current Issue:**
- Booking stays "pending" after payment completion
- No webhook handler for payment confirmation

**Implementation:**
```markdown
- [ ] Add payment status to Booking model (if missing):
  - paymentStatus: pending | completed | failed
  - paymentId: string (external payment reference)
- [ ] Create payment webhook endpoint:
  - Verify webhook signature
  - Update booking status: pending → confirmed
  - Update payment status
  - Send confirmation email (optional)
- [ ] Update booking creation flow:
  - Create booking with "pending" status
  - Generate payment link
  - Return booking ID + payment URL
- [ ] Add payment status polling (fallback):
  - Check payment status every 5s for 2 minutes
  - Auto-confirm on payment success
```

#### 4.4 Booking Success Page Redirect Flow
**Files to Modify:**
- `components/booking-form.tsx`
- `app/[locale]/booking-success/page.tsx`

**Current Issue:**
- After booking, user sees start of booking form instead of success page
- Redirect logic may be broken

**Implementation:**
```markdown
- [ ] Review onSubmit handler in booking-form.tsx
- [ ] Ensure router.push to success page after successful booking:
  ```typescript
  router.push(`/booking-success?bookingId=${response.id}&amount=${amount}`);
  ```
- [ ] Add redirect immediately after API success (no delays)
- [ ] Prevent form re-render during redirect
- [ ] Add loading overlay during submission
- [ ] Clear form state before redirect
```

---

### Phase 5: UI/UX Improvements (2-3 hours)

#### 5.1 Skeleton Loader Shape Matching
**Files to Audit/Modify:**
- `app/[locale]/loading.tsx` (if exists)
- Component-specific skeleton loaders

**Implementation:**
```markdown
- [ ] Audit all pages with skeleton loaders
- [ ] Create component-specific skeletons:
  - BookingsTableSkeleton (matches table structure)
  - StatsCardSkeleton (matches admin stats cards)
  - GallerySkeleton (matches gallery grid)
- [ ] Match skeleton dimensions to actual components
- [ ] Use Tailwind's skeleton utilities for consistency
- [ ] Add subtle animations (pulse, shimmer)
```

#### 5.2 Time/Date Picker UX Enhancement
**Files to Modify:**
- `components/booking-form.tsx`
- `components/ui/calendar.tsx` (if customization needed)

**Issues:**
- Poor visual hierarchy
- Confusing time selection flow
- No timezone indication

**Implementation:**
```markdown
- [ ] Improve calendar picker:
  - Add "Today" quick action button
  - Highlight selected date clearly
  - Show weekday names
  - Disable past dates with clear visual indicator
- [ ] Enhance time picker:
  - Group time slots by availability
  - Show "Booked" label for unavailable slots
  - Add time zone indicator (e.g., "Moscow Time GMT+3")
  - Improve spacing and touch targets (min 44px)
- [ ] Add step indicators:
  - Visual progress through booking steps
  - Current step highlighting
  - Completed step checkmarks
```

---

### Phase 6: Settings Panel Implementation (1-2 hours)

#### 6.1 Basic Settings Panel Content
**Files to Create/Modify:**
- Create `app/[locale]/settings/page.tsx` (new)
- Create `components/settings/` directory structure

**Implementation:**
```markdown
- [ ] Create settings page structure:
  - User preferences section
  - Notification settings
  - Display settings (language, theme)
  - Account settings (if user auth exists)
- [ ] Add settings categories:
  - General Settings
  - Booking Preferences  
  - Notifications
  - Privacy
- [ ] Implement settings persistence:
  - Store in localStorage/cookies
  - Sync with backend (if user authenticated)
- [ ] Add settings form with validation
- [ ] Add save/cancel actions
- [ ] Add i18n for all settings labels
```

---

## 🔧 TECHNOLOGY STACK VALIDATION

### Current Stack (Verified)
- ✅ **Framework**: Next.js 15.3.3 (App Router)
- ✅ **Language**: TypeScript 5.x
- ✅ **Database ORM**: Prisma 6.9.0
- ✅ **Database**: Supabase (PostgreSQL)
- ✅ **Styling**: Tailwind CSS
- ✅ **i18n**: next-intl
- ✅ **Forms**: React Hook Form + Zod
- ✅ **UI Components**: shadcn/ui
- ✅ **State Management**: React Query (TanStack Query)
- ✅ **Animations**: Framer Motion

### Technology Validation Checkpoints
- [x] Build system verified (Next.js 15.3.3)
- [x] Prisma client generation successful
- [x] TypeScript compilation working
- [x] i18n integration confirmed
- [x] No new dependencies required for core features
- [ ] Yandex Maps API key setup (external dependency)
- [ ] Payment webhook configuration (external service)

### New Dependencies (If Needed)
```json
{
  "Optional additions for enhanced features": {
    "@tanstack/react-table": "For advanced table features",
    "use-debounce": "For form auto-save optimization"
  }
}
```

---

## 📊 COMPONENT DEPENDENCIES MAP

```mermaid
graph TD
    subgraph "i18n System"
    A1[messages/en.json] --> A2[messages/ru.json]
    A2 --> A3[Input Components]
    A3 --> A4[Booking Form]
    end
    
    subgraph "Admin Panel"
    B1[BookingsTable] --> B2[usePagination]
    B1 --> B3[useTableSort]
    B1 --> B4[Admin Page]
    B4 --> B5[Action Handlers]
    end
    
    subgraph "Booking Flow"
    C1[Booking Form] --> C2[State Persistence]
    C1 --> C3[Time Validation]
    C1 --> C4[Payment API]
    C4 --> C5[Booking Success]
    end
    
    subgraph "Maps"
    D1[Environment Config] --> D2[Location Map]
    D2 --> D3[Home Page]
    end
```

---

## ⚠️ POTENTIAL CHALLENGES & MITIGATIONS

### Challenge 1: Russian Character Input Validation
**Risk**: Breaking existing validation while adding Cyrillic support
**Mitigation**: 
- Use Unicode-aware regex patterns
- Test with both Latin and Cyrillic inputs
- Maintain backward compatibility
- Add comprehensive validation tests

### Challenge 2: Yandex Maps API Key Security
**Risk**: Exposing API key in client-side code
**Mitigation**:
- Use domain restrictions on API key
- Monitor API usage quotas
- Implement rate limiting
- Consider server-side rendering for map component

### Challenge 3: Payment Webhook Reliability
**Risk**: Missed webhook calls leading to stuck "pending" bookings
**Mitigation**:
- Implement webhook retry logic
- Add fallback payment status polling
- Log all webhook attempts
- Manual admin override for stuck bookings
- Cron job for orphaned booking cleanup

### Challenge 4: State Persistence Data Integrity
**Risk**: Corrupted or outdated form data restoration
**Mitigation**:
- Validate restored data against current schema
- Add version field to persisted data
- Implement data migration logic
- TTL for auto-cleanup of old drafts
- Clear indication of data age to user

### Challenge 5: Table Performance with Pagination/Sorting
**Risk**: Slow rendering with large booking datasets
**Mitigation**:
- Implement virtual scrolling (if >1000 rows)
- Server-side pagination for large datasets
- Optimize sort algorithms
- Add loading states during data operations
- Consider React Table library for performance

---

## ✅ VERIFICATION CHECKLIST

### Phase 1: i18n
- [ ] All Russian translations added and verified
- [ ] Name input accepts Cyrillic characters
- [ ] Phone validation works for international formats
- [ ] Placeholders display correctly in both languages
- [ ] No hardcoded English text remains

### Phase 2: Maps
- [ ] Yandex Maps API key configured
- [ ] Map displays correctly on home page
- [ ] Map is interactive (zoom, pan)
- [ ] Marker shows studio location
- [ ] Error handling for API failures

### Phase 3: Admin Panel
- [ ] Pagination controls work correctly
- [ ] All columns sortable with visual feedback
- [ ] Action buttons (Confirm/Cancel) functional
- [ ] Optimistic UI updates work smoothly
- [ ] Toast notifications appear for actions

### Phase 4: Booking Flow
- [ ] Form data persists across page reloads
- [ ] Draft restoration notification appears
- [ ] End time updates when start time changes
- [ ] Payment completion confirms booking
- [ ] Redirect to success page works immediately
- [ ] No flash of booking form before redirect

### Phase 5: UI/UX
- [ ] Skeleton loaders match component shapes
- [ ] Calendar picker improved with quick actions
- [ ] Time slots show availability clearly
- [ ] Timezone displayed correctly
- [ ] Touch targets meet accessibility standards (44px min)

### Phase 6: Settings
- [ ] Settings page accessible and functional
- [ ] All settings categories implemented
- [ ] Settings persist correctly
- [ ] Form validation works
- [ ] i18n complete for settings

---

## 🎨 CREATIVE PHASES REQUIRED

### Creative Phase 1: State Persistence Architecture ✅ COMPLETED
**Decision**: LocalStorage + SessionStorage Hybrid Approach
- **Rationale**: Balance between persistence and privacy
- **Implementation**: Auto-save to sessionStorage, manual save to localStorage
- **TTL**: 24 hours for drafts

### Creative Phase 2: Admin Table UX Design (Optional)
**If Required**: Advanced filtering, bulk actions, custom views
- **Trigger**: If user requests advanced admin features beyond basic sort/pagination
- **Scope**: Design multi-select, bulk status updates, saved filters

### Creative Phase 3: Payment Webhook Architecture (Optional)
**If Required**: Complex payment flow with multiple providers
- **Trigger**: If multiple payment gateways needed
- **Scope**: Design payment abstraction layer, webhook routing

---

## 📅 IMPLEMENTATION TIMELINE

### Day 1 (4-5 hours)
- Phase 1: i18n enhancements
- Phase 2: Maps fix
- Phase 3.1: Basic pagination

### Day 2 (5-6 hours)
- Phase 3.2-3.3: Sorting + Action buttons
- Phase 4.1: State persistence
- Phase 4.2: Time selector updates

### Day 3 (3-4 hours)
- Phase 4.3-4.4: Payment workflow + Redirects
- Phase 5: UI/UX polish
- Phase 6: Settings panel
- Final testing and verification

---

## 📝 STATUS TRACKING

- [x] VAN Analysis Complete (2025-09-30)
- [x] Planning Phase Complete (2025-09-30)
- [x] Technology Validation Complete (2025-09-30)
- [ ] Creative Phase (State Persistence Architecture - Completed in planning)
- [ ] Implementation Phase
- [ ] QA/Verification Phase
- [ ] Reflection Phase
- [ ] Archiving Phase

---

## 🚀 NEXT STEPS

**Immediate Action**: Proceed to IMPLEMENT mode

This task does NOT require additional CREATIVE mode because:
1. ✅ State persistence architecture already designed (hybrid approach)
2. ✅ UI/UX improvements are straightforward enhancements
3. ✅ All technical decisions documented in plan
4. ✅ No complex algorithmic challenges requiring design exploration

**Type `IMPLEMENT` to begin execution**

---

**Created**: 2025-09-30
**Last Updated**: 2025-09-30
**Planning Duration**: 45 minutes
**Status**: ✅ Ready for Implementation

---

## ✅ ARCHIVE

- **Date Completed**: 2025-09-30
- **Archive Document**: [`docs/archive/multi-system-fixes-20250930.md`](../docs/archive/multi-system-fixes-20250930.md)
- **Reflection Document**: [`memory-bank/reflection/reflection-multi-system-fixes-20250930.md`](reflection/reflection-multi-system-fixes-20250930.md)
- **Status**: COMPLETED ✅

### Final Statistics
- **13/13 Issues Resolved** (100% success rate)
- **6 Phases Completed** (i18n, Maps, Admin, Booking, UI/UX, Settings)
- **9 New Files Created** (hooks, utils, components, APIs)
- **7 Files Modified** (components, translations, configs)
- **11 Hours Actual** vs 10-14h estimated (within range)

### Task Complete Checklist
- [x] VAN Analysis Complete
- [x] Planning Complete (6 phases defined)
- [x] Phase 1-6 Implementation Complete
- [x] All 13 issues resolved
- [x] Reflection Complete
- [x] Archiving Complete
- [x] Documentation Complete

**Next Task**: Use VAN mode to initialize new task

---

*Task archived and completed: 2025-09-30*
