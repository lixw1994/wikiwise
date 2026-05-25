## ADDED Requirements

### Requirement: Runtime Watcher QA Evidence
The Electron live rebuild watching phase SHALL include runtime QA evidence that watched changes refresh the selected markdown preview.

#### Scenario: Watched markdown and CSS refresh is audited
- **WHEN** runtime watcher QA emits a watched markdown change for the selected file with CSS change semantics
- **THEN** Electron re-reads the selected markdown file from disk when it has no unsaved draft
- **AND** Electron refreshes the selected compiled preview with invalidate semantics
- **AND** Electron refreshes the selected compiled preview with CSS reload semantics
- **AND** Electron preserves the selected markdown page after the watcher refresh

## MODIFIED Requirements

### Requirement: Deferred Watcher Gaps

The live rebuild watching phase SHALL identify native watcher gaps that remain for later OpenSpec phases.

#### Scenario: Watcher refresh is available

- **WHEN** Electron responds to project filesystem changes
- **THEN** the phase verification records only watcher gaps that remain deferred after later parity slices are archived
- **AND** background drip compilation, scroll preservation, and runtime watcher QA are not listed as deferred once their parity evidence has been archived
