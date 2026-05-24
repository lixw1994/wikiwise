## ADDED Requirements

### Requirement: Watch Event Classification

The core package SHALL expose helpers that classify and coalesce watched filesystem events according to native FileWatcher rules.

#### Scenario: Watched events are summarized

- **WHEN** JavaScript summarizes changed paths for a project root and output directory
- **THEN** paths inside the output directory are ignored
- **AND** root `.rebuild` events produce a rebuild summary
- **AND** markdown create/delete/rename, support JS/map files, and `wiki/assets` changes produce a structure summary
- **AND** CSS changes and markdown content changes produce a content summary
