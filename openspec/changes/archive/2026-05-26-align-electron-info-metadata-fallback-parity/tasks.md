## 1. Renderer Coverage

- [x] 1.1 Add failing renderer source coverage for native `—` EDITED and WORDS fallbacks when selected-document metadata is unavailable.
- [x] 1.2 Add failing renderer source coverage that document-info refresh failures clear stale metadata without using the generic shell error message.

## 2. Renderer Implementation

- [x] 2.1 Update INFO rendering to use a shared native missing metadata value while preserving successful formatting.
- [x] 2.2 Update document-info refresh failure handling to quietly render fallback rows and keep optional sections hidden.

## 3. Verification

- [x] 3.1 Run targeted right-sidebar tests and OpenSpec validation for this change.
- [x] 3.2 Run full project verification, runtime audit, packaging, and release-readiness checks.
