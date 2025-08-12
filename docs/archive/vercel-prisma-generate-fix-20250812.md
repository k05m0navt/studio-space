# Task Archive: Vercel Prisma Client Generation Fix

## Metadata
- **Complexity**: Level 1
- **Type**: Deployment Fix
- **Date Completed**: 2025-08-12
- **Related Tasks**: Memory Bank tasks.md → Deployment Fixes

## Summary
Vercel builds failed due to Prisma Client not being generated (cached dependencies). We ensured Prisma Client generation on every deploy by adding `prisma generate` to `postinstall` and prefixing the `build` script, preventing outdated client issues.

## Requirements
- Ensure Prisma Client is generated during Vercel install/build.
- Keep Prisma output path stable at `app/generated/prisma`.

## Implementation
### Approach
- Update `package.json` scripts:
  - `postinstall`: `prisma generate`
  - `build`: `prisma generate && next build`
- Commit changes on `dev` branch.

### Files Changed
- `package.json`: add `postinstall`, update `build`.
- `memory-bank/reflection.md`: add deployment reflection section.
- `memory-bank/tasks.md`: add Deployment Fixes entry.

## Testing
- Rerun build on Vercel (after merging `dev` → `master` or switching Vercel to deploy `dev`).
- Verify no Prisma initialization errors in logs.

## Lessons Learned
- Vercel caching can skip Prisma generation; always generate client in CI/CD.
- Align deployment branch with active development to avoid drift.

## References
- Reflection: memory-bank/reflection.md (Deployment Reflection section)
- Prisma on Vercel: https://pris.ly/d/vercel-build
