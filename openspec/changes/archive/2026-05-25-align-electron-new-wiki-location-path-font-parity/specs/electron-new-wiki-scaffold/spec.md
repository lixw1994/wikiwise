## ADDED Requirements

### Requirement: New Wiki Location Path Font Parity
The Electron create-new-wiki dialog SHALL render the selected location path using the native system text font rather than a monospace font stack.

#### Scenario: New wiki location path is inspected
- **WHEN** the Electron create-new-wiki dialog displays the selected location path
- **THEN** the path uses the native 12px system text font treatment
- **AND** the path does not use a monospace font family
- **AND** middle truncation, muted color, and full-path metadata remain available
- **AND** wiki creation continues to use the full selected location path
