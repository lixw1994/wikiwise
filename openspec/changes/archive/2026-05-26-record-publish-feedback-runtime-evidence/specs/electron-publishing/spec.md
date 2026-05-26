## ADDED Requirements

### Requirement: Publish Feedback Runtime Evidence

The Electron publishing implementation SHALL have live runtime evidence for publish success, publish error, external open, and unpublish confirmation flows in addition to static native parity tests.

#### Scenario: Runtime evidence covers publish success feedback

- **WHEN** the Electron runtime audit completes a first-publish flow with mocked publish success
- **THEN** retained evidence proves the native `Published!` modal title and first-publish result body are shown
- **AND** retained evidence proves the duplicate standalone result URL remains hidden
- **AND** retained evidence proves `Open in Browser` routes the published URL through preload and dismisses the result
- **AND** retained evidence proves published config state refreshes after success

#### Scenario: Runtime evidence covers publish error feedback

- **WHEN** the Electron runtime audit completes a publish flow with mocked publish failure
- **THEN** retained evidence proves the native `Publish Error` modal title and failure message are shown
- **AND** retained evidence proves dismissing the error re-enables publish controls

#### Scenario: Runtime evidence covers unpublish feedback

- **WHEN** the Electron runtime audit starts from a mocked published project
- **THEN** retained evidence proves the publish dialog shows `Unpublish...`
- **AND** retained evidence proves the native `Unpublish wiki?` confirmation is shown
- **AND** retained evidence proves confirming unpublish calls preload and clears published config state
