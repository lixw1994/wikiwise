## ADDED Requirements

### Requirement: Electron Packaging Scripts

The Electron workspace SHALL expose package scripts for local macOS app assembly.

#### Scenario: Package scripts are inspected

- **WHEN** package manifests are inspected
- **THEN** the root manifest exposes an Electron package command
- **AND** the Electron workspace manifest exposes a macOS package command
- **AND** both commands delegate to the checked-in packaging script
