## 1. Regression Coverage

- [x] 1.1 Add terminal startup tests that prove native SwiftTerm uses leading-dash login-shell `execName`.
- [x] 1.2 Add Electron PTY startup tests that require login-shell arguments while preserving project cwd, environment, dimensions, output routing, cleanup, and resize behavior.
- [x] 1.3 Run the targeted terminal tests before implementation and retain the expected RED failure.

## 2. Implementation

- [x] 2.1 Start Electron PTY shells with login-shell semantics on non-Windows platforms.
- [x] 2.2 Preserve existing terminal shell resolution, project-root cwd, xterm name, environment, dimensions, event routing, cleanup, and resize behavior.

## 3. Verification and Archive

- [x] 3.1 Run targeted terminal tests and retain GREEN evidence.
- [x] 3.2 Run OpenSpec validation, full test/build/package checks, runtime audit, and release-readiness evidence.
- [x] 3.3 Archive the change, rerun OpenSpec validation, and record post-archive evidence.
