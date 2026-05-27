## ADDED Requirements

### Requirement: Watcher Assets Path Parity

Electron live rebuild watching SHALL preserve native `FileWatcher` `/wiki/assets/` path containment semantics.

#### Scenario: Nested wiki assets path changes
- **WHEN** the Electron project watcher receives a changed path containing `/wiki/assets/`
- **THEN** the watcher summary classifies it as a structure change
- **AND** Electron keeps the existing structure refresh path for that watched project

#### Scenario: Non-assets lookalike path changes
- **WHEN** the Electron project watcher receives a path that only contains `wiki/assets` without the native slash-boundary shape
- **THEN** that path is not classified as a structure change solely for assets handling
