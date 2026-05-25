## MODIFIED Requirements

### Requirement: Publish Dialog

The Electron app SHALL let users choose or edit the wiki subdomain before publishing.

#### Scenario: First publish dialog opens

- **WHEN** the user opens the publish dialog for a project without `publish.json`
- **THEN** the dialog displays a generated subdomain candidate
- **AND** the dialog shows the final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** the URL row constrains the editable subdomain field to the native maximum width
- **AND** the URL row places a flexible spacer before the trailing availability indicator
- **AND** the URL row uses the native fill-only rounded background chrome
- **AND** the dialog shows the native `publish.json` token warning, including the password/lost-token sentence
- **AND** publishing is disabled until the subdomain is available
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins

#### Scenario: Existing publish dialog opens

- **WHEN** the user opens the publish dialog for a project with existing publish config
- **THEN** the dialog displays the saved subdomain
- **AND** the URL row constrains the editable subdomain field to the native maximum width
- **AND** the URL row places a flexible spacer before the trailing availability indicator
- **AND** the URL row uses the native fill-only rounded background chrome
- **AND** the subdomain state is treated as owned unless an availability check says otherwise
- **AND** the dialog shows the native `Unpublish…` action
- **AND** the native `Unpublish…` action label remains unchanged while shown
- **AND** the confirmation action remains labeled `Publish`
- **AND** the dialog closes through the native cancel keyboard shortcut
- **AND** the dialog submits through the native default keyboard shortcut when Publish is enabled
- **AND** submitting Publish closes the dialog before the publish request begins
