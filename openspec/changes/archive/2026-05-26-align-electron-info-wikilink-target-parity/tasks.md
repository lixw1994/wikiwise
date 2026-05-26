## 1. Parser Coverage

- [x] 1.1 Add failing core document-info tests for raw wikilink target preservation, whitespace-only targets, and exact duplicate handling.
- [x] 1.2 Keep existing ordinary wikilink extraction coverage passing.

## 2. Core Implementation

- [x] 2.1 Update core document-info wikilink extraction to preserve raw targets and dedupe exact strings.
- [x] 2.2 Confirm Electron linked rows still render targets from core metadata without renderer-side normalization.

## 3. Verification

- [x] 3.1 Run targeted document-info tests and OpenSpec validation for this change.
- [x] 3.2 Run full project verification, runtime audit, packaging, and release-readiness checks.
