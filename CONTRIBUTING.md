# Contributing

Thank you for contributing to Studio Space! Please follow these simple steps to make your contribution easy to review and merge.

- **Get the code**: Fork the repo and create a branch from `main`.
- **Branch naming**:
  - Feature: `feature/<short-description>`
  - Fix: `fix/<issue-id>-<short-description>`
  - Chore: `chore/<short-description>`
- **Commit messages**: Use conventional commit style: `type(scope): short summary` (e.g., `feat(admin): add settings panel`).
- **Setup (first time)**:
  - Install dependencies: `yarn install` (or `npm install`)
  - Husky will be installed automatically by the `prepare` script. If needed, run `npm run prepare`.
- **Before pushing**:
  - Run lint & format: `yarn lint` and `yarn format` (if format script exists)
  - Run tests: `yarn test` (if applicable)
  - Lint-staged + Husky will run pre-commit checks automatically on staged files.
- **Pull Requests**:
  - Open a PR against `main` with a clear description and link to any related issue.
  - Include screenshots for UI changes and a short checklist of what you tested.
  - Address CI / review comments promptly.

- **Code style**: Project uses ESLint and Prettier. Commit hooks will auto-fix and format staged files.

Thanks — contributions help keep this project healthy and maintained.
