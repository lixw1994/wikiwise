## 1. Regression Coverage

- [x] 1.1 Add a toolbar/left-sidebar parity test that verifies Swift uses a 0.2s ease-in-out left-sidebar restore animation and Electron declares the matching 200ms project-grid transition with a zero-width hidden left-sidebar track.
- [x] 1.2 Run the targeted toolbar test and confirm the new assertion fails before implementation.

## 2. Implementation

- [x] 2.1 Add native-timed project grid styling for left-sidebar hide/show while preserving logical detail and right-sidebar grid placement.
- [x] 2.2 Run the targeted toolbar test and confirm it passes.

## 3. Verification

- [x] 3.1 Run full Node test coverage, Swift build, OpenSpec validation, and whitespace checks.
- [x] 3.2 Package the macOS Electron app and run release readiness to record the current signed-release gate.
- [x] 3.3 Archive the OpenSpec change after implementation evidence is captured.
