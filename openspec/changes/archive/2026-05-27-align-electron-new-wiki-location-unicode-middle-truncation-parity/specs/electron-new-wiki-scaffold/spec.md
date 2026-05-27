## ADDED Requirements

### Requirement: New Wiki Location Unicode Middle Truncation Parity
The Electron create-new-wiki dialog SHALL middle-truncate selected location paths without splitting Unicode characters.

#### Scenario: Unicode long path is displayed
- **WHEN** the Electron create-new-wiki dialog displays a long selected location path containing retained supplementary-plane Unicode characters
- **THEN** the visible location text preserves whole characters on both sides of the middle ellipsis
- **AND** the visible text does not contain unpaired surrogate code units
- **AND** the full selected location remains available through the label title and accessibility metadata
- **AND** wiki creation continues to use the full selected location path

#### Scenario: Short Unicode path is displayed
- **WHEN** the selected location path fits within the display budget by character count
- **THEN** the visible location text remains unchanged
