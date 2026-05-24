# electron-publishing Specification

## Purpose
Define Electron parity for publishing, availability feedback, publish result alerts, and unpublish behavior.
## Requirements
### Requirement: Publish Control

The Electron app SHALL expose a publishing control for opened projects with native-equivalent contextual help.

#### Scenario: Project toolbar displays publish action

- **WHEN** a project is opened in Electron
- **THEN** the renderer displays a publish action
- **AND** the action is disabled while publishing is already in progress
- **AND** the action exposes the native unpublished help text `Publish wiki to wiki-wise.com` when no published config exists

#### Scenario: Published project toolbar shows publish status help

- **WHEN** a project has publish config with a published URL
- **THEN** the publish action help includes the last published time or `never`
- **AND** the help includes the published URL
- **AND** the help includes the native URL-change hint

### Requirement: Publish Dialog

The Electron app SHALL let users choose or edit the wiki subdomain before publishing.

#### Scenario: First publish dialog opens

- **WHEN** the user opens the publish dialog for a project without `publish.json`
- **THEN** the dialog displays a generated subdomain candidate
- **AND** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** publishing is disabled until the subdomain is available

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the subdomain state is treated as owned unless an availability check says otherwise

### Requirement: Availability Feedback

The Electron app SHALL show subdomain availability feedback matching the native states.

#### Scenario: Subdomain changes

- **WHEN** the user edits the subdomain field
- **THEN** invalid characters are removed
- **AND** availability is checked through preload
- **AND** the UI distinguishes available, owned, taken, invalid, checking, and unknown states

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

### Requirement: Publish Alert Visual Parity
The Electron publishing modal feedback SHALL reuse the app dialog surface instead of floating inline page messages.

#### Scenario: Publish feedback is rendered
- **WHEN** publish success, publish error, or unpublish confirmation feedback is visible
- **THEN** the feedback is presented in a modal panel over the current app surface
- **AND** the inactive publish dialog controls remain hidden or disabled as appropriate
- **AND** the page does not show duplicate inline publish result or error text outside the modal
