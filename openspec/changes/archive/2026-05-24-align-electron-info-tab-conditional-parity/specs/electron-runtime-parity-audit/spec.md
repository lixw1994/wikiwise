## ADDED Requirements

### Requirement: Info Optional Section Evidence
The Electron runtime parity audit SHALL retain evidence that empty optional INFO sections match the native right-sidebar behavior.

#### Scenario: Runtime audit records empty optional INFO sections
- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it activates the INFO tab for the selected scaffold `home.md`
- **AND** it records whether the directions section is visible
- **AND** it records whether the linked section is visible

#### Scenario: Runtime audit fails visible empty optional INFO sections
- **WHEN** scaffold `home.md` has no directions or wikilinks
- **THEN** runtime audit fails if the directions section is visible
- **AND** runtime audit fails if the linked section is visible
- **AND** runtime audit fails if placeholder text such as `None` is shown for missing optional INFO content
