## 1. Runtime Audit Tests

- [x] 1.1 Add failing structural tests for runtime audit package scripts, audit script scenario coverage, Electron capture behavior, artifact paths, and README documentation.
- [x] 1.2 Verify `npm --prefix apps/electron test` fails for the new audit expectations before implementation.

## 2. Runtime Audit Implementation

- [x] 2.1 Implement `scripts/audit-electron-runtime.mjs` to load the real Electron renderer/preload in BrowserWindow scenarios.
- [x] 2.2 Add root and Electron workspace runtime audit npm scripts.
- [x] 2.3 Update the Electron README with runtime audit usage and remove stale shared-resource wording.
- [x] 2.4 Verify `npm --prefix apps/electron test` passes.

## 3. Runtime Artifact Verification

- [x] 3.1 Run the Electron runtime audit command and verify report/screenshots are generated.
- [x] 3.2 Inspect the JSON report for all four scenarios and retained parity evidence.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate audit-electron-runtime-parity --strict` passes.
- [x] 4.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence and archive the change.
