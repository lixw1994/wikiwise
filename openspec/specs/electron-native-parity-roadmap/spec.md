# electron-native-parity-roadmap Specification

## Purpose
Track the phased Electron migration against the current SwiftUI macOS app surface, including completion evidence for each native parity phase and the remaining release gates before the migration can be considered complete.
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

### Requirement: PTY Terminal Parity Phase Completion Tracking

The migration roadmap SHALL record Electron PTY terminal parity as a final native parity gap closure phase.

#### Scenario: PTY terminal parity phase is archived

- **WHEN** the Electron PTY terminal parity change is archived
- **THEN** retained verification records PTY-backed shell startup, xterm-compatible rendering, direct input, resize evidence, and native warm palette evidence
- **AND** remaining final parity evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Tree Expansion Parity Phase Completion Tracking
The migration roadmap SHALL record Electron file-tree expansion parity as a native project-browser gap closure phase.

#### Scenario: File tree expansion phase is archived
- **WHEN** the Electron file-tree expansion parity change is archived
- **THEN** retained verification records native ordering, default top-level expansion, lazy nested expansion, path-safe expansion IPC, nested file selection, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
### Requirement: Viewport Detail Chrome Parity Phase Completion Tracking
The migration roadmap SHALL record Electron viewport/detail chrome parity as a visible shell polish phase.

#### Scenario: Viewport detail chrome phase is archived
- **WHEN** the Electron viewport/detail chrome parity change is archived
- **THEN** retained verification records bounded project layout, hidden non-native detail save/header chrome, preserved save behavior, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Right Sidebar Resize Parity Phase Completion Tracking
The migration roadmap SHALL record Electron right-sidebar resize parity as a native interaction gap closure phase.

#### Scenario: Right sidebar resize phase is archived
- **WHEN** the Electron right-sidebar resize parity change is archived
- **THEN** retained verification records draggable handle behavior, min/max width constraints, terminal refit evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Left Sidebar Visibility Parity Phase Completion Tracking
The migration roadmap SHALL record Electron left-sidebar visibility parity as a native interaction gap closure phase.

#### Scenario: Left sidebar visibility phase is archived
- **WHEN** the Electron left-sidebar visibility parity change is archived
- **THEN** retained verification records left-sidebar hide/show behavior, layout expansion evidence, file tree state preservation, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Tree Visual Parity Phase Completion Tracking
The migration roadmap SHALL record Electron file-tree visual parity as a native project-browser visual gap closure phase.

#### Scenario: File tree visual phase is archived
- **WHEN** the Electron file-tree visual parity change is archived
- **THEN** retained verification records folder icon visuals, special folder markers, selected file accent evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Release Preflight Hardening Phase Completion Tracking

The migration roadmap SHALL record Electron release preflight hardening as a final distribution gate support phase.

#### Scenario: Release preflight phase is archived

- **WHEN** the Electron release preflight hardening change is archived
- **THEN** retained verification records release preflight command behavior, prerequisite guardrail coverage, and credential-dependent blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Alert Parity Phase Completion Tracking
The migration roadmap SHALL record Electron publish alert parity as a visible native publishing polish phase.

#### Scenario: Publish alert parity phase is archived
- **WHEN** the Electron publish alert parity change is archived
- **THEN** retained verification records native-like publish success modal, publish error modal, unpublish confirmation modal, and external browser action evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Appearance Palette Parity Phase Completion Tracking
The migration roadmap SHALL record Electron appearance palette parity as a visible native shell polish phase.

#### Scenario: Appearance palette phase is archived
- **WHEN** the Electron appearance palette parity change is archived
- **THEN** retained verification records native light/dark shell palette tokens and runtime dark appearance evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Background Compilation Parity Phase Completion Tracking
The migration roadmap SHALL record Electron background compilation parity as a native compiler lifecycle phase.

#### Scenario: Background compilation phase is archived
- **WHEN** the Electron background compilation parity change is archived
- **THEN** retained verification records progressive compiler tests, main-process scheduler wiring, watcher restart evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Window Geometry Parity Phase Completion Tracking
The migration roadmap SHALL record Electron window geometry parity as a visible native shell phase.

#### Scenario: Window geometry phase is archived
- **WHEN** the Electron window geometry parity change is archived
- **THEN** retained verification records native default window size, native minimum window size, runtime audit viewport evidence, and screenshot dimension evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Tab Conditional Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO tab conditional rendering as a visible right-sidebar parity phase.

#### Scenario: Info conditional phase is archived
- **WHEN** the Electron INFO tab conditional parity change is archived
- **THEN** retained verification records hidden empty directions, hidden empty wikilinks, populated-section source coverage, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Toolbar Icon Parity Phase Completion Tracking
The migration roadmap SHALL record Electron toolbar icon parity as a visible native project chrome polish phase.

#### Scenario: Toolbar icon parity phase is archived
- **WHEN** the Electron toolbar icon parity change is archived
- **THEN** retained verification records icon-only toolbar controls, native symbol mapping, accessible label preservation, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Toolbar Title Offset Parity Phase Completion Tracking
The migration roadmap SHALL record Electron toolbar title offset parity as a visible native project chrome polish phase.

#### Scenario: Toolbar title offset parity phase is archived
- **WHEN** the Electron toolbar title offset parity change is archived
- **THEN** retained verification records native title offset reference, Electron dynamic offset behavior, left-sidebar hide/restore offset evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Left Sidebar Width Parity Phase Completion Tracking
The migration roadmap SHALL record Electron left-sidebar width parity as a native split-view interaction phase.

