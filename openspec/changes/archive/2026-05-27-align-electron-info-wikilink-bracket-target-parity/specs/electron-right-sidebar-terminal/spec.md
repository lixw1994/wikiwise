## ADDED Requirements

### Requirement: Info Wikilink Bracket Target Parity
The Electron INFO tab SHALL show linked targets using shared document-info extraction that matches native `RightSidebar.wikilinkTargets(in:)` scanner behavior.

#### Scenario: Linked target contains a single bracket
- **WHEN** a selected markdown document contains a wikilink target with a single `]` before the closing `]]`
- **THEN** the Electron INFO linked section includes that target with the native `↗ target` marker
- **AND** directions, metadata rows, tab switching, terminal behavior, and right-sidebar styling remain unchanged

#### Scenario: Wikilink extraction remains source-aligned
- **WHEN** native `RightSidebar.wikilinkTargets(in:)` scans to the next `]]` and takes the raw intervening target
- **THEN** Electron/shared tests retain assertions that shared document-info parsing allows single `]` characters inside targets
