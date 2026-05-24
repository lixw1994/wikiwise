## MODIFIED Requirements

### Requirement: Publish Control

The Electron app SHALL expose a publishing control for opened projects with native-equivalent contextual help and visible labels.

#### Scenario: Project toolbar displays publish action

- **WHEN** a project is opened in Electron
- **THEN** the renderer displays a publish action
- **AND** the normal publish action label is `PUBLISH ↑`
- **AND** the action is disabled while publishing is already in progress
- **AND** the busy publish action label is `PUBLISHING…`
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

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the subdomain state is treated as owned unless an availability check says otherwise
- **AND** the dialog shows the native `Unpublish…` action
- **AND** the confirmation action remains labeled `Publish`
