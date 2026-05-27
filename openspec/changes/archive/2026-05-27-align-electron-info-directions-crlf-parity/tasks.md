## 1. Regression Coverage

- [x] 1.1 Add shared document-info tests that assert CRLF frontmatter marker lines do not produce directions.
- [x] 1.2 Add Electron right-sidebar source coverage that anchors native `RightSidebar` newline splitting to shared core directions extraction.
- [x] 1.3 Run targeted document-info/right-sidebar tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared core directions extraction to split only on LF so CR remains part of CRLF marker lines.
- [x] 2.2 Preserve LF directions parsing, empty directions handling, wikilink extraction, word count, and renderer INFO behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted document-info and right-sidebar tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
