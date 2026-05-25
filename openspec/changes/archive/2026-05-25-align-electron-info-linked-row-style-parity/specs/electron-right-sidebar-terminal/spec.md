## ADDED Requirements

### Requirement: Info Linked Rows Style Parity
The Electron INFO tab SHALL render wikilink target rows with the native linked-row visual styling.

#### Scenario: Linked section rows use native typography and spacing
- **WHEN** a selected document contains wikilink targets
- **THEN** the INFO tab shows the `LINKED` section with the existing linked target rows
- **AND** each linked target keeps the native `↗ target` marker
- **AND** linked rows use native 13px serif typography, linked-text color, and 4px row spacing
- **AND** wikilink extraction, linked section visibility, directions callout, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement
