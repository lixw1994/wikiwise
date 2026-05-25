## ADDED Requirements

### Requirement: Info About Section Parity
The Electron INFO tab SHALL render selected-document metadata with the native `ABOUT THIS DOCUMENT` grouping and row styling.

#### Scenario: Metadata section is hidden without a selected document
- **WHEN** no document is selected
- **THEN** the INFO tab does not show the `ABOUT THIS DOCUMENT` section
- **AND** it does not show a `No document` placeholder in the metadata section

#### Scenario: Metadata section uses native grouping when a document is selected
- **WHEN** a document is selected
- **THEN** the INFO tab shows an `ABOUT THIS DOCUMENT` section above PATH, EDITED, and WORDS
- **AND** the section header uses native uppercase monospaced 9px text with 1.6px tracking and sidebar-header color
- **AND** metadata rows use native horizontal label/value layout with 10px monospaced labels, 12px serif values, sidebar-header label color, and info-value value color
- **AND** document info IPC, formatted edited time, word count, directions, linked targets, tab switching, and sidebar resizing behavior are not changed for this requirement
