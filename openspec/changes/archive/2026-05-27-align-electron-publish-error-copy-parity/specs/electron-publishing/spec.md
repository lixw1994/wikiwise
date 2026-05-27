## ADDED Requirements

### Requirement: Publish Error Copy Parity
The Electron app SHALL surface native publish failure descriptions in publish error feedback.

#### Scenario: Publish helper rejects with native copy
- **WHEN** publishing fails through the shared publish helper
- **THEN** the Electron renderer stores the thrown failure message
- **AND** the publish error modal displays that message under the native `Publish Error` title
- **AND** the modal keeps its native `OK` dismissal behavior

#### Scenario: Publish copy remains source-aligned
- **WHEN** native `Publisher.PublishError.errorDescription` defines fixed copy for corrupt config, token mismatch, subdomain taken, or rate limiting
- **THEN** Electron/shared publish tests retain assertions that those native strings are represented in the shared helper behavior
