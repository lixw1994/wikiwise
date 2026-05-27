## 1. Regression Coverage

- [x] 1.1 Add shared document-info tests that assert wikilink targets containing a single `]` are retained and de-duplicated.
- [x] 1.2 Add Electron right-sidebar source coverage that anchors native scanner extraction to shared core wikilink parsing.
- [x] 1.3 Run targeted document-info/right-sidebar tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared core wikilink extraction to capture target text up to the next `]]` instead of rejecting single `]` characters.
- [x] 2.2 Preserve raw target whitespace, target order, empty-target filtering, de-duplication, directions parsing, word count, and renderer INFO behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted document-info and right-sidebar tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
