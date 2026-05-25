# electron-publishing Specification

## Purpose
Define Electron parity for publishing, availability feedback, publish result alerts, and unpublish behavior.
## Requirements
### Requirement: Publish Control

The Electron app SHALL expose a publishing control for opened projects with native-equivalent contextual help and visible labels.

#### Scenario: Project toolbar displays publish action

- **WHEN** a project is opened in Electron
- **THEN** the renderer displays a publish action
- **AND** the normal publish action label is `PUBLISH ↑`
- **AND** the action is disabled while publishing or unpublishing is already in progress
- **AND** the busy publish action label is `PUBLISHING…` while publishing or unpublishing is in progress
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
- **AND** the dialog shows the native `publish.json` token warning, including the password/lost-token sentence
- **AND** publishing is disabled until the subdomain is available
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the subdomain state is treated as owned unless an availability check says otherwise
- **AND** the dialog shows the native `Unpublish…` action
- **AND** the native `Unpublish…` action label remains unchanged while shown
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins

### Requirement: Availability Feedback

The Electron app SHALL show subdomain availability feedback matching the native states, inline indicator, and hint copy.

#### Scenario: Subdomain changes

- **WHEN** the user edits the subdomain field
- **THEN** invalid characters are removed
- **AND** availability is checked through preload
- **AND** the UI distinguishes available, owned, taken, invalid, checking, and unknown states
- **AND** the subdomain row includes a fixed 16x16 availability indicator
- **AND** `checking` displays an in-progress indicator in the row
- **AND** `checking` does not display visible text or punctuation in the row indicator
- **AND** `available` and `owned` display a success indicator in the row
- **AND** `taken` displays a failure indicator in the row
- **AND** `invalid` displays a warning indicator in the row
- **AND** `unknown` displays an empty row indicator
- **AND** `taken` displays `This name is already taken. Try another.`
- **AND** `invalid` displays `3–48 characters, letters, numbers, and hyphens only.`
- **AND** `owned` displays `You already own this name.`
- **AND** `available`, `checking`, `unknown`, and fallback states display `Anyone with this link can view your wiki.`

### Requirement: Publish Result
The Electron app SHALL surface publish success and failure to the user using native-like modal feedback and native result copy.

#### Scenario: Publish succeeds
- **WHEN** publishing completes successfully for a first publish
- **THEN** the renderer shows a modal result titled `Published!`
- **AND** the result body includes `Your wiki is live at <published URL>`
- **AND** the result body includes `A publish.json file has been saved to your project. Keep it safe — it’s your key to update this site.`
- **AND** the result does not show a duplicate standalone URL outside the native result body
- **AND** the result includes an `Open in Browser` action that opens the published URL through the preload external URL bridge
- **AND** the result includes an `OK` action that dismisses the result
- **AND** the renderer refreshes its publish config state

#### Scenario: Publish update succeeds
- **WHEN** publishing completes successfully for an already published wiki
- **THEN** the renderer shows a modal result titled `Published!`
- **AND** the result body is `Updated <published URL>`
- **AND** the result does not show a duplicate standalone URL outside the native result body
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
- **WHEN** a project has publish config and the user selects `Unpublish…`
- **THEN** the renderer shows an app-owned confirmation titled `Unpublish wiki?`
- **AND** the confirmation explains that the wiki will be taken offline and local files are not affected
- **AND** the confirmation offers `Cancel` and destructive `Unpublish` actions
- **AND** the destructive confirmation action remains labeled `Unpublish` while unpublishing is in progress
- **AND** the confirmation closes through the native cancel keyboard behavior
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
