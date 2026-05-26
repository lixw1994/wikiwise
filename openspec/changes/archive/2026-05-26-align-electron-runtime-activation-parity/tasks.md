## 1. Contracts

- [x] 1.1 Add failing native shell tests for Swift startup activation behavior and Electron main-process activation wiring.

## 2. Implementation

- [x] 2.1 Add Electron main-process startup activation policy and focus setup.
- [x] 2.2 Run activation setup before runtime audit mode and normal window creation.

## 3. Verification

- [x] 3.1 Run the focused native shell test red/green.
- [x] 3.2 Run `npm test`, `swift build`, `npm run electron:audit:runtime`, `npm run electron:package:mac`, `openspec validate align-electron-runtime-activation-parity --strict`, `openspec validate --all --strict`, and `git diff --check`.
- [x] 3.3 Archive the OpenSpec change and commit.
