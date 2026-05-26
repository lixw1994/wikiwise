## ADDED Requirements

### Requirement: Publish Dialog Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that an opened project can display and dismiss the first-publish dialog through the real renderer.

#### Scenario: Runtime audit records first-publish dialog

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it opens the publish dialog from the project toolbar
- **AND** it records that the dialog is visible with the native publish title
- **AND** it records the generated subdomain candidate and final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** it records the native publish-token warning copy
- **AND** it records the availability hint and inline indicator state
- **AND** it records that the `Publish` action remains disabled while availability is not available or owned
- **AND** it records that the first-publish dialog does not show `Unpublish...`
- **AND** it closes the dialog and restores the selected `home.md` editor audit state

#### Scenario: Runtime audit fails missing publish dialog evidence

- **WHEN** an opened-project runtime audit cannot open the publish dialog
- **THEN** runtime audit fails the project scenario
- **AND** runtime audit fails if title, URL row, token warning, availability evidence, disabled Publish state, hidden `Unpublish...`, cancel closure, or restored editor state is missing
