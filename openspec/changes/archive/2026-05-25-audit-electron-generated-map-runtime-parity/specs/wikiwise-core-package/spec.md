## ADDED Requirements

### Requirement: Progressive Cache Full Compile Compatibility
The core compiler SHALL complete full generated output after progressive scan or page compilation has seeded cache entries with deferred HTML.

#### Scenario: Full compile follows progressive scan
- **WHEN** a project has been scanned progressively and at least one markdown page has been compiled on demand
- **AND** a fresh compiler instance performs a full compile for the same project
- **THEN** full compilation succeeds without treating deferred HTML cache entries as rendered pages
- **AND** generated map output such as `map-3d.html` exists in the output directory
