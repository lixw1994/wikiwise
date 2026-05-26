## 1. OpenSpec

- [x] 1.1 Validate the preview-navigation runtime parity change artifacts with strict OpenSpec validation.

## 2. Runtime Audit Test Coverage

- [x] 2.1 Add a failing runtime-audit source test that requires preview local-link navigation evidence, audit resolver coverage, and failure assertions.

## 3. Runtime Audit Implementation

- [x] 3.1 Add a deterministic local link to the synthetic audit preview that targets compiled `index.html`.
- [x] 3.2 Implement audit preview-navigation resolution for markdown-backed local links and generated pages.
- [x] 3.3 Capture renderer and host evidence for clicking the preview link, selecting `index.md`, and returning to `home.md` through Back.
- [x] 3.4 Assert missing or incorrect preview-navigation evidence in project runtime scenarios.

## 4. Verification And Archive

- [x] 4.1 Run the targeted runtime-audit source test and the Electron runtime audit command.
- [x] 4.2 Archive the OpenSpec change after tasks and validation pass.
- [x] 4.3 Run full verification: targeted source test, `npm test`, `swift build`, runtime audit, `openspec validate --all --strict`, `git diff --check`, and Electron mac packaging.
