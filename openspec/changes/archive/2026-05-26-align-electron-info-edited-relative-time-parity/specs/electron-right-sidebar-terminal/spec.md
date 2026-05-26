## ADDED Requirements

### Requirement: Info Edited Relative Time Format Parity
The Electron INFO tab SHALL render selected-document edited timestamps with native numeric relative time formatting.

#### Scenario: Old edited timestamp is displayed
- **WHEN** the selected document metadata contains a modified timestamp older than one week
- **THEN** the INFO tab EDITED value remains a localized relative time value
- **AND** weeks, months, or years are used instead of an absolute date/time string
- **AND** named shortcuts such as `yesterday` are not used in place of numeric relative values
- **AND** document-info IPC continues to expose the underlying modified timestamp
- **AND** PATH, WORDS, directions, linked targets, tab switching, terminal behavior, and sidebar resizing behavior are unchanged
