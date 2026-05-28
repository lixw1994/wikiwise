## ADDED Requirements

### Requirement: Real Terminal Runtime Evidence
The Electron runtime parity audit SHALL retain evidence from the real main-process PTY terminal path for opened-project scenarios.

#### Scenario: Project runtime audit sends input through real terminal IPC
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** terminal startup uses the production `wikiwise:startTerminal` handler instead of a synthetic terminal-start stub
- **AND** terminal input uses the production `wikiwise:sendTerminalInput` handler instead of a synthetic input-observation stub
- **AND** the audit sends a command through xterm and records the echoed command output in the report

#### Scenario: Real terminal runtime evidence fails parity
- **WHEN** the xterm terminal is missing, real terminal output is absent, or the audit command output is not echoed by the terminal
- **THEN** the runtime audit fails the affected opened-project scenario
