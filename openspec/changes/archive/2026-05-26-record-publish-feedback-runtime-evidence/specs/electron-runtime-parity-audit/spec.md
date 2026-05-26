## ADDED Requirements

### Requirement: Publish Feedback Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that publish success, publish error, external browser, and unpublish feedback flows run through the real renderer and preload bridge.

#### Scenario: Runtime audit records publish feedback flows

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it drives a successful first publish through the publish dialog after availability permits publishing
- **AND** it records the native `Published!` result title and first-publish result copy
- **AND** it records that the result has no duplicate standalone URL field
- **AND** it records that `Open in Browser` routes the published URL through the preload external URL bridge and dismisses the result
- **AND** it drives a publish failure and records the native `Publish Error` modal title, failure message, and dismissal behavior
- **AND** it records that an already-published project shows `Unpublish...`, opens the native destructive confirmation, and clears published config after successful unpublish
- **AND** it restores the selected `home.md` editor audit state after the publish feedback evidence is captured

#### Scenario: Runtime audit fails missing publish feedback evidence

- **WHEN** publish feedback runtime evidence is absent or incomplete
- **THEN** runtime audit fails the project scenario
- **AND** runtime audit fails if success copy, external-open routing, error modal copy, unpublish confirmation, unpublish cleanup, or restored editor state is missing
