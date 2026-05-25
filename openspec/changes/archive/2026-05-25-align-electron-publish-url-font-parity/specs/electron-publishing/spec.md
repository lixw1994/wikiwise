## ADDED Requirements

### Requirement: Publish Dialog URL Row Font Parity
The Electron publish dialog SHALL render the editable URL row with the native monospaced text size.

#### Scenario: Publish URL row uses native monospaced size
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix, editable subdomain, and `.wiki-wise.com` suffix use 13px monospaced text matching the native publish sheet
- **AND** the subdomain input inherits the URL row font treatment
- **AND** the availability indicator dimensions are not changed for this requirement
