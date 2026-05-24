## 1. OpenSpec Driver

- [x] 1.1 Create proposal, capability specs, design, review, tasks, and execution plan for the Electron workspace change.
- [x] 1.2 Remove or supersede non-OpenSpec planning artifacts so the OpenSpec change is the source of truth.

## 2. Core Package

- [x] 2.1 Add failing Node tests for bundled resource metadata and repository resource resolution.
- [x] 2.2 Add the root npm workspace and `@wikiwise/core` package implementation.
- [x] 2.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 3. Electron Workspace

- [x] 3.1 Add the `@wikiwise/electron-app` package manifest and dependency-light structure tests.
- [x] 3.2 Add Electron main, preload, renderer HTML, renderer JavaScript, and renderer CSS files.
- [x] 3.3 Verify root `npm test` passes without launching Electron.

## 4. Documentation and Verification

- [x] 4.1 Document the parallel Electron workspace in root README and `apps/electron/README.md`.
- [x] 4.2 Verify `openspec validate add-electron-workspace --strict` passes.
- [x] 4.3 Verify `swift build` still passes.
- [x] 4.4 Record retained verification evidence in `openspec/changes/add-electron-workspace/verification.md`.
