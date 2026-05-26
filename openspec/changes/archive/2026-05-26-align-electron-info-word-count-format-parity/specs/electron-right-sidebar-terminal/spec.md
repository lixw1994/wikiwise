## ADDED Requirements

### Requirement: Info Word Count Format Parity
The Electron INFO tab SHALL render selected-document word counts with the same native decimal grouping behavior used by SwiftUI.

#### Scenario: Large word count is displayed
- **WHEN** the selected document metadata contains a numeric word count large enough to use decimal grouping in the user's locale
- **THEN** the INFO tab WORDS value is formatted with locale-aware decimal grouping
- **AND** the renderer does not display the raw unformatted numeric string
- **AND** document-info IPC continues to expose the underlying numeric word count
- **AND** PATH, EDITED, directions, linked targets, tab switching, terminal behavior, and sidebar resizing behavior are unchanged
