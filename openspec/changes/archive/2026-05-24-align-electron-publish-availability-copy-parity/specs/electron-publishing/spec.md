## MODIFIED Requirements

### Requirement: Availability Feedback

The Electron app SHALL show subdomain availability feedback matching the native states and hint copy.

#### Scenario: Subdomain changes

- **WHEN** the user edits the subdomain field
- **THEN** invalid characters are removed
- **AND** availability is checked through preload
- **AND** the UI distinguishes available, owned, taken, invalid, checking, and unknown states
- **AND** `taken` displays `This name is already taken. Try another.`
- **AND** `invalid` displays `3–48 characters, letters, numbers, and hyphens only.`
- **AND** `owned` displays `You already own this name.`
- **AND** `available`, `checking`, `unknown`, and fallback states display `Anyone with this link can view your wiki.`
