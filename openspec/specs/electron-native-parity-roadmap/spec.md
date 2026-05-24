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

### Requirement: Chrome Menus Persistence Phase Completion Tracking

The migration roadmap SHALL record Electron app chrome, menu commands, and persistence as a phase that advances native parity while preserving later phases.

#### Scenario: Chrome menus persistence phase is archived

- **WHEN** the Electron chrome, menus, and persistence change is archived
- **THEN** retained verification records app settings, startup restore, app menu command, toolbar, history, generated map, and sidebar toggle evidence
- **AND** remaining phases still include map/graph polish, packaging/release, and final parity audit

### Requirement: Preview Navigation Map Graph Phase Completion Tracking

The migration roadmap SHALL record Electron preview navigation and map/graph polish as a phase that advances native parity while preserving later phases.

#### Scenario: Preview navigation map graph phase is archived

- **WHEN** the Electron preview navigation and map/graph change is archived
- **THEN** retained verification records local preview navigation, external link handling, generated page routing, graph page support, and generated page refresh evidence
- **AND** remaining phases still include packaging/release and final parity audit

### Requirement: Packaging Release Phase Completion Tracking

The migration roadmap SHALL record Electron packaging/release as a phase that advances native parity while preserving the final audit.

#### Scenario: Packaging release phase is archived

- **WHEN** the Electron packaging/release change is archived
- **THEN** retained verification records package command, app bundle metadata, embedded app layout, generated app artifact, and release guardrail evidence
- **AND** remaining phases still include final parity audit

### Requirement: Final Shell Polish Phase Completion Tracking

The migration roadmap SHALL record Electron native shell polish as a final-audit phase that advances visible parity while preserving remaining runtime and release parity gates.

#### Scenario: Shell polish phase is archived

- **WHEN** the Electron native shell polish change is archived
- **THEN** retained verification records product branding, native welcome content, removed debug resource UI/API, and shell layout evidence
- **AND** remaining final parity evidence still includes live runtime visual checks and release hardening before migration completion can be claimed

### Requirement: Runtime Parity Audit Phase Completion Tracking

The migration roadmap SHALL record Electron runtime parity audit as a final-audit phase that advances live visual evidence while preserving release hardening gates.

#### Scenario: Runtime parity audit phase is archived

- **WHEN** the Electron runtime parity audit change is archived
- **THEN** retained verification records runtime audit command output, generated report evidence, screenshot artifact locations, and residual visual review risks
- **AND** remaining final parity evidence still includes signed/notarized release hardening and any follow-up differences found by screenshot review before migration completion can be claimed

### Requirement: Electron Release Hardening Phase Completion Tracking

The migration roadmap SHALL record Electron release hardening as the final distribution gate that enables migration completion only after signed/notarized release evidence is retained.

#### Scenario: Electron release hardening phase is archived

- **WHEN** the Electron release hardening change is archived
- **THEN** retained verification records release script guardrails, Electron package usage, signing/notarization/stapling checks, DMG output expectations, and any credential-dependent steps that could not run locally
- **AND** final migration completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation

### Requirement: CodeMirror Editor Parity Phase Completion Tracking

The migration roadmap SHALL record Electron CodeMirror editor parity as a final parity gap closure phase.

#### Scenario: CodeMirror editor parity phase is archived

- **WHEN** the Electron CodeMirror editor parity change is archived
- **THEN** retained verification records shared editor resource usage, Electron bridge behavior, save/autosave evidence, scroll restoration evidence, and Swift resource compatibility evidence
- **AND** remaining final parity evidence still includes PTY-grade terminal parity and actual signed/notarized release execution or accepted deviations
