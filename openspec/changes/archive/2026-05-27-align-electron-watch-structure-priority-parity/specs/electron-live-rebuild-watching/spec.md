## ADDED Requirements

### Requirement: Watcher Structure Priority Payload Parity

Electron live rebuild watching SHALL preserve native `FileWatcher` structure-priority behavior by not refreshing selected markdown solely from markdown paths when structure wins priority.

#### Scenario: Structure priority paths change
- **WHEN** the Electron project watcher receives a batch that includes both markdown content paths and structure-triggering paths
- **THEN** the shared watcher summary sent to the renderer has kind `structure`
- **AND** the summary contains no changed markdown paths
- **AND** Electron keeps the existing structure tree refresh and background compilation behavior

#### Scenario: Content-only markdown paths change
- **WHEN** the Electron project watcher receives markdown content paths without a structure or rebuild trigger
- **THEN** existing selected-markdown refresh behavior is retained
