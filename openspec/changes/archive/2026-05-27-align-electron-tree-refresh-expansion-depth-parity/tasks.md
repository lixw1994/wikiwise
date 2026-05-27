## 1. Regression Coverage

- [x] 1.1 Add file-tree parity coverage proving native `refreshTree()` only retains top-level expanded folders after a one-level rescan.
- [x] 1.2 Add renderer coverage proving Electron refresh restoration derives retained paths from top-level `state.tree` entries instead of recursively sorting all previous paths.
- [x] 1.3 Run targeted file-tree expansion tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron refresh restoration to restore only still-existing top-level expanded folders.
- [x] 2.2 Remove refresh-only recursive expansion pruning if it becomes unused.
- [x] 2.3 Preserve initial default expansion, user lazy expansion, nested file selection, and left-sidebar hide/show state behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted file-tree expansion tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
