## 1. Coverage

- [x] 1.1 Add RED static tests for the Electron release workflow trigger, credential bootstrap, canonical release-script delegation, artifact uploads, and documentation.
- [x] 1.2 Verify the targeted workflow tests fail before implementation for the expected missing workflow/docs.

## 2. Implementation

- [x] 2.1 Add the manual macOS Electron release workflow under `.github/workflows/`.
- [x] 2.2 Document required GitHub secrets, dispatch behavior, artifact outputs, and final migration release evidence expectations.

## 3. Verification And Archive

- [x] 3.1 Run targeted workflow tests and broader release/package tests.
- [x] 3.2 Run `openspec validate --all --strict`, `npm test`, `swift build`, `npm run electron:package:mac`, and `npm run electron:release:readiness`.
- [x] 3.3 Record verification evidence, archive the OpenSpec change, and rerun post-archive validation.
