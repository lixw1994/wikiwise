## 1. Regression Coverage

- [x] 1.1 Add shared core watcher tests for native output-directory prefix filtering.
- [x] 1.2 Add Electron live-rebuild source coverage anchored to native `FileWatcher` output-prefix checks.
- [x] 1.3 Run targeted watcher tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared watch-event filtering to use native-like output-directory prefix semantics.
- [x] 2.2 Preserve output descendant ignoring, non-output watcher classification, watcher priorities, and Electron watcher IPC.

## 3. Verification and Archive

- [x] 3.1 Run targeted watcher tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
