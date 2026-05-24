# electron-file-tree-expansion-parity Specification

## Purpose
Define Electron project-browser parity for native expandable, lazy-loaded file tree behavior, including default folder expansion, path-safe directory expansion, nested file selection, and expansion preservation across project refreshes.
## Requirements
### Requirement: Expandable Project Tree
The Electron app SHALL render project folders as expandable tree nodes using the same visible-file filtering and ordering as the native macOS app.

#### Scenario: Project opens with native default expansion
- **WHEN** a project folder is opened in the Electron app
- **THEN** top-level folders except `site` are expanded by default
- **AND** their immediate children are visible without requiring a second project open
- **AND** `site` remains collapsed until the user expands it

#### Scenario: User expands a nested folder
- **WHEN** the user expands a collapsed folder inside the project tree
- **THEN** the Electron app loads that folder's immediate children
- **AND** the folder row changes to the expanded disclosure state
- **AND** nested children keep native ordering, filtering, and indentation

#### Scenario: User collapses a folder
- **WHEN** the user collapses an expanded folder
- **THEN** the Electron app hides that folder's descendants
- **AND** the loaded children remain available for later re-expansion during the same tree state

### Requirement: Path-Safe Lazy Expansion
The Electron app SHALL only expand directories that are inside the current project root.

#### Scenario: Renderer requests a valid directory expansion
- **WHEN** the renderer requests expansion for a directory inside the current project root
- **THEN** the main process returns that directory's filtered child nodes

#### Scenario: Renderer requests an invalid directory expansion
- **WHEN** the renderer requests expansion for a path outside the current project root
- **THEN** the main process rejects the request
- **AND** no filesystem entries outside the current project are returned to the renderer

### Requirement: Nested File Selection
Selecting a nested file from the Electron tree SHALL use the same selection pipeline as selecting a top-level file.

#### Scenario: User selects a nested markdown file
- **WHEN** the user selects a nested markdown file from an expanded tree folder
- **THEN** the Electron app reads the file content
- **AND** compiles or loads its wiki preview when available
- **AND** updates the selected row, toolbar mode state, document info, navigation history, and `.claude/active-file`

#### Scenario: User selects a nested non-markdown supported file
- **WHEN** the user selects a nested supported non-markdown file from an expanded tree folder
- **THEN** the Electron app opens it in File mode
- **AND** uses the same CodeMirror save path as top-level non-markdown files

### Requirement: Tree Refresh Preserves Expansion
The Electron app SHALL preserve compatible expanded folders across project tree refreshes.

#### Scenario: Project watcher reports a structure change
- **WHEN** the project watcher reports added or removed files
- **THEN** the Electron app rescans the top-level project tree
- **AND** re-expands folders that still exist and were expanded before the refresh
- **AND** removes expansion state for folders that no longer exist
