## MODIFIED Requirements

### Requirement: Publish Dialog

The Electron app SHALL let users choose or edit the wiki subdomain before publishing.

#### Scenario: First publish dialog opens

- **WHEN** the user opens the publish dialog for a project without `publish.json`
- **THEN** the dialog displays a generated subdomain candidate
- **AND** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** the dialog shows the native `publish.json` token warning, including the password/lost-token sentence
- **AND** publishing is disabled until the subdomain is available

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the subdomain state is treated as owned unless an availability check says otherwise
- **AND** the dialog shows the native `Unpublish…` action

### Requirement: Unpublish Flow
The Electron app SHALL support unpublishing an already published wiki with native-like destructive confirmation.

#### Scenario: Published wiki asks for unpublish confirmation
- **WHEN** a project has publish config and the user selects `Unpublish…`
- **THEN** the renderer shows an app-owned confirmation titled `Unpublish wiki?`
- **AND** the confirmation explains that the wiki will be taken offline and local files are not affected
- **AND** the confirmation offers `Cancel` and destructive `Unpublish` actions
- **AND** the renderer does not use the browser `window.confirm` dialog

#### Scenario: Published wiki is unpublished
- **WHEN** the user confirms unpublish
- **THEN** the renderer asks preload to unpublish
- **AND** the local publish config state is cleared after success
- **AND** the confirmation closes after success
