## 1. Regression Coverage

- [x] 1.1 Add new-wiki renderer coverage proving native `Create` disabled state depends only on the trimmed name.
- [x] 1.2 Add coverage proving Electron does not visibly disable the name field, location chooser, cancel button, or create button because of `isCreatingWiki`.
- [x] 1.3 Add coverage proving the renderer uses the native `~/wikis` fallback label when no selected location path is available.
- [x] 1.4 Run targeted new-wiki tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update `renderNewWikiDialog()` to display `~/wikis` when no location path is selected.
- [x] 2.2 Update visible new-wiki disabled state so only empty trimmed names disable `Create`.
- [x] 2.3 Preserve the internal async duplicate-submit guard, create label, keyboard shortcuts, scaffold behavior, and failure dismissal behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted new-wiki tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
