## MODIFIED Requirements

### Requirement: PTY Terminal Parity Phase Completion Tracking

The migration roadmap SHALL record Electron PTY terminal parity as a final native parity gap closure phase.

#### Scenario: PTY terminal parity phase is archived

- **WHEN** the Electron PTY terminal parity change is archived
- **THEN** retained verification records PTY-backed shell startup, xterm-compatible rendering, direct input, resize evidence, native warm palette evidence, xterm style/CSP color evidence, prompt cell color evidence, focused cursor blink evidence, rendered cursor evidence, and absence of Electron-only terminal startup text
- **AND** remaining final parity evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
