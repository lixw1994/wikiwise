## ADDED Requirements

### Requirement: Native Window Viewport Evidence
The Electron runtime parity audit SHALL capture screenshots at the native SwiftUI default window viewport.

#### Scenario: Audit viewport is inspected
- **WHEN** the runtime audit script is inspected
- **THEN** it uses a viewport width of 1500
- **AND** it uses a viewport height of 1000

#### Scenario: Audit report records native viewport
- **WHEN** the runtime audit command completes successfully
- **THEN** the report includes viewport evidence with width 1500
- **AND** the report includes viewport evidence with height 1000
- **AND** screenshot dimensions are validated against that native viewport
