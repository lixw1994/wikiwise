## ADDED Requirements

### Requirement: Post-Create Guide Agent Command Chrome Parity
The Electron post-create guide SHALL render each quick-start command with native SwiftUI command text chrome.

#### Scenario: Post-create guide agent command chrome is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** each agent command uses native 12px monospaced typography
- **AND** each command uses the native sidebar muted text color
- **AND** each command uses the native sidebar background
- **AND** each command uses native 10px horizontal and 6px vertical padding
- **AND** each command uses a native 4px rounded rectangle without an added border
- **AND** existing command labels, command code IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior are preserved
