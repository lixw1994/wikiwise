## MODIFIED Requirements

### Requirement: Info About Section Parity
The Electron INFO tab SHALL render selected-document metadata with the native `ABOUT THIS DOCUMENT` grouping and row styling.

#### Scenario: Metadata section uses native grouping when a document is selected
- **WHEN** a document is selected
- **THEN** the INFO tab shows an `ABOUT THIS DOCUMENT` section above PATH, EDITED, and WORDS
- **AND** the section header uses native uppercase monospaced 9px text with 1.6px tracking and sidebar-header color
- **AND** metadata rows use native horizontal label/value layout with 10px monospaced labels, 12px native serif values, sidebar-header label color, and info-value value color
- **AND** document info IPC, formatted edited time, word count, directions, linked targets, tab switching, and sidebar resizing behavior are not changed for this requirement

### Requirement: Info Directions Callout Parity
The Electron INFO tab SHALL render frontmatter directions with the native gold callout styling.

#### Scenario: Directions section uses native callout styling
- **WHEN** a selected document has frontmatter directions
- **THEN** the INFO tab shows the `DIRECTIONS` section with the existing directions text
- **AND** the directions text uses effective native 12px serif italic typography, info-value text color, 3px line-spacing equivalent, 10px vertical and 12px horizontal padding, accent-gold translucent background, and a 2px leading accent-gold strip
- **AND** the directions serif declaration has enough selector specificity to override the generic INFO paragraph typography
- **AND** directions parsing, directions section visibility, linked targets, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement

### Requirement: Info Linked Rows Style Parity
The Electron INFO tab SHALL render wikilink target rows with the native linked-row visual styling.

#### Scenario: Linked section rows use native typography and spacing
- **WHEN** a selected document contains wikilink targets
- **THEN** the INFO tab shows the `LINKED` section with the existing linked target rows
- **AND** each linked target keeps the native `↗ target` marker
- **AND** linked rows use native 13px serif typography, linked-text color, and 4px row spacing
- **AND** wikilink extraction, linked section visibility, directions callout, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement
