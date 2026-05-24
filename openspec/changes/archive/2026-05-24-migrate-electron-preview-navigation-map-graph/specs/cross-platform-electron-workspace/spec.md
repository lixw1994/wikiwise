## ADDED Requirements

### Requirement: Preview Navigation IPC

The Electron workspace SHALL expose preview navigation resolution through the main process and preload bridge.

#### Scenario: Renderer resolves local preview navigation

- **WHEN** the renderer sends a project root and local preview URL to preload
- **THEN** preload sends an IPC request to the main process
- **AND** the main process returns either a markdown file navigation result, a generated page result, or null

### Requirement: External URL IPC

The Electron workspace SHALL expose safe external URL opening through the main process and preload bridge.

#### Scenario: Renderer opens an external preview link

- **WHEN** the renderer sends an external URL to preload
- **THEN** preload sends an IPC request to the main process
- **AND** the main process opens only `http` and `https` URLs in the system browser
