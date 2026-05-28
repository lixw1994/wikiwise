## 1. Coverage

- [x] 1.1 Add targeted runtime-audit source coverage proving terminal startup/input IPC is no longer stubbed.
- [x] 1.2 Add targeted runtime-audit source coverage proving the audit waits for echoed real terminal command output.
- [x] 1.3 Run the targeted runtime-audit test and confirm it fails before implementation.

## 2. Implementation

- [x] 2.1 Let runtime audit opened-project scenarios use the production terminal startup and input handlers.
- [x] 2.2 Record terminal command echo evidence and fail project scenarios when real terminal output is absent.

## 3. Verification

- [x] 3.1 Run targeted runtime-audit tests.
- [x] 3.2 Run `openspec validate --all --strict`, full `npm test`, `swift build`, package verification, and runtime audit.
- [x] 3.3 Run release-readiness evidence and preserve expected signing/notarization blockers.
