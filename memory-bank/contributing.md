# Contributing (Memory Bank)

This file mirrors the repository CONTRIBUTING.md and is intended for both humans and automated agents working in this workspace.

Agents: read and apply these rules when making changes. When possible, enforce or follow these items automatically:
- Branch naming: `feature/`, `fix/`, `chore/` prefixes.
- Commit message format: Conventional commits (`type(scope): short summary`).
- Run linters and formatters on changed files before committing.
- Run tests where applicable.
- Include a short checklist in PR descriptions: what was changed, how to test, screenshots for UI changes.

Human contributor instructions:

- Get the code: Fork and branch from `main`.
- Branch naming:
  - Feature: `feature/<short-description>`
  - Fix: `fix/<issue-id>-<short-description>`
  - Chore: `chore/<short-description>`
- Commit messages: `type(scope): short summary` (e.g., `feat(admin): add settings panel`).
- Setup (first time):
  - `yarn install` or `npm install`
  - `npm run prepare` (or `yarn prepare`) to enable Husky hooks
- Before pushing:
  - Run `yarn lint` and formatters; Husky + lint-staged will auto-run on staged files.
  - Run tests: `yarn test` (if available)
- PRs: Open against `main`, include description, testing steps, and screenshots for UI changes.

Notes for agents and automation:
- Automated agents should load this file from `memory-bank/contributing.md` and apply its conventions when making edits, commits, and PRs.
- If the agent can run git hooks, prefer using them; otherwise, ensure generated commits follow the commit format and include a brief checklist in PR descriptions.

Thank you — following these rules keeps the project consistent and reviewable.
