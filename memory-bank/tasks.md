# Tasks (Single Source of Truth)

## 🎯 CURRENT TASK: Project Cleanup & Optimization (2025-09-29)

**Task ID**: project-cleanup-optimization-20250929
**Complexity**: Level 2 (Simple Enhancement)
**Status**: Planning Complete → Ready for Implementation
**Priority**: High
**Estimated Effort**: Medium (1 hour)

---

## 📋 IMPLEMENTATION PLAN: Option B (Cleanup + Linting)

### Phase 1: Repository Cleanup (15 minutes)

#### Step 1.1: Remove Junk Files (5 min)
**Files to Remove**:
- [ ] `.DS_Store` (6KB) - macOS artifact at root
- [ ] `dev.log` (54KB) - development log file
- [ ] `tsconfig.tsbuildinfo` (242KB) - build cache
- [ ] `.reports/` directory (1.3MB) - old audit reports
- [ ] `memory-bank/tasks.md.backup` (28KB) - redundant backup

**Command**:
```bash
rm .DS_Store dev.log tsconfig.tsbuildinfo
rm -rf .reports
rm memory-bank/tasks.md.backup
```

#### Step 1.2: Update .gitignore (2 min)
**File**: `.gitignore`

**Add Missing Entries**:
```gitignore
# Build artifacts
*.tsbuildinfo

# Development files
dev.log

# Reports
.reports/
```

**Verification**: Confirm .DS_Store is already in .gitignore (line 24)

#### Step 1.3: Clean Memory Bank (8 min)
**Actions**:
- [ ] Move 7 reflection files to `memory-bank/archive/reflections/`
  - reflection-admin-stats-20250913.md
  - reflection-booking-pricing-20250910.md
  - reflection-booking-admin-20250910.md
  - reflection-admin-stats-20250909.md
  - reflection-booking-success-20250909.md
  - reflection-i18n-20250908.md
  - reflection-service-management-20250906.md
  - reflection-service-management-20250905.md
  
- [ ] Archive general reflection.md → `memory-bank/archive/reflection-general.md`

- [ ] Create consolidated archive index: `memory-bank/archive/README.md`

---

### Phase 2: Fix Linting Errors (45 minutes)

#### Step 2.1: Remove Dead Code (10 min)

##### File 1: `app/api/auth/route.ts` (COMPLETE CLEANUP)
**Issue**: File contains unused imports and dead code (auth logic moved to dedicated routes)

**Action**: Clean up to minimal endpoint
```typescript
// Remove lines 2-5 (unused imports: bcrypt, jwt, prisma)
// Remove lines 7-16 (unused schemas)
// Keep only lines 1, 18-68 (NextRequest/NextResponse + 404 handler)
```

**Lines to Remove**:
- Line 2: `import bcrypt from 'bcryptjs';`
- Line 3: `import jwt from 'jsonwebtoken';`
- Line 4: `import { z } from 'zod';`
- Line 5: `import { prisma } from '@/lib/prisma';`
- Lines 7-16: `loginSchema` and `registerSchema` definitions

##### File 2: `app/[locale]/admin/page.tsx` (REMOVE UNUSED HANDLERS)
**Issue**: Unused functions `handleConfirmBooking` and `handleCancelBooking` (lines 446-454)

**Action**: Remove both function definitions
- Line 446-449: `handleConfirmBooking` function
- Line 451-454: `handleCancelBooking` function

**Note**: These were intended for optimistic UI but never connected to UI elements

##### File 3: `app/api/admin/bookings/route.ts`
**Issue**: Unused `user` variable in destructuring (line 5)

**Action**: Remove `user` from destructuring or use it for logging

##### File 4: `app/api/admin/users/route.ts`
**Issue**: Unused `user` variable in destructuring (line 4)

**Action**: Remove `user` from destructuring

##### File 5: `app/[locale]/admin/page.tsx` (ERROR HANDLING)
**Issue**: Unused `err` variable (line 155)

**Action**: Replace with underscore `_err` to indicate intentionally unused

---

#### Step 2.2: Fix TypeScript `any` Types (25 min)

