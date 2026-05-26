## 1. Contracts

- [x] 1.1 Add failing main-process/project-lifecycle tests for native standalone-file project result behavior.
- [x] 1.2 Add failing renderer tests for standalone-file service guards and publish/generated-map boundaries.
- [x] 1.3 Add failing runtime audit contract tests for standalone-file evidence and failures.

## 2. Implementation

- [x] 2.1 Add explicit folder/file project-kind metadata and empty-tree standalone-file results in Electron main.
- [x] 2.2 Guard renderer watcher, terminal, publish, and generated-map flows so standalone-file opens do not start project services.
- [x] 2.3 Extend runtime audit with a standalone-file scenario and DOM/service evidence.

## 3. Verification

- [x] 3.1 Run red/green focused project lifecycle and runtime audit tests.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `openspec validate align-electron-standalone-file-open-parity --strict`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Archive the OpenSpec change and commit.
