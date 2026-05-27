## 1. Regression Coverage

- [x] 1.1 Add Electron publishing tests proving refresh fallback mirrors native `try?` behavior for malformed `publish.json`.
- [x] 1.2 Add coverage proving publish/unpublish user-action paths still surface corrupt-config errors.
- [x] 1.3 Run targeted publishing tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update Electron `getPublishConfig` to return unpublished fallback only for refresh-time corrupt-config errors.
- [x] 2.2 Preserve current suggested-subdomain behavior for missing/malformed config refresh.
- [x] 2.3 Preserve throwing shared core publish config semantics for publish/unpublish operations.

## 3. Verification and Archive

- [x] 3.1 Run targeted Electron publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
