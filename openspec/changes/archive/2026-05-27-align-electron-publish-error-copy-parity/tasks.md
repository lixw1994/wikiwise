## 1. Regression Coverage

- [x] 1.1 Add core publisher tests that assert native publish error descriptions and existing stable error codes.
- [x] 1.2 Add Electron publishing source coverage that anchors native `Publisher` descriptions to the renderer error modal surfacing path.
- [x] 1.3 Run targeted publisher tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared core publish error messages to match native Swift descriptions.
- [x] 2.2 Preserve publish availability, upload, retry, unpublish, and renderer modal behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted publisher and Electron publishing tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
