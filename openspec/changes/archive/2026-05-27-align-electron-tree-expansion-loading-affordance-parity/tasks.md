## 1. Regression Coverage

- [x] 1.1 Add file-tree coverage proving native folder rows only expose `▸`/`▾` disclosure states.
- [x] 1.2 Add renderer coverage proving Electron does not render `...` or disable folder rows from `treeLoadingPaths`.
- [x] 1.3 Run targeted file-tree expansion tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron folder row rendering to keep native disclosure glyphs while expansion is pending.
- [x] 2.2 Stop rendering an intermediate loading row before lazy expansion IPC returns.
- [x] 2.3 Preserve internal duplicate-request guarding, path-safe lazy expansion, default expansion, nested selection, and sidebar state behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted file-tree expansion tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
