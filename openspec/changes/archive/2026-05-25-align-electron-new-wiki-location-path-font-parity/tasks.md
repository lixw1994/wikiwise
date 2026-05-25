## 1. Test

- [x] 1.1 Add a failing regression test for native new-wiki location path system-font styling while preserving truncation and full-path metadata.

## 2. Implementation

- [x] 2.1 Update Electron new-wiki location path styles to remove monospace font chrome and keep native 12px system text.
- [x] 2.2 Run the targeted Electron new-wiki regression test.

## 3. Verification

- [x] 3.1 Run full verification with `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and Electron mac packaging.
