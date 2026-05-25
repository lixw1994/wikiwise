## ADDED Requirements

### Requirement: Publish Dialog Intro Font Parity
The Electron publish dialog SHALL render the URL intro copy with the native publish sheet text size.

#### Scenario: Publish URL intro uses native text size
- **WHEN** the publish dialog is rendered
- **THEN** the `Your wiki will be available at:` intro copy uses 13px text matching the native publish sheet
- **AND** the intro copy keeps the secondary summary color treatment
- **AND** the publish token warning remains compact 12px text
