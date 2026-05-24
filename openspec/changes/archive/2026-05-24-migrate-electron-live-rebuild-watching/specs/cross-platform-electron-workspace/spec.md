## ADDED Requirements

### Requirement: Project Watcher IPC

The Electron workspace SHALL expose project watcher operations through the main process and preload bridge instead of direct renderer filesystem access.

#### Scenario: Renderer starts watching a project

- **WHEN** the renderer asks to watch a project root
- **THEN** preload sends an IPC request to the main process
- **AND** the main process creates and owns the filesystem watcher
- **AND** the renderer receives serializable project-change events from preload

### Requirement: Watcher Cleanup

The Electron workspace SHALL clean up old project watchers when projects change or renderer contents are destroyed.

#### Scenario: Watched project changes

- **WHEN** a renderer starts watching a different project root
- **THEN** the previous watcher for that renderer is closed before the new watcher is created
