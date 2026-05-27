## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/file-tree-expansion-parity.test.js`
  - Failed as expected after adding `renderer mirrors native folder expansion without loading row chrome`.
  - Existing Electron renderer still referenced `state.treeLoadingPaths.has(node.path)`, set `button.disabled = isLoading`, and rendered `isLoading ? "..."`.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/file-tree-expansion-parity.test.js`
  - 11 tests passed after removing visible loading chrome while keeping the internal duplicate-request guard.

### Broad Verification

- `openspec validate --all --strict`
  - 34 passed, 0 failed.
- `git diff --check`
  - Passed.
- `npm test`
  - 290 tests passed: 248 Electron app tests and 42 core tests.
- `swift build`
  - Passed.
- `npm run electron:package:mac`
  - Passed; produced `apps/electron/out/Wikiwise.app`.
- `npm run electron:audit:runtime`
  - Passed 7 runtime scenarios: welcome light/dark, new wiki light/dark, standalone file light, project light, and project dark.
- `npm run electron:release:readiness`
  - Blocked as expected because the local machine lacks Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and a usable Apple notarization keychain profile `notarytool`.

### Post-Archive

- `openspec archive align-electron-tree-expansion-loading-affordance-parity --yes`
  - Archived the change as `2026-05-27-align-electron-tree-expansion-loading-affordance-parity`.
  - Synced `electron-file-tree-expansion-parity` and `electron-native-parity-roadmap`.
- `openspec validate --all --strict`
  - 33 passed, 0 failed.
- `openspec list --json`
  - No active changes.
- `npm --workspace @wikiwise/electron-app test -- test/file-tree-expansion-parity.test.js`
  - 11 tests passed.
- `git diff --check`
  - Passed after trimming archive-sync EOF spacing.
