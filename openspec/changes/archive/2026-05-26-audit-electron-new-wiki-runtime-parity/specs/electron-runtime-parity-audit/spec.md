## ADDED Requirements

### Requirement: New Wiki Creation Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the create-new-wiki workflow works through the real renderer and preload bridge.

#### Scenario: Runtime audit records new-wiki creation
- **WHEN** the runtime audit runs a new-wiki scenario from the welcome screen
- **THEN** it opens the create-new-wiki dialog
- **AND** it records native dialog labels, target location metadata, disabled empty-name Create state, and enabled named Create state
- **AND** it submits a wiki name through the dialog
- **AND** it records that the audit harness created a scaffolded wiki directory
- **AND** it records that Electron opened the created project and started project services
- **AND** it records that the post-create guide renders native copy, agent commands, seed options, and the dismiss action
- **AND** it records that dismissing the guide selects `home.md` without leaving the guide visible

#### Scenario: Runtime audit fails missing new-wiki creation evidence
- **WHEN** new-wiki runtime evidence is absent, the dialog does not behave like the native sheet, scaffold creation is missing, the created project is not opened, the guide is missing, or guide dismissal does not select `home.md`
- **THEN** runtime audit fails the affected new-wiki scenario
