## ADDED Requirements

### Requirement: Publish Config Refresh Fallback Parity
Electron publishing state refresh SHALL mirror native `ContentView.loadPublishConfig()` best-effort behavior while preserving corrupt-config errors for user-initiated publish actions.

#### Scenario: Malformed publish config is refreshed
- **WHEN** Electron refreshes publish config state for a project whose `publish.json` is malformed
- **THEN** the refresh path returns unpublished publish state with a suggested subdomain
- **AND** the project service refresh and toolbar state are not interrupted by the corrupt config

#### Scenario: Malformed publish config is used for publishing
- **WHEN** Electron publishes or unpublishes a project whose `publish.json` is malformed
- **THEN** the existing native corrupt-config publish error is still surfaced
- **AND** the refresh fallback does not hide user-action failures
