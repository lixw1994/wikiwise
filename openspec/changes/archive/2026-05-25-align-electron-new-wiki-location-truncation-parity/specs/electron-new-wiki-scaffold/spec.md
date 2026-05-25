## ADDED Requirements

### Requirement: New Wiki Location Middle Truncation Parity
The Electron create-new-wiki dialog SHALL mirror the native sheet's one-line middle truncation for the selected location path.

#### Scenario: Long new-wiki location is displayed
- **WHEN** the Electron create-new-wiki dialog displays a long selected location path
- **THEN** the visible location text preserves the beginning and trailing folder name with an ellipsis in the middle
- **AND** the full selected location remains available as label metadata
- **AND** wiki creation continues to use the full selected location path
- **AND** short selected location paths remain unchanged
