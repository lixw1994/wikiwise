## ADDED Requirements

### Requirement: New Wiki Name Field Rounded Border Parity
The Electron create-new-wiki dialog SHALL render the name field with native rounded-border text field density instead of relying only on shared form input chrome.

#### Scenario: New wiki name field is inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the name field keeps the `new-wiki-name` ID and native `My Wiki` placeholder
- **AND** the name field keeps the shared text input base class for behavior consistency
- **AND** the name field uses scoped new-wiki rounded-border styling for compact native sheet density
- **AND** publish and other non-new-wiki text inputs keep their existing shared input styling
