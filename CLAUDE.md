# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`build-if-needed` is a small CLI tool (published to npm) that wraps a project's build script and skips re-running it when nothing has changed. It hashes the files matched by configurable `input`/`output` glob patterns (MD5), compares against the hashes stored from the previous run in a `.build-if-needed/` cache folder, and only invokes the underlying `npm run <script>` / `yarn run <script>` command if the hashes differ.

## Commands

- `yarn build` — compile TypeScript (`src/` → `dist/`) via `tsc`. This also runs automatically as `prebuild` via `yarn lint`.
- `yarn watch` — `tsc --watch`.
- `yarn lint` — `eslint --ext .ts src/ --fix`.
- `yarn clean` — remove `dist/` via `rimraf`.
- `yarn test` — runs `jest`, but Jest is not currently a project dependency and no test files exist; this script is not currently functional.

There is no single-test invocation since there is no test suite yet.

## Architecture

Entry point flow (`bin/build-if-needed.js` requires `dist/build-if-needed.js`, compiled from `src/build-if-needed.ts`):

1. **`command.ts`** (`getCommand`) — parses CLI args via `commander`: `--script <name>` (required) and `--debug`.
2. **`configuration.ts`** (`getConfiguration`) — uses `cosmiconfig` to find the `build-if-needed` section of the consuming project's `package.json`, then looks up the sub-config for the requested `--script` name. Resolves `input`/`output` glob arrays and the `command` (npm or yarn) to use.
3. **`file-system.ts`** (`findFiles`) — expands the `input`/`output` glob patterns via `globby` into sorted file lists.
4. **`get-hash.ts`** (`getHashForFiles`) — computes a per-file MD5, then combines all per-file hashes into one aggregate hash (for `input` and for `output` separately).
5. **`hashes-cache.ts`** (`loadHashes`/`saveHashes`) — reads/writes the previous run's hashes to `.build-if-needed/<sanitized-script>.json`. `--debug` also persists the full file lists for inspection.
6. **`utility.ts`** (`same`) — compares the newly computed `{input, output}` hashes against the last-saved ones.
7. If hashes are unchanged, the wrapped build command is skipped. Otherwise **`execute-task.ts`** (`executeCommand`) runs `<npm|yarn> run <script>` via `execa`, streaming stdout/stderr and forwarding `SIGTERM`.
8. On success, **`after-task.ts`** (`updateCache`) recomputes and re-saves the hashes so the next invocation can detect "no changes."

Key design point: hashing happens on both `input` and `output` file sets — this catches not just source edits but also someone tampering with/deleting the `dist` output, forcing a rebuild in that case too.

Types are centralized in `src/types.ts` (`Configuration`, `Hashes`, `Files`, `SavedData`, `CommandOptions`, `Commands` enum for npm/yarn, etc.) and shared constants in `src/constants.ts`.

`src/index.ts` is currently just a placeholder stub (`console.log("This is a command line utility.")`) — the real logic lives in `build-if-needed.ts`, but `package.json`'s `main` field points at `dist/index.js`.

## TypeScript / lint conventions

- Compiles with `strict`, `noUnusedLocals`, `noUnusedParameters` (see `tsconfig.json`). Target is `es5`/`commonjs`, output `dist/` with declarations.
- ESLint config extends `@typescript-eslint/recommended` + Prettier integration; imports must be sorted (`sort-imports`, case-insensitive) and duplicate imports are an error.
- Prettier: double quotes, semicolons required (`.prettierrc.js`).
