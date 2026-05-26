## ADDED Requirements

### Requirement: Info Metadata Fallback Parity
The Electron INFO tab SHALL mirror native right-sidebar fallback behavior when selected-document metadata is unavailable.

#### Scenario: Selected document metadata is unavailable
- **WHEN** a selected document has no available document-info metadata
- **THEN** the INFO tab keeps the `ABOUT THIS DOCUMENT` section visible
- **AND** PATH displays the selected file name
- **AND** EDITED displays `—`
- **AND** WORDS displays `—`
- **AND** DIRECTIONS and LINKED sections stay hidden

#### Scenario: Document info refresh fails
- **WHEN** a selected document-info refresh rejects or cannot read metadata
- **THEN** Electron clears stale document metadata and re-renders the native fallback rows
- **AND** it does not show the generic shell error message for that metadata miss
