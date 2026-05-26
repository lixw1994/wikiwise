## 1. Parser Coverage

- [x] 1.1 Add failing core document-info tests for loose frontmatter openings and indented `directions:` keys that native ignores.
- [x] 1.2 Keep coverage for valid exact `directions:` frontmatter that native displays.

## 2. Core Implementation

- [x] 2.1 Update core directions extraction to mirror native exact frontmatter marker and key matching.
- [x] 2.2 Confirm Electron source still renders directions from core metadata without renderer-side parser changes.

## 3. Verification

- [x] 3.1 Run targeted document-info tests and OpenSpec validation for this change.
- [x] 3.2 Run full project verification, runtime audit, packaging, and release-readiness checks.
