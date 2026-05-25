## ADDED Requirements

### Requirement: New Wiki Action Button Chrome Parity
The Electron create-new-wiki dialog SHALL use native sheet action button chrome instead of app-branded shared modal action styles.

#### Scenario: New wiki action buttons are inspected
- **WHEN** the Electron create-new-wiki dialog is rendered
- **THEN** the Cancel and Create buttons do not use the shared app-branded primary or secondary action classes
- **AND** the Cancel and Create controls keep their IDs and labels
- **AND** the Create control keeps native default-action semantics and disabled behavior
- **AND** publish, unpublish, feedback, and other non-new-wiki dialogs keep their existing shared action button styling
