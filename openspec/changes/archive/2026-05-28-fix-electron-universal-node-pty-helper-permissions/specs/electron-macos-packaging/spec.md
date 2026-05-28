## ADDED Requirements

### Requirement: Universal Node PTY Helper Permissions
The Electron macOS packaging command SHALL repair executable permissions for every packaged Darwin `node-pty` `spawn-helper` included in the app bundle.

#### Scenario: Package contains multiple Darwin prebuild helpers
- **WHEN** `npm run electron:package:mac` packages `node-pty` with both `darwin-arm64` and `darwin-x64` prebuild helpers
- **THEN** each packaged `prebuilds/darwin-*/spawn-helper` has at least one executable permission bit
- **AND** the packaging script does not limit helper repair to the current `process.arch`

#### Scenario: Optional Darwin helper is absent
- **WHEN** a packaged `node-pty` dependency omits a Darwin prebuild helper
- **THEN** packaging continues without failing solely because that optional helper is absent
- **AND** any Darwin helpers that are present are still repaired
