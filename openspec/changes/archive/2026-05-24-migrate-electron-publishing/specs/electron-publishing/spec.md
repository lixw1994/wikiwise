## ADDED Requirements

### Requirement: Publish Control

The Electron app SHALL expose a publishing control for opened projects.

#### Scenario: Project toolbar displays publish action

- **WHEN** a project is opened in Electron
- **THEN** the renderer displays a publish action
- **AND** the action is disabled while publishing is already in progress

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

The Electron app SHALL surface publish success and failure to the user.

#### Scenario: Publish succeeds

- **WHEN** publishing completes successfully
- **THEN** the renderer shows the published URL
- **AND** the renderer refreshes its publish config state

#### Scenario: Publish fails

- **WHEN** publishing fails
- **THEN** the renderer displays a publish error message
- **AND** publishing controls are re-enabled

### Requirement: Unpublish Flow

The Electron app SHALL support unpublishing an already published wiki.

#### Scenario: Published wiki is unpublished

- **WHEN** a project has publish config and the user confirms unpublish
- **THEN** the renderer asks preload to unpublish
- **AND** the local publish config state is cleared after success
