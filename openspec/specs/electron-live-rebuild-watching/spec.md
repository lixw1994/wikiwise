# electron-live-rebuild-watching Specification

## Purpose
TBD - created by archiving change migrate-electron-live-rebuild-watching. Update Purpose after archive.
## Requirements
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
- **THEN** the phase verification records only watcher gaps that remain deferred after later parity slices are archived
- **AND** background drip compilation, scroll preservation, and runtime watcher QA are not listed as deferred once their parity evidence has been archived

### Requirement: Watcher Restarts Background Compilation
The Electron watcher lifecycle SHALL restart background compilation after changes that rescan or invalidate compiler state.

#### Scenario: CSS or rebuild invalidates pages
- **WHEN** a watched CSS change or rebuild trigger invalidates compiled output
- **THEN** Electron restarts background compilation for the watched project
- **AND** pending pages are progressively recompiled after the current preview refresh path is served

#### Scenario: Markdown or structure changes rescan pages
- **WHEN** watched markdown or structure changes rescan compiler metadata
- **THEN** Electron restarts background compilation for the watched project
- **AND** newly pending pages are progressively compiled

### Requirement: Runtime Watcher QA Evidence
The Electron live rebuild watching phase SHALL include runtime QA evidence that watched changes refresh the selected markdown preview.

#### Scenario: Watched markdown and CSS refresh is audited
- **WHEN** runtime watcher QA emits a watched markdown change for the selected file with CSS change semantics
- **THEN** Electron re-reads the selected markdown file from disk when it has no unsaved draft
- **AND** Electron refreshes the selected compiled preview with invalidate semantics
- **AND** Electron refreshes the selected compiled preview with CSS reload semantics
- **AND** Electron preserves the selected markdown page after the watcher refresh
