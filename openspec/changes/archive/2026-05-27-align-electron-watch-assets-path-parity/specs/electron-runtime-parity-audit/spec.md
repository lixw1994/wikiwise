## ADDED Requirements

### Requirement: Runtime Audit Graceful Window Shutdown

The Electron runtime audit SHALL close its audit BrowserWindow gracefully before the main process completes the audit command.

#### Scenario: Audit shutdown script is inspected
- **WHEN** the runtime audit script is inspected
- **THEN** it waits for the audit BrowserWindow to close
- **AND** it closes the BrowserWindow without forcing destruction

#### Scenario: Passing runtime audit exits cleanly
- **WHEN** all runtime audit scenario assertions pass
- **THEN** the command exits successfully after writing the retained report and screenshots
