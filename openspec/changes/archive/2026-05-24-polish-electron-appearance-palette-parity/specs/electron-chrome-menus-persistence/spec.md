## ADDED Requirements

### Requirement: Visible Appearance Palette
The Electron renderer SHALL reflect stored appearance mode as visible shell palette changes, not only as persisted state.

#### Scenario: User cycles to dark appearance
- **WHEN** the user cycles appearance mode to `Dark`
- **THEN** the renderer sets dark appearance state
- **AND** primary visible shell surfaces use dark palette colors matching the native app

#### Scenario: User cycles to light appearance
- **WHEN** the user cycles appearance mode to `Light`
- **THEN** the renderer sets light appearance state
- **AND** primary visible shell surfaces use light palette colors matching the native app
