# Archive: CONTRIBUTING & Husky Integration

**Date:** 2025-10-03
**Summary:** Added project CONTRIBUTING guidelines, Husky pre-commit hook running `lint-staged`, `prepare-commit-msg` hook to prepend a contributing checklist, and agent-facing rules in `memory-bank` to ensure automated agents follow contribution conventions.

## Files created/modified
- `CONTRIBUTING.md` (repo root)
- `memory-bank/contributing.md` (agent-facing)
- `.husky/pre-commit` (runs `lint-staged`)
- `.husky/prepare-commit-msg` (prepends checklist to commits)
- `package.json` (added `prepare` script, husky & lint-staged devDeps, lint-staged config)
- `memory-bank/activeContext.md` (agent rule pointer)
- `memory-bank/tasks.md` (task updated)
- `memory-bank/progress.md` (progress updated)
- `memory-bank/reflection/reflection-contributing-husky-20251003.md` (reflection)

## Reflection
(See memory-bank/reflection/reflection-contributing-husky-20251003.md)

## Install & verification
1. Run `yarn install` (or `npm install`).
2. Run `npm run prepare` (or `yarn prepare`) to install husky hooks.
3. Verify by staging a small change and committing; hooks will run lint-staged and prepare-commit-msg will add the checklist.