##### Category A: Page Props (Next.js 15 App Router Pattern)
**Files**:
- `app/[locale]/book/page.tsx` (line 4)
- `app/[locale]/booking-success/page.tsx` (line 18)
- `app/[locale]/coworking/page.tsx` (line 5)
- `app/[locale]/studio/page.tsx` (line 5)

**Current Pattern**:
```typescript
export default async function PageName(props: any) {
  const { params } = await props
}
```

**Fix**: Define proper type for Next.js 15 async params
```typescript
type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function PageName(props: PageProps) {
  const { params } = await props
}
```

##### Category B: Stats Cache Type
**File**: `app/api/admin/stats/route.ts` (line 4)

**Current**:
```typescript
let _statsCache: { data: any; expiresAt: number } | null = null;
```

**Fix**: Define proper StatsData type
```typescript
type StatsData = {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  utilizationRate: number;
  studioBookings: number;
  coworkingBookings: number;
  weekOverWeekGrowth: number;
  revenueByService: { studio: number; coworking: number };
};

let _statsCache: { data: StatsData; expiresAt: number } | null = null;
```

##### Category C: Type Assertions in Bookings
**File**: `app/api/bookings/route.ts`

**Issue 1** (line 182):
```typescript
const unit = (unitSetting?.value as any) ?? 'hour';
```

**Fix**:
```typescript
const unit = (unitSetting?.value as string) ?? 'hour';
```

**Issue 2** (line 186):
```typescript
const computed = computeAmount({ unit: unit as any, rate, hours });
```

**Fix**:
```typescript
const computed = computeAmount({ 
  unit: unit as 'hour' | 'day' | 'month', 
  rate, 
  hours 
});
```

**Issue 3** (line 239 - error handling):
```typescript
const message = (error && (error as any).message) ? (error as any).message : 'Internal server error';
```

**Fix**:
```typescript
const message = error instanceof Error ? error.message : 'Internal server error';
```

##### Category D: Bootstrap Auth Types
**File**: `app/api/auth/bootstrap/route.ts` (lines 22, 32)

**Action**: Add proper error types or use `unknown` instead of `any`

---

#### Step 2.3: Fix Image Optimization Warning (10 min)

##### File: `app/[locale]/booking-success/page.tsx`
**Issue**: Using `<img>` tag instead of Next.js `<Image />` (line 103)

**Current**:
```typescript
<img src={qrDataUrl} alt={t('payment.qrAlt')} className="w-48 h-48 mx-auto sm:mx-0 rounded-md shadow" />
```

**Fix**: Replace with Next.js Image (for data URLs, regular img is acceptable, but add eslint-disable)
```typescript
{/* eslint-disable-next-line @next/next/no-img-element */}
<img 
  src={qrDataUrl} 
  alt={t('payment.qrAlt')} 
  className="w-48 h-48 mx-auto sm:mx-0 rounded-md shadow" 
/>
```

**Note**: QR code is a data URL generated client-side, so `<Image />` won't work. Suppress warning instead.

**Also**: Remove unused eslint-disable at line 46

---

## 🔧 TECHNOLOGY VALIDATION

### Technology Stack
- ✅ **Framework**: Next.js 15.3.3 (App Router)
- ✅ **Language**: TypeScript 5.x
- ✅ **Runtime**: Node 18+
- ✅ **Build Tool**: Next.js build system
- ✅ **Linting**: ESLint with Next.js config

### Technology Validation Checkpoints
- [x] Build configuration validated (npm run build: ✅ SUCCESS)
- [x] ESLint configuration present (eslint.config.mjs exists)
- [x] TypeScript strict mode enabled (tsconfig.json checked)
- [x] All dependencies installed (node_modules present)
- [x] No new dependencies required

**Validation Result**: ✅ **PASSED** - No technology changes needed

---

## 📊 FILES TO MODIFY

### Cleanup Phase (5 files/directories removed)
1. `.DS_Store` (delete)
2. `dev.log` (delete)
3. `tsconfig.tsbuildinfo` (delete)
4. `.reports/` (delete directory)
5. `memory-bank/tasks.md.backup` (delete)

