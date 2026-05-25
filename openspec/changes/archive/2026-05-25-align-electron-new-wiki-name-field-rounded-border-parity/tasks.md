## 1. Test

- [x] 1.1 Add a failing regression test for native new-wiki name field rounded-border styling while preserving ID, placeholder, and behavior.

## 2. Implementation

- [x] 2.1 Update Electron new-wiki name field markup and scoped styles to add compact rounded-border native sheet chrome.
- [x] 2.2 Run the targeted Electron new-wiki regression test.

## 3. Verification

- [x] 3.1 Run full verification with `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and Electron mac packaging.
