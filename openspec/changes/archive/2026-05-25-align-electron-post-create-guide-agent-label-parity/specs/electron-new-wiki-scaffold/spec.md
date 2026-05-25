## ADDED Requirements

### Requirement: Post-Create Guide Agent Command Label Parity
The Electron post-create guide SHALL render visible agent labels above each quick-start command with native SwiftUI typography and color.

#### Scenario: Post-create guide agent command labels are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the Claude Code command is labeled `Claude Code`
- **AND** the Codex command is labeled `Codex`
- **AND** the Cursor command is labeled `Cursor`
- **AND** each label uses native 12px semibold typography and sidebar text color
- **AND** existing command code IDs, command population behavior, guide copy, dividers, headings, and dismiss behavior are preserved
