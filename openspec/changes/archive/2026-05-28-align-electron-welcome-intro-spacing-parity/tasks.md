## 1. Regression Coverage

- [x] 1.1 Add source-backed coverage proving native welcome content groups the `W` mark and summary in `VStack(spacing: 12)`.
- [x] 1.2 Add Electron markup/CSS coverage proving `.welcome-intro` groups the mark and summary with a 12px gap while `.welcome-content` keeps the 32px outer gap.
- [x] 1.3 Capture the initial targeted RED failure before implementation.

## 2. Implementation

- [x] 2.1 Wrap Electron welcome mark and summary copy in a dedicated intro group.
- [x] 2.2 Style the intro group with native 12px internal spacing while preserving outer welcome rhythm and existing welcome behavior.

## 3. Verification

- [x] 3.1 Run the targeted Electron native-shell parity test after implementation.
- [x] 3.2 Run `openspec validate --all --strict`.
- [x] 3.3 Run full repo verification: `npm test`, `swift build`, Electron mac package, runtime parity audit, and release readiness gate.
- [x] 3.4 Archive the OpenSpec change after implementation verification.
