## ADDED Requirements

### Requirement: Info Directions Callout Parity
The Electron INFO tab SHALL render frontmatter directions with the native gold callout styling.

#### Scenario: Directions section uses native callout styling
- **WHEN** a selected document has frontmatter directions
- **THEN** the INFO tab shows the `DIRECTIONS` section with the existing directions text
- **AND** the directions text uses native 12px serif italic typography, info-value text color, 3px line-spacing equivalent, 10px vertical and 12px horizontal padding, accent-gold translucent background, and a 2px leading accent-gold strip
- **AND** directions parsing, directions section visibility, linked targets, metadata rows, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement
