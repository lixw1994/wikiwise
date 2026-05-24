## ADDED Requirements

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
