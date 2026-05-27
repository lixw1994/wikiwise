## 1. Regression Coverage

- [x] 1.1 Add project-lifecycle coverage proving native active-file writes use `try?` and Electron selection active-file failures do not call global `setError`.
- [x] 1.2 Preserve coverage that main-process `setActiveFile` still validates paths and delegates to the shared core active-file helper.
- [x] 1.3 Run targeted project-lifecycle tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update renderer `setActiveSelectedFile()` so active-file side-effect failures remain silent and return `null`.
- [x] 2.2 Preserve file selection, standalone-file no-directory behavior, scaffolded-project active-file writes, and save-path error handling.

## 3. Verification and Archive

- [x] 3.1 Run targeted project-lifecycle tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
