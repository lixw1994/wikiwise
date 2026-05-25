## ADDED Requirements

### Requirement: Post-Create Guide Intro Copy Parity
The Electron post-create guide SHALL render its agent and seed intro paragraphs with the same native SwiftUI typography and color.

#### Scenario: Post-create guide intro copy is inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the `Use the built-in terminal...` paragraph uses native 13px typography
- **AND** the `Once your agent is running, try:` paragraph uses native 13px typography
- **AND** both paragraphs use the native sidebar text color
- **AND** summary text, final guidance, lists, command rendering, headings, dividers, and dismiss behavior are preserved
