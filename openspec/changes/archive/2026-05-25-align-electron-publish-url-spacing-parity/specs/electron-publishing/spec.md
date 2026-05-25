## ADDED Requirements

### Requirement: Publish Dialog URL Row Spacing Parity
The Electron publish dialog SHALL render the editable URL row without extra spacing between URL row items.

#### Scenario: Publish URL row uses native zero item spacing
- **WHEN** the publish dialog is rendered
- **THEN** the `https://` prefix, editable subdomain, `.wiki-wise.com` suffix, spacer, and availability indicator are arranged with zero item gap matching the native `HStack(spacing: 0)`
- **AND** the URL row grid columns and availability indicator dimensions are not changed for this requirement
