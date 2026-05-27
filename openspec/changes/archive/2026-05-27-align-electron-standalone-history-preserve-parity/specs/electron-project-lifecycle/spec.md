## ADDED Requirements

### Requirement: Standalone File History Preservation Parity

Electron project lifecycle behavior SHALL mirror native SwiftUI by preserving existing navigation history when a standalone-file project result is applied and by clearing navigation history when a folder project result is applied.

#### Scenario: User opens a standalone file after navigating in a project
- **WHEN** the Electron renderer already has back or forward navigation history
- **AND** the user opens a standalone markdown or plain-text file
- **THEN** Electron applies the standalone-file project result
- **AND** Electron preserves the existing back and forward history stacks
- **AND** this matches native `openURL(_:)`, whose standalone-file branch does not clear `backHistory` or `forwardHistory`

#### Scenario: User opens a folder project
- **WHEN** the Electron renderer applies a folder project result
- **THEN** Electron clears the existing back and forward history stacks
- **AND** this matches native `openURL(_:)`, whose folder branch clears both history stacks

#### Scenario: Standalone file open does not become a history push
- **WHEN** Electron applies a standalone-file project result
- **THEN** Electron does not push the previously selected file or generated page onto history as part of that project result
- **AND** ordinary in-project file and generated-page navigation history behavior remains unchanged
