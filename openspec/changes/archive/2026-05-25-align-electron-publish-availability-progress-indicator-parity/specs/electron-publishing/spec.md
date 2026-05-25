## MODIFIED Requirements

### Requirement: Availability Feedback

The Electron app SHALL show subdomain availability feedback matching the native states, inline indicator, and hint copy.

#### Scenario: Subdomain changes

- **WHEN** the user edits the subdomain field
- **THEN** invalid characters are removed
- **AND** availability is checked through preload
- **AND** the UI distinguishes available, owned, taken, invalid, checking, and unknown states
- **AND** the subdomain row includes a fixed 16x16 availability indicator
- **AND** `checking` displays an in-progress indicator in the row
- **AND** `checking` does not display visible text or punctuation in the row indicator
- **AND** `available` and `owned` display a success indicator in the row
- **AND** `taken` displays a failure indicator in the row
- **AND** `invalid` displays a warning indicator in the row
- **AND** `unknown` displays an empty row indicator
- **AND** `taken` displays `This name is already taken. Try another.`
- **AND** `invalid` displays `3–48 characters, letters, numbers, and hyphens only.`
- **AND** `owned` displays `You already own this name.`
- **AND** `available`, `checking`, `unknown`, and fallback states display `Anyone with this link can view your wiki.`
