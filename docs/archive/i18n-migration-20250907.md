# ARCHIVE: i18n Migration (Partial)

**Date:** 2025-09-07

**Scope:** Incremental migration of the app to use `next-intl` for localization (English / Russian). This archive consolidates the reflection, implementation notes, and recommended next steps.

## Summary
The migration focused on auditing hard-coded strings, introducing a runtime-safe translation helper, and localizing high-impact UI and API messages. Work was done incrementally to avoid large, risky changes and to keep the application stable while rolling out translations.

## What was changed (high level)
- Added `lib/i18n.ts` helpers and a `safeTranslate` pattern for runtime fallbacks.
- Added `scripts/i18n-audit.js` and reporting (`.reports/i18n-audit.json`).
- Localized key components and pages:
  - `components/booking-form.tsx`, `components/navbar.tsx`, `components/ui/spinner.tsx`
  - `app/[locale]/studio/page.tsx`, `app/[locale]/faq/page.tsx`
  - `components/admin/ServiceManagementSection.tsx`, `components/admin/ServiceToggleCard.tsx`
- Replaced literal API messages with i18n keys in several API handlers and added `messages/en.json` and `messages/ru.json` entries for `api.errors` and `api.messages`.

## Outcomes
- Audit script available to find remaining hard-coded strings.
- Many high-visibility strings localized and `en`/`ru` message files updated.
- Defensive translation strategy (`safeTranslate`) prevents runtime crashes during phased rollout.

## Challenges
- Mixed server/client rendering required both `getMessages` and `useTranslations` patterns.
- Missing keys initially caused `MISSING_MESSAGE` errors; fixed by adding keys and safe fallbacks.

## Next steps
1. Finish remaining admin dialogs (`ServiceConfirmDialog`) and any remaining English copy in `ServiceToggleCard`.
2. Run the i18n audit, fix high-priority hits, and add CI check to fail on new hard-coded strings.
3. Add tests for key components to ensure message coverage.
4. Finalize translations with PM/translator for RU quality.

## Reference
- Reflection: `memory-bank/reflection-i18n-20250907.md`

