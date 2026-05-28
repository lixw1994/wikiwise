## ADDED Requirements

### Requirement: Terminal Cursor Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that opened-project terminal scenarios render a visible terminal cursor.

#### Scenario: Project runtime audit records cursor evidence
- **WHEN** the runtime audit opens a folder project and shows the TERMINAL tab
- **THEN** the report records that xterm cursor evidence is present for the visible terminal surface
- **AND** the report records that focused and inactive cursor styles use a block shape
- **AND** existing terminal startup, resize, input, echo, screenshot, and appearance evidence remain unchanged

#### Scenario: Missing cursor fails runtime parity
- **WHEN** an opened-project runtime scenario has no xterm cursor evidence or does not use block cursor styles
- **THEN** the runtime audit fails that scenario
- **AND** the failure message identifies terminal cursor parity as the missing evidence
