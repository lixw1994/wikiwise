## 1. Test Coverage

- [x] 1.1 Add a targeted runtime audit source test that requires preview scroll restoration evidence, report fields, and failure assertions.
- [x] 1.2 Run the targeted runtime parity audit test and confirm it fails for the missing evidence.

## 2. Runtime Audit Implementation

- [x] 2.1 Extend the runtime audit preview fixture so it is tall enough to prove iframe scrolling.
- [x] 2.2 Capture preview scroll restoration evidence in opened-project scenarios before switching to FILE mode.
- [x] 2.3 Include preview scroll evidence in DOM report output and fail project scenarios when evidence is missing, not scrollable, or outside tolerance.

## 3. Verification And Archive

- [x] 3.1 Run targeted runtime audit tests and the Electron runtime audit command.
- [x] 3.2 Run full repository validation: `npm test`, `swift build`, `openspec validate --all --strict`, `git diff --check`, and `npm run electron:package:mac`.
- [x] 3.3 Archive the OpenSpec change after validation passes.
