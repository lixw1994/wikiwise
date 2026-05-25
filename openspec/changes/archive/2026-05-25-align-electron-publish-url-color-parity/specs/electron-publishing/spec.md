## ADDED Requirements

### Requirement: Publish Dialog URL Row Color Parity
The Electron publish dialog SHALL render the editable URL row with the native fixed-affix and editable-field color hierarchy.

#### Scenario: Publish URL row uses secondary affixes and primary input
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix and `.wiki-wise.com` suffix use secondary text coloring matching the native publish sheet
- **AND** the editable subdomain input remains primary text rather than secondary text
- **AND** the URL row layout, typography, and availability indicator are not changed for this requirement
