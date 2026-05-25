## ADDED Requirements

### Requirement: Terminal Panel Inset Parity
The Electron terminal tab SHALL place the xterm surface with the native top and leading inset.

#### Scenario: Terminal tab uses native asymmetric inset
- **WHEN** the Electron terminal tab is rendered
- **THEN** the terminal panel uses 4px top padding and 8px leading padding
- **AND** the terminal panel does not add trailing or bottom padding
- **AND** the xterm container does not add extra internal padding on every side
- **AND** PTY startup, terminal input/output, terminal resizing, ANSI rendering, Info tab behavior, tab switching, and sidebar resizing behavior are not changed for this requirement