#### Scenario: Left sidebar width parity phase is archived
- **WHEN** the Electron left-sidebar width parity change is archived
- **THEN** retained verification records native min/ideal/max constraints, Electron resize behavior, hide/restore width preservation, toolbar-title offset evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Split-View Toolbar Affordance Phase Completion Tracking
The migration roadmap SHALL record Electron split-view toolbar affordance parity as a native project toolbar phase.

#### Scenario: Split-view toolbar affordance phase is archived
- **WHEN** the Electron split-view toolbar affordance parity change is archived
- **THEN** retained verification records visible system split-view toggle semantics, hidden custom restore semantics, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Release Readiness Evidence Phase Completion Tracking
The migration roadmap SHALL record Electron release readiness evidence as a final distribution gate support phase.

#### Scenario: Release readiness evidence phase is archived
- **WHEN** the Electron release readiness evidence change is archived
- **THEN** retained verification records the release readiness command, generated report schema coverage, blocker evidence, and no-artifact behavior
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Welcome Toolbar Brand Phase Completion Tracking
The migration roadmap SHALL record Electron welcome toolbar brand parity as a visible native shell gap closure phase.

#### Scenario: Welcome toolbar brand phase is archived
- **WHEN** the Electron welcome toolbar brand parity change is archived
- **THEN** retained verification records native no-folder toolbar brand markup, styling, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standalone File Open Phase Completion Tracking
The migration roadmap SHALL record Electron standalone-file open parity as a native project-lifecycle gap closure phase.

#### Scenario: Standalone-file phase is archived
- **WHEN** the Electron standalone-file open parity change is archived
- **THEN** retained verification records native file-open source evidence, Electron project result behavior, renderer service boundaries, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Open Existing Picker Parity Phase Completion Tracking

The migration roadmap SHALL record Electron open-existing picker parity as a native project-lifecycle gap closure phase.

#### Scenario: Open existing picker parity phase is archived

- **WHEN** the Electron open-existing picker parity change is archived
- **THEN** retained verification records native SwiftUI picker constraints, Electron dialog filter constraints, focused project-lifecycle coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info.plist Privacy Parity Phase Completion Tracking

The migration roadmap SHALL record Electron `Info.plist` privacy metadata parity as a packaging/release gap closure phase.

#### Scenario: Info.plist privacy parity phase is archived

- **WHEN** the Electron `Info.plist` privacy parity change is archived
- **THEN** retained verification records native app plist evidence, Electron packaging cleanup coverage, packaged plist inspection, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Minimum macOS Metadata Parity Phase Completion Tracking

The migration roadmap SHALL record Electron minimum macOS metadata parity as a packaging/release gap closure phase.

#### Scenario: Minimum macOS metadata parity phase is archived

- **WHEN** the Electron minimum macOS metadata parity change is archived
- **THEN** retained verification records SwiftPM platform evidence, native app plist evidence, Electron package script coverage, packaged plist inspection, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Bundle Version Metadata Parity Phase Completion Tracking

The migration roadmap SHALL record Electron bundle version metadata parity as a packaging/release gap closure phase.

#### Scenario: Bundle version metadata parity phase is archived

- **WHEN** the Electron bundle version metadata parity change is archived
- **THEN** retained verification records native app version metadata, Electron default package version metadata, explicit release override coverage, packaged plist inspection, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Template Build Metadata Cleanup Phase Completion Tracking

The migration roadmap SHALL record Electron template build metadata cleanup as a packaging/release gap closure phase.

#### Scenario: Template build metadata cleanup phase is archived

- **WHEN** the Electron template build metadata cleanup change is archived
- **THEN** retained verification records native app plist absence evidence, Electron package script cleanup coverage, packaged plist inspection, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Template Icon Resource Cleanup Phase Completion Tracking

The migration roadmap SHALL record Electron template icon resource cleanup as a packaging/release gap closure phase.

#### Scenario: Template icon resource cleanup phase is archived

- **WHEN** the Electron template icon resource cleanup change is archived
- **THEN** retained verification records native app resource evidence, Electron package script cleanup coverage, packaged resource inspection, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Template PkgInfo Cleanup Phase Completion Tracking

The migration roadmap SHALL record Electron template `PkgInfo` cleanup as a packaging/release gap closure phase.

#### Scenario: Template PkgInfo cleanup phase is archived

- **WHEN** the Electron template `PkgInfo` cleanup change is archived
- **THEN** retained verification records native app bundle evidence, Electron package script cleanup coverage, packaged bundle inspection, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Runtime Info.plist Delta Allowlist Phase Completion Tracking

The migration roadmap SHALL record Electron runtime `Info.plist` delta allowlisting as a packaging/release gap closure phase.

#### Scenario: Runtime Info.plist delta allowlist phase is archived

- **WHEN** the Electron runtime `Info.plist` delta allowlist change is archived
- **THEN** retained verification records native app plist key evidence, Electron package script allowlist coverage, packaged plist inspection, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Populated Info Runtime Evidence Phase Completion Tracking

The migration roadmap SHALL record populated Electron INFO tab runtime evidence as a native runtime parity evidence phase.

#### Scenario: Populated INFO runtime evidence phase is archived

- **WHEN** the populated INFO runtime evidence change is archived
- **THEN** retained verification records runtime audit fixture coverage, populated Directions evidence, populated Linked evidence, restore-state evidence, and package/build/runtime command evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
