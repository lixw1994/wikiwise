## 1. Implementation

- [x] 1.1 Add RED coverage proving active generated pages are not directly refreshed from watcher changes in native parity terms, while generated page opening remains intact.
- [x] 1.2 Update Electron watcher handling so generated pages are not directly refreshed on rebuild, CSS, or markdown watcher changes.

## 2. Verification

- [x] 2.1 Run targeted preview navigation/map/graph tests.
- [x] 2.2 Run full verification: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, `npm run electron:package:mac`, and release-readiness preflight with the expected local credential blocker recorded if still present.
