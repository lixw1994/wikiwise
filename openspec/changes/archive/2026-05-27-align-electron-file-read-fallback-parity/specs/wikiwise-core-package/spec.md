## ADDED Requirements

### Requirement: Native-Compatible Display File Read Fallback
The core package SHALL provide a display-oriented text-file read helper that mirrors native `ContentView.loadFile(_:)` fallback behavior without changing ordinary throwing file reads.

#### Scenario: Display read fails
- **WHEN** JavaScript reads selected-file content for display and the UTF-8 file read fails
- **THEN** the helper returns the exact native fallback text `Could not read file.`
- **AND** the caller can continue presenting the selected file state

#### Scenario: Internal read remains throwing
- **WHEN** JavaScript uses the ordinary text-file read helper for a missing or unreadable file
- **THEN** the helper continues to throw so internal configuration and validation paths keep their existing error semantics
