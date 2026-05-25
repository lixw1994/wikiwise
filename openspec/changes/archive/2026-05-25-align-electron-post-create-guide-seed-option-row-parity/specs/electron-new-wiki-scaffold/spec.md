## ADDED Requirements

### Requirement: Post-Create Guide Seed Option Row Parity
The Electron post-create guide SHALL render each seed suggestion as a native-style seed option row with icon, title, and command hierarchy.

#### Scenario: Post-create guide seed option rows are inspected
- **WHEN** Electron shows the post-create guide after creating a wiki
- **THEN** the seed section renders four rows for `Import from Readwise`, `Ingest an article`, `Import existing files`, and `Start from a topic`
- **AND** each row includes the corresponding native symbol identifier: `book`, `link`, `folder`, and `text.bubble`
- **AND** each icon uses native 13px accent-primary styling and a 20px column
- **AND** each row uses native 10px icon-to-text spacing
- **AND** each text stack uses native 2px title-to-command spacing
- **AND** each title uses native 13px medium sidebar-selected text styling
- **AND** each command uses native 12px monospaced sidebar-muted text styling
- **AND** existing seed option copy, command quick-start rows, guide copy, dividers, headings, and dismiss behavior are preserved
