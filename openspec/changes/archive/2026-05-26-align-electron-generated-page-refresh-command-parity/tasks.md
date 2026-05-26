## 1. Implementation

- [x] 1.1 Add RED coverage that proves native Refresh Page requires a selected file, Electron manual Refresh Page does not refresh generated pages, and watcher-driven generated-page refresh remains intact.
- [x] 1.2 Update Electron renderer manual refresh behavior so generated pages are not refreshed by the app/menu command while selected Markdown refresh still works.

## 2. Verification

- [x] 2.1 Run targeted Electron tests for preview navigation/map/graph refresh parity.
- [x] 2.2 Run full verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, `npm run electron:package:mac`, and release-readiness preflight with the expected local credential blocker recorded if still present.
