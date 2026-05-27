## ADDED Requirements

### Requirement: Watcher Extension Case Parity

Electron live rebuild watching SHALL preserve native `FileWatcher` case-sensitive extension filtering for markdown and CSS changes.

#### Scenario: Upper-case watched extensions change
- **WHEN** the Electron project watcher receives changed paths ending in `.MD` or `.CSS`
- **THEN** those paths are ignored by markdown/CSS live refresh classification
- **AND** no selected-page refresh is scheduled solely for those upper-case extensions

#### Scenario: Lower-case watched extensions change
- **WHEN** the Electron project watcher receives changed paths ending in `.md` or `.css`
- **THEN** existing markdown and CSS live refresh behavior is retained
