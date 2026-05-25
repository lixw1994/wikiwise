## ADDED Requirements

### Requirement: Post-Create Guide Summary Text Parity
The Electron post-create guide SHALL render its opening summary paragraph with the same native SwiftUI typography, color, and line spacing.

#### Scenario: Post-create guide summary is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `WikiWise created the folder structure...` summary uses native 14px typography
- **AND** the summary uses the native sidebar text color
- **AND** the summary uses line spacing equivalent to native `.lineSpacing(3)`
- **AND** later guide paragraphs, guide copy, command rendering, and dismiss behavior are preserved
