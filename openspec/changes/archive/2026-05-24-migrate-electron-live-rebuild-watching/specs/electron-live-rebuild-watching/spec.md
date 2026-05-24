## ADDED Requirements

### Requirement: Project Watch Lifecycle

The Electron app SHALL start watching an opened project folder and stop or replace the watcher when the watched project changes.

#### Scenario: Project is opened

- **WHEN** the renderer opens a project folder
- **THEN** it asks preload to start a project watcher for that project root
- **AND** the main process owns the filesystem watcher
- **AND** the renderer receives project-change events through preload subscription

### Requirement: Native Watch Event Priority

The Electron project watcher SHALL coalesce filesystem events using native FileWatcher priority.

#### Scenario: Changes are coalesced

- **WHEN** multiple watched paths change within the debounce window
- **THEN** output directory paths are ignored
- **AND** `.rebuild` wins over other event kinds
- **AND** structure changes win over CSS and markdown content changes
- **AND** otherwise CSS and markdown changes are reported together as content changes

### Requirement: Renderer Live Refresh

The Electron renderer SHALL update project state in response to watcher events.

#### Scenario: Watched project changes

- **WHEN** a watched event reports a structure or rebuild change
- **THEN** the renderer rescans the file tree
- **AND** rebuild events refresh the currently selected markdown preview when possible

#### Scenario: Current markdown file changes

- **WHEN** a watched event reports that the currently selected markdown file changed
- **THEN** the renderer reloads the file from disk when it has no unsaved draft
- **AND** requests a compiled preview refresh for the selected markdown file

#### Scenario: CSS changes

- **WHEN** a watched event reports CSS changes
- **THEN** the renderer requests a compiled preview refresh for the selected markdown file with CSS reload semantics

### Requirement: Deferred Watcher Gaps

The live rebuild watching phase SHALL identify native watcher gaps that remain for later OpenSpec phases.

#### Scenario: Watcher refresh is available

- **WHEN** Electron responds to project filesystem changes
- **THEN** the phase verification records that background drip compilation, scroll preservation, and deeper runtime watcher QA remain deferred
