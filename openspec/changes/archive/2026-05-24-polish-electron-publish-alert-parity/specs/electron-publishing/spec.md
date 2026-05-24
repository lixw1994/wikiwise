## MODIFIED Requirements

### Requirement: Publish Result
The Electron app SHALL surface publish success and failure to the user using native-like modal feedback.

#### Scenario: Publish succeeds
- **WHEN** publishing completes successfully
- **THEN** the renderer shows a modal result titled `Published!`
- **AND** the result includes the published URL
- **AND** the result includes an `Open in Browser` action that opens the published URL through the preload external URL bridge
- **AND** the result includes an `OK` action that dismisses the result
- **AND** the renderer refreshes its publish config state

#### Scenario: Publish fails
- **WHEN** publishing fails
- **THEN** the renderer shows a modal error titled `Publish Error`
- **AND** the error includes the publish failure message
- **AND** the error includes an `OK` action that dismisses the error
- **AND** publishing controls are re-enabled

### Requirement: Unpublish Flow
The Electron app SHALL support unpublishing an already published wiki with native-like destructive confirmation.

#### Scenario: Published wiki asks for unpublish confirmation
- **WHEN** a project has publish config and the user selects `Unpublish...`
- **THEN** the renderer shows an app-owned confirmation titled `Unpublish wiki?`
- **AND** the confirmation explains that the wiki will be taken offline and local files are not affected
- **AND** the confirmation offers `Cancel` and destructive `Unpublish` actions
- **AND** the renderer does not use the browser `window.confirm` dialog

#### Scenario: Published wiki is unpublished
- **WHEN** the user confirms unpublish
- **THEN** the renderer asks preload to unpublish
- **AND** the local publish config state is cleared after success
- **AND** the confirmation closes after success

## ADDED Requirements

### Requirement: Publish Alert Visual Parity
The Electron publishing modal feedback SHALL reuse the app dialog surface instead of floating inline page messages.

#### Scenario: Publish feedback is rendered
- **WHEN** publish success, publish error, or unpublish confirmation feedback is visible
- **THEN** the feedback is presented in a modal panel over the current app surface
- **AND** the inactive publish dialog controls remain hidden or disabled as appropriate
- **AND** the page does not show duplicate inline publish result or error text outside the modal
