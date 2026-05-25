## ADDED Requirements

### Requirement: Watcher Refresh Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that project watcher events refresh the selected markdown preview through the preload bridge.

#### Scenario: Runtime audit records watcher refresh
- **WHEN** the runtime audit captures an opened-project scenario with scaffold `home.md` selected
- **THEN** it records that the renderer started the project watcher through preload
- **AND** it sends a project-change event for the selected markdown file with CSS change semantics
- **AND** it records that the renderer re-read the selected markdown file
- **AND** it records that the renderer requested a compiled preview refresh with invalidate semantics
- **AND** it records that the compiled preview refresh used CSS reload semantics
- **AND** it records that `home.md` remains the selected markdown page after the watcher refresh

#### Scenario: Runtime audit fails missing watcher refresh evidence
- **WHEN** watcher runtime evidence is absent, the watcher did not start, the selected markdown refresh was not compiled, CSS reload semantics were not used, or the selected markdown page was not preserved
- **THEN** runtime audit fails the affected project scenario
