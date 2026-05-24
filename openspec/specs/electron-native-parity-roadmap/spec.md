# electron-native-parity-roadmap Specification

## Purpose
TBD - created by archiving change define-electron-native-parity-roadmap. Update Purpose after archive.
## Requirements
### Requirement: Native Feature Inventory

The Electron migration roadmap SHALL track all current user-visible capabilities of the SwiftUI macOS app as parity requirements.

#### Scenario: Roadmap is used for phase planning

- **WHEN** a new Electron migration change is created
- **THEN** the change identifies which roadmap feature surfaces it advances
- **AND** the change records which native behaviors remain outside that phase

### Requirement: Full Parity Acceptance

The Electron app SHALL only be considered migration-complete when it matches the current SwiftUI macOS app's behavior for every roadmap feature surface.

#### Scenario: Final migration completion is claimed

- **WHEN** the migration is proposed as complete
- **THEN** verification evidence covers app shell, project lifecycle, file tree, editing, preview, compilation, watching, terminal, publishing, scaffolding, appearance, navigation, maps, persistence, menus, packaging, and agent workflow integration
- **AND** any deviation from the native app is explicitly accepted in a later OpenSpec change

### Requirement: Phase Order

The migration SHALL be split into ordered OpenSpec changes that build from dependency-light foundations toward full app parity.

#### Scenario: Phases are executed

- **WHEN** migration work proceeds
- **THEN** phases are ordered as project lifecycle, compiler/core migration, file editing and preview, live rebuild watching, scaffold/new wiki, right sidebar info and terminal, publishing, app chrome/menus/persistence, maps/graph polish, packaging/release, and final parity audit

### Requirement: Retained Verification

Each migration phase SHALL retain command and manual-check evidence under its OpenSpec change.

#### Scenario: A phase is archived

- **WHEN** a migration phase is ready for archive
- **THEN** its verification artifact lists commands run, manual checks, parity evidence, known gaps, and residual risks

### Requirement: Publishing Phase Completion Tracking

The migration roadmap SHALL record Electron publishing as a phase that advances native parity while preserving later phases.

#### Scenario: Publishing phase is archived

- **WHEN** the Electron publishing change is archived
- **THEN** retained verification records publish config, availability, publish, and unpublish evidence
- **AND** remaining phases still include app chrome, menus, persistence, maps, packaging, and final parity audit
