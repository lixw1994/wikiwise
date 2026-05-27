## 1. Regression Coverage

- [x] 1.1 Add shared core tests proving display reads return `Could not read file.` on read failure while ordinary `readTextFile` still throws.
- [x] 1.2 Add Electron project lifecycle source coverage tying display-content reads to native `ContentView.loadFile(_:)`.
- [x] 1.3 Run targeted core/project-lifecycle tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Add a shared display-read helper with the exact native fallback text.
- [x] 2.2 Route Electron user-visible selected-file content reads through the display-read helper.
- [x] 2.3 Preserve internal throwing read semantics for settings, publish config, save, compiler, and validation paths.

## 3. Verification and Archive

- [x] 3.1 Run targeted core and Electron project lifecycle tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, broader project tests/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
