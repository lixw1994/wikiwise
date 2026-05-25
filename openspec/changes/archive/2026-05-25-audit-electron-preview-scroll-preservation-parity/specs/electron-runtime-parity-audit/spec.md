## ADDED Requirements

### Requirement: Compiled Preview Scroll Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that compiled WIKI preview scroll position is restored after switching away from and back to WIKI mode.

#### Scenario: Runtime audit records preview scroll restoration
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it scrolls the compiled WIKI preview frame before switching to FILE mode
- **AND** it returns to WIKI mode for the same selected markdown file
- **AND** it records the preview scroll target fraction and restored scroll fraction in the report
- **AND** it records whether the restored fraction is within parity tolerance

#### Scenario: Runtime audit fails missing preview scroll restoration
- **WHEN** compiled WIKI preview scroll evidence is absent, cannot scroll, or restores outside tolerance
- **THEN** runtime audit fails the affected project scenario
