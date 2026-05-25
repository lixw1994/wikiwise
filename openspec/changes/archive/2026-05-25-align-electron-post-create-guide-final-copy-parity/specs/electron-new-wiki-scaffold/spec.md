## ADDED Requirements

### Requirement: Post-Create Guide Final Guidance Parity
The Electron post-create guide SHALL render its final guidance paragraph with the same native SwiftUI typography, color, and line spacing.

#### Scenario: Post-create guide final guidance is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the final `This is your project...` guidance paragraph uses native 13px typography
- **AND** the paragraph uses the native sidebar text color
- **AND** the paragraph uses line spacing equivalent to native `.lineSpacing(2)`
- **AND** summary text, intro copy, headings, dividers, lists, command rendering, and dismiss behavior are preserved
