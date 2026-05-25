## ADDED Requirements

### Requirement: Info Optional Section Divider Parity
The Electron INFO tab SHALL render optional `DIRECTIONS` and `LINKED` sections with the native top divider and spacing.

#### Scenario: Optional info sections use native top divider rhythm
- **WHEN** a selected document has directions or wikilink targets
- **THEN** the corresponding optional INFO section uses a 1px sidebar-rule top divider
- **AND** the section content starts 18px below the divider
- **AND** the base `ABOUT THIS DOCUMENT` metadata list does not add artificial bottom margin in place of the optional divider
- **AND** directions callout styling, linked row styling, optional section visibility, document metadata, tab switching, terminal behavior, and sidebar resizing behavior are not changed for this requirement
