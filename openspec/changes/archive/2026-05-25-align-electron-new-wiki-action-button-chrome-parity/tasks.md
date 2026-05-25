## 1. Test

- [x] 1.1 Add a failing regression test for native new-wiki action button chrome while preserving IDs, labels, and keyboard semantics.

## 2. Implementation

- [x] 2.1 Update Electron new-wiki action button markup and scoped styles to remove app-branded primary/secondary chrome from the native sheet.
- [x] 2.2 Run the targeted Electron new-wiki regression test.

## 3. Verification

- [x] 3.1 Run full verification with `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and Electron mac packaging.
