## MODIFIED Requirements

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
