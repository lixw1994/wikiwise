## ADDED Requirements

### Requirement: Publish Dialog URL Display Parity
The Electron publish dialog SHALL present the publish URL only through the native editable URL row.

#### Scenario: Publish dialog renders URL shape without duplicate detail row
- **WHEN** the publish dialog is shown
- **THEN** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape in the editable URL row
- **AND** the dialog does not render a standalone duplicate URL paragraph below the editable URL row
- **AND** the renderer does not update a separate publish URL text node outside the editable URL row
