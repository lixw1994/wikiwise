## ADDED Requirements

### Requirement: Publish Subdomain Input Padding Parity
The Electron publish dialog SHALL render the editable subdomain field like the native plain text field without extra input padding.

#### Scenario: Subdomain input uses native plain padding
- **WHEN** the publish dialog is rendered
- **THEN** the editable subdomain input has no internal padding beyond the URL row padding
- **AND** the input remains borderless, transparent, and font-inherited
- **AND** the URL row padding is not changed for this requirement
