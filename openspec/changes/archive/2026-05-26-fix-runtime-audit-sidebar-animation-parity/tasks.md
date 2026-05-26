## 1. Regression Coverage

- [x] 1.1 Add CSS parity coverage proving active left/right sidebar resize disables the project grid transition while preserving toolbar visibility animation.
- [x] 1.2 Add runtime audit coverage proving left-sidebar visibility evidence waits for the native 200ms animation before measuring.
- [x] 1.3 Run targeted tests and confirm the new assertions fail before implementation.

## 2. Runtime / Renderer Fix

- [x] 2.1 Add scoped CSS transition bypass for active left/right sidebar resize gestures.
- [x] 2.2 Update runtime audit left-sidebar visibility evidence collection to wait for animation settlement before hidden/restored measurements.
- [x] 2.3 Run targeted tests and confirm they pass.

## 3. Verification and Archive

- [x] 3.1 Run `npm run electron:audit:runtime` and confirm runtime project scenarios pass.
- [x] 3.2 Run full verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Record release readiness output before archiving the completed OpenSpec change.
