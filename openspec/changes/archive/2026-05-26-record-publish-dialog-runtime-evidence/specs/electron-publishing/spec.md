## ADDED Requirements

### Requirement: Publish Dialog Runtime Evidence

The Electron publishing implementation SHALL have live runtime evidence for first-publish dialog behavior in addition to static native parity tests.

#### Scenario: Runtime evidence covers first-publish dialog surface

- **WHEN** the Electron runtime audit opens the publish dialog for an unpublished project
- **THEN** retained evidence proves the dialog shows the native title, generated subdomain, URL affixes, token warning, availability hint, and inline availability indicator
- **AND** retained evidence proves `Publish` is disabled before availability permits publishing
- **AND** retained evidence proves the first-publish dialog hides the `Unpublish...` action
- **AND** retained evidence proves canceling the dialog leaves the project editor audit state restored

#### Scenario: Runtime evidence does not claim publishing success

- **WHEN** first-publish dialog runtime evidence is retained
- **THEN** it does not claim that publishing, publish-result feedback, publish-error feedback, or unpublish runtime flows have been fully exercised
- **AND** those flows remain eligible for later runtime evidence changes
