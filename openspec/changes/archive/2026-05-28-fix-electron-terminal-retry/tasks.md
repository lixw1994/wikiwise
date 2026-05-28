## 1. Regression Tests

- [x] 1.1 Add renderer tests proving terminal tab rendering retries startup when no session is tracked and does not overlap in-flight starts.
- [x] 1.2 Add renderer tests proving xterm input starts a session before sending input when no session is tracked.
- [x] 1.3 Add packaged runtime audit tests requiring real PTY echo evidence in the packaged report.

## 2. Implementation

- [x] 2.1 Update renderer terminal lifecycle to track in-flight starts, retry from the terminal tab, and gate input until a session exists.
- [x] 2.2 Extend packaged runtime smoke audit to spawn a real PTY, echo a marker command, and include terminal evidence in the JSON report.

## 3. Verification

- [x] 3.1 Run targeted Electron terminal/runtime tests and confirm RED/GREEN evidence.
- [x] 3.2 Run runtime and packaged Electron audits, plus repository validation commands required for this slice.
- [x] 3.3 Archive the OpenSpec change after verification passes.
