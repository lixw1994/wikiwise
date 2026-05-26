## ADDED Requirements

### Requirement: Clean Runtime Audit Success Shutdown
The Electron runtime audit SHALL exit successfully and cleanly after all scenario assertions pass and retained evidence is written.

#### Scenario: Successful audit exits cleanly
- **WHEN** the runtime audit command completes all scenarios with passing assertions
- **THEN** it writes the JSON report and screenshot artifacts
- **AND** it exits with status `0`
- **AND** it does not terminate through an immediate successful Electron process exit that can trap queued teardown work after report generation

#### Scenario: Failed audit remains non-zero
- **WHEN** the runtime audit detects failed scenario assertions or throws before successful completion
- **THEN** it exits non-zero
- **AND** it preserves the failure output needed for diagnosis