### Code Quality Phase (11 files modified)
1. `.gitignore` (add entries)
2. `app/api/auth/route.ts` (remove dead code)
3. `app/[locale]/admin/page.tsx` (remove unused handlers + fix err)
4. `app/api/admin/bookings/route.ts` (remove unused var)
5. `app/api/admin/users/route.ts` (remove unused var)
6. `app/[locale]/book/page.tsx` (fix any type)
7. `app/[locale]/booking-success/page.tsx` (fix any type + img warning)
8. `app/[locale]/coworking/page.tsx` (fix any type)
9. `app/[locale]/studio/page.tsx` (fix any type)
10. `app/api/admin/stats/route.ts` (fix any type)
11. `app/api/bookings/route.ts` (fix any types)

### Memory Bank Reorganization
1. Create `memory-bank/archive/reflections/` directory
2. Move 8 reflection files to archive
3. Create `memory-bank/archive/README.md` index

---

## ⚠️ POTENTIAL CHALLENGES & MITIGATIONS

### Challenge 1: TypeScript Type Errors After Changes
**Mitigation**: 
- Test build after each file modification
- Use proper Next.js 15 type patterns for async params
- Reference existing working pages for type examples

### Challenge 2: Accidentally Breaking Working Features
**Mitigation**:
- Only remove truly unused code (verified via linter)
- Keep all functional logic intact
- Run full build verification after changes

### Challenge 3: Git History Cleanup
**Mitigation**:
- Junk files should be removed but not retroactively from git history
- Add to .gitignore to prevent future commits
- Clear working directory only

### Challenge 4: Memory Bank File References
**Mitigation**:
- Check for any links to moved reflection files
- Update archive index with proper references
- Maintain file naming consistency

---

## ✅ VERIFICATION CHECKLIST

### Post-Cleanup Verification
- [ ] All junk files removed from working directory
- [ ] `.gitignore` updated with new entries
- [ ] No junk files appear in `git status`
- [ ] Memory Bank organized with archive directory

### Post-Linting Verification
- [ ] `npm run lint` shows 0 errors
- [ ] `npm run build` completes successfully
- [ ] TypeScript compilation has no errors
- [ ] All tests pass (if any exist)

### Code Quality Verification
- [ ] No `any` types in modified files
- [ ] No unused variables
- [ ] No dead code
- [ ] All imports used
- [ ] Proper type definitions throughout

---

## 🎯 EXPECTED OUTCOMES

### Before:
- ❌ 22 linting errors across 11 files
- ❌ 1.5MB of junk files in repository
- ❌ Cluttered Memory Bank (8 loose reflection files)
- ❌ Incomplete .gitignore

### After:
- ✅ **0 linting errors** (production-ready code)
- ✅ **Clean repository** (all junk removed)
- ✅ **Organized Memory Bank** (archived reflections)
- ✅ **Complete .gitignore** (prevents future clutter)

### Quality Metrics:
- **Code Quality**: Enterprise-grade (zero linting warnings)
- **Build Status**: ✅ Clean successful build
- **TypeScript Coverage**: 100% typed (no `any`)
- **Repository Size**: -1.5MB (cleanup savings)

---

## 🚀 NEXT STEPS AFTER COMPLETION

### Option A: Proceed to QA Mode
- Verify all changes work correctly
- Test build and deployment readiness
- Validate linting passes

### Option B: Proceed to Reflection
- Document lessons learned
- Update progress.md
- Archive this task

### Option C: Continue with Phase 3 (Testing)
- Set up Jest + RTL
- Write initial test suite
- Add test scripts to package.json

---

## 📝 CREATIVE PHASES REQUIRED
**None** - This is straightforward code cleanup and type safety improvements

---

## 📅 STATUS TRACKING

- [x] VAN Analysis Complete (2025-09-29)
- [x] Planning Complete (2025-09-29)
- [x] Technology Validation Complete (2025-09-29)
- [ ] Implementation Started
- [ ] Phase 1: Cleanup Complete
- [ ] Phase 2: Linting Fixes Complete
- [ ] Verification Complete
- [ ] Reflection Complete
- [ ] Archiving Complete

---

## 🎬 READY TO IMPLEMENT

**Estimated Time**: 1 hour (15 min cleanup + 45 min linting)
**Risk Level**: Low (no architectural changes)
**Impact**: High (production-ready code quality)

**Type `IMPLEMENT` to begin execution**

---

