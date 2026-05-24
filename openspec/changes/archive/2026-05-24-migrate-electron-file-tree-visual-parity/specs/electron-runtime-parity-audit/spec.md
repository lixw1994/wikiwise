## ADDED Requirements

### Requirement: File Tree Visual Evidence
The Electron runtime parity audit SHALL retain evidence that native file-tree visual markers are present.

#### Scenario: Project runtime evidence includes file tree visuals
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records folder icon presence
- **AND** it records special folder marker presence
- **AND** it records selected file accent evidence

#### Scenario: File tree visual evidence fails parity
- **WHEN** folder icons, special folder markers, or selected file accent evidence are missing
- **THEN** runtime audit fails the scenario
