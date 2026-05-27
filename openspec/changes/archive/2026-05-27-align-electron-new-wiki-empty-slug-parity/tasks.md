## 1. Regression Coverage

- [x] 1.1 Add shared scaffold tests proving non-empty names that sanitize to an empty slug create at the selected parent path while whitespace-only names still reject.
- [x] 1.2 Add Electron new-wiki source coverage anchoring native post-filter empty-slug behavior to shared core.
- [x] 1.3 Run targeted scaffold/new-wiki tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Update shared `createWikiScaffold` to remove the Electron-only empty-slug rejection.
- [x] 2.2 Preserve trimmed empty-name rejection, slug generation, scaffold directory/file writes, resource copying, template replacements, scaffold-version, `.gitignore`, and renderer post-create behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted core scaffold and Electron new-wiki tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
