## ADDED Requirements

### Requirement: Publish Token Warning Line Spacing Parity
The Electron publish dialog SHALL render the publish-token warning paragraph with native publish sheet line spacing.

#### Scenario: Publish token warning uses native line spacing
- **WHEN** the publish dialog is rendered
- **THEN** the publish-token warning paragraph uses line spacing equivalent to the native 12pt text with `.lineSpacing(2)`
- **AND** global summary line height for other paragraphs is not changed for this requirement
- **AND** publish-token warning copy, color, font size, and dialog content gap are not changed for this requirement
