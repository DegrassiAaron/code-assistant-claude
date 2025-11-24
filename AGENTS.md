# Repository Guidelines

## Project Structure & Module Organization
`src/cli` contains the executable entrypoint and user-facing commands (`init.ts`, `mcp-add.ts`, `config.ts`, `reset.ts`). Orchestration layers—agents, analyzers, execution-engine, skills, and shared utils—live under `src/core`. Templates for the setup wizard are in `templates/`, additional references sit in `docs/`, and build artifacts land in `dist/`. Helper automation stays inside `scripts/`, while `tests/{unit,integration,e2e,performance}/` mirrors the production layout with reusable fixtures.

## Build, Test, and Development Commands
- `npm run dev`: tsup watch rebuild while editing `src/**`.
- `npm run build`: create the distributable CLI in `dist/`.
- `npm run lint` / `npm run lint:fix`: ESLint with the Prettier bridge on TypeScript sources.
- `npm run typecheck`: `tsc --noEmit` guard for shared types and contracts.
- `npm run format:check` (or `format`): enforce Prettier settings before committing.
- `npm run prepare`: install Husky hooks immediately after `npm install`.

## Coding Style & Naming Conventions
EditorConfig and Prettier enforce LF endings, UTF-8, trimmed whitespace, and two-space indentation with single quotes and 80-character lines. ESLint extends `eslint:recommended` plus `@typescript-eslint`; prefer well-typed exports, document intentional `any`, and keep filenames kebab-case (`token-tracker.ts`). CLI command modules should default-export a verb-named builder, while public classes and types stay PascalCase.

## Testing Guidelines
Vitest powers unit, integration, and performance suites: run `npm test`, or scope with `npm run test:unit`, `npm run test:integration`, and the `benchmark*` scripts when tuning token metrics. Jest handles end-to-end flows via `npm run test:e2e` and load scenarios through `npm run test:load`. Execute `npm run test:coverage` before merging and guard against regressions. Name specs `<subject>.test.ts` inside the matching domain folder.

## Commit & Pull Request Guidelines
Git history follows Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`). Keep subjects imperative and ≤72 characters, adding body lines for risky or multi-module updates. Pull requests should link an issue, summarize behavior changes, list validation commands (e.g., `npm run build && npm test`), and attach screenshots or CLI transcripts when user output shifts. Request reviews from the CLI maintainer plus any subsystem owners you touched.

## Security & Configuration Tips
Respect `package.json#engines` (Node.js ≥18, npm ≥9). Use `npm run audit`, `npm run audit:production`, and `npm run check:licenses` after dependency changes. When touching `src/core/execution-engine/**` or sandbox tooling, document new toggles in `docs/` and add representative fixtures under `tests/fixtures/` to keep deterministic runs. Never edit `dist/` directly—recreate outputs via `npm run build`.
