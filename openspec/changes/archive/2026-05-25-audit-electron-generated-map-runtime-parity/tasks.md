## 1. Test Coverage

- [x] 1.1 Add a targeted runtime audit source test requiring generated map flow evidence, report fields, and failure assertions.
- [x] 1.2 Add a core compiler regression test for full generation after progressive cache seeding.
- [x] 1.3 Run targeted tests and confirm they fail for missing generated map runtime evidence and progressive cache full-compile compatibility.

## 2. Runtime Audit Implementation

- [x] 2.1 Capture generated map toolbar flow evidence in opened-project scenarios before switching to FILE mode.
- [x] 2.2 Include generated map flow evidence in DOM report output.
- [x] 2.3 Fail project scenarios when the map control, generated `map-3d.html` frame, or Back restoration evidence is missing.
- [x] 2.4 Treat progressive cache entries with deferred HTML as full-compile cache misses.

## 3. Verification And Archive

- [x] 3.1 Run targeted runtime audit tests and the Electron runtime audit command.
- [x] 3.2 Run full repository validation: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Archive the OpenSpec change after validation passes.
