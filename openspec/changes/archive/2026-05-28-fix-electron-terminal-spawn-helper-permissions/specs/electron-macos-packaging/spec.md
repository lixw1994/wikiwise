## ADDED Requirements

### Requirement: Packaged Node PTY Spawn Helper Permissions
The Electron macOS package command SHALL preserve an executable `node-pty` spawn helper inside the packaged app bundle.

#### Scenario: Packaged app runtime dependencies are assembled
- **WHEN** the Electron macOS package command copies runtime dependencies into `apps/electron/out/Wikiwise.app/Contents/Resources/app`
- **THEN** the packaged `node-pty` spawn helper is made executable before package verification and later release signing steps
- **AND** app bundle metadata, embedded app layout, native resource copying, and local unsigned packaging behavior remain unchanged
