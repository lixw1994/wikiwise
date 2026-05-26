## 1. Implementation

- [x] 1.1 Add RED coverage that proves native custom menu commands are global notifications, Electron navigation/refresh app commands broadcast to all live windows, and Open Existing Folder remains targeted.
- [x] 1.2 Update Electron main-process app command dispatch so only native navigation/refresh commands broadcast to every live window.

## 2. Verification

- [x] 2.1 Run targeted Electron chrome/menu persistence tests.
- [x] 2.2 Run full verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, `npm run electron:package:mac`, and release-readiness preflight with the expected local credential blocker recorded if still present.
