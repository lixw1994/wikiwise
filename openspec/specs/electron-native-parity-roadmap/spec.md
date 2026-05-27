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

### Requirement: Publish Dialog Runtime Evidence Phase Completion Tracking

The migration roadmap SHALL record first-publish dialog runtime evidence as a native runtime parity evidence phase.

#### Scenario: Publish dialog runtime evidence phase is archived

- **WHEN** the publish dialog runtime evidence change is archived
- **THEN** retained verification records runtime audit coverage for dialog opening, URL-row evidence, token-warning evidence, availability evidence, cancel-closure evidence, and restore-state evidence
- **AND** retained verification states that publish success, publish error, and unpublish runtime flows remain separate from this first-publish dialog evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Feedback Runtime Evidence Phase Completion Tracking

The migration roadmap SHALL record publish feedback runtime evidence as a native runtime parity evidence phase.

#### Scenario: Publish feedback runtime evidence phase is archived

- **WHEN** the publish feedback runtime evidence change is archived
- **THEN** retained verification records runtime audit coverage for first-publish success feedback, external browser routing, publish error feedback, unpublish confirmation, unpublish cleanup, and restore-state evidence
- **AND** retained verification states that the evidence uses audit-only mocked publishing IPC and does not contact the production publishing service
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Release Success Evidence Phase Completion Tracking

The migration roadmap SHALL record retained signed Electron release success evidence as the final distribution proof needed before migration completion can be claimed.

#### Scenario: Release success evidence phase is archived

- **WHEN** the release success evidence change is archived
- **THEN** retained verification records the release success report contract, report mode separation from readiness/preflight evidence, artifact checksum evidence, and documentation coverage
- **AND** retained verification states that final migration completion still requires an actual successful `bash scripts/build-release.sh --release-report <path> <version>` run or an explicitly accepted OpenSpec deviation

### Requirement: OpenSpec Purpose Hygiene Phase Completion Tracking
The migration roadmap SHALL record OpenSpec main-spec purpose hygiene as a final-audit evidence phase that keeps archived capability specifications authoritative.

#### Scenario: Purpose hygiene phase is archived
- **WHEN** the OpenSpec purpose hygiene change is archived
- **THEN** retained verification records concrete purpose statements for archived main specs that previously contained generated placeholders
- **AND** retained verification records static placeholder-scan coverage for `openspec/specs`
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Release Default Version Parity Phase Completion Tracking
The migration roadmap SHALL record Electron release default-version parity as a packaging/release evidence phase.

#### Scenario: Release default version parity phase is archived
- **WHEN** the Electron release default-version parity change is archived
- **THEN** retained verification records native app version metadata, no-argument readiness report version evidence, explicit release-version override preservation, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Runtime App Icon Phase Completion Tracking
The migration roadmap SHALL record Electron runtime app icon parity as a final shell-branding gap closure phase.

#### Scenario: Runtime app icon parity phase is archived
- **WHEN** the Electron runtime app icon parity change is archived
- **THEN** retained verification records native Swift runtime icon behavior, Electron main-process native-image derivation, Dock icon wiring, BrowserWindow icon option coverage, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Runtime Activation Phase Completion Tracking
The migration roadmap SHALL record Electron runtime activation parity as a final shell launch-behavior gap closure phase.

#### Scenario: Runtime activation parity phase is archived
- **WHEN** the Electron runtime activation parity change is archived
- **THEN** retained verification records native Swift activation policy behavior, native foreground activation behavior, Electron main-process activation policy wiring, Electron startup focus wiring, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Titlebar Chrome Phase Completion Tracking
The migration roadmap SHALL record Electron titlebar chrome parity as a final shell-window gap closure phase.

#### Scenario: Titlebar chrome parity phase is archived
- **WHEN** the Electron titlebar chrome parity change is archived
- **THEN** retained verification records native Swift visible-title clearing, titlebar separator removal, Electron hidden-inset titlebar wiring, traffic-light-safe toolbar layout, draggable toolbar region coverage, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: First-Window Restore Phase Completion Tracking
The migration roadmap SHALL record Electron first-window startup restore parity as a session-behavior gap closure phase.

#### Scenario: First-window restore parity phase is archived
- **WHEN** the Electron first-window restore parity change is archived
- **THEN** retained verification records native Swift `ContentView.instanceCount` behavior, Electron main-process window-creation tracking, sender-scoped restore IPC gating, first-window restore preservation, later-window welcome behavior, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Window Resource Cleanup Phase Completion Tracking
The migration roadmap SHALL record Electron window resource cleanup parity as a native lifecycle gap closure phase.

#### Scenario: Window resource cleanup parity phase is archived
- **WHEN** the Electron window resource cleanup parity change is archived
- **THEN** retained verification records native Swift `onDisappear` cleanup evidence, Electron webContents project-root ownership, watcher cleanup, background compilation cleanup, terminal cleanup, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standard Menu Parity Phase Completion Tracking
The migration roadmap SHALL record Electron standard macOS menu parity as a native shell gap closure phase.

#### Scenario: Standard menu parity phase is archived
- **WHEN** the Electron standard menu parity change is archived
- **THEN** retained verification records native SwiftUI default-menu preservation evidence, Electron App/Edit/Window standard role coverage, existing File command preservation, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Auto Appearance Parity Phase Completion Tracking
The migration roadmap SHALL record Electron Auto appearance parity as a native shell gap closure phase.

#### Scenario: Auto appearance parity phase is archived
- **WHEN** the Electron Auto appearance parity change is archived
- **THEN** retained verification records native SwiftUI Auto behavior, Electron stored-mode preservation, resolved renderer palette behavior, system-change listener behavior, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standalone Detail Mode Parity Phase Completion Tracking
The migration roadmap SHALL record Electron standalone detail mode parity as a native project/detail closure phase.

#### Scenario: Standalone detail mode parity phase is archived
- **WHEN** the Electron standalone detail mode parity change is archived
- **THEN** retained verification records native SwiftUI initial compiled mode evidence, Electron standalone markdown WIKI selection, editor fallback evidence, non-markdown FILE mode preservation, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: New Wiki Failure Parity Phase Completion Tracking
The migration roadmap SHALL record Electron new-wiki scaffold failure parity as a native scaffold/sheet closure phase.

#### Scenario: New wiki failure parity phase is archived
- **WHEN** the Electron new-wiki failure parity change is archived
- **THEN** retained verification records native SwiftUI catch-path dismissal evidence, Electron renderer failure dismissal evidence, no post-create guide evidence, no project application evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Word Count Format Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO word-count format parity as a right-sidebar metadata closure phase.

#### Scenario: Info word count format parity phase is archived
- **WHEN** the Electron INFO word-count format parity change is archived
- **THEN** retained verification records native `NumberFormatter` evidence, Electron locale-aware decimal formatting evidence, preserved numeric IPC evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Edited Relative Time Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO edited-time format parity as a right-sidebar metadata closure phase.

#### Scenario: Info edited-time parity phase is archived
- **WHEN** the Electron INFO edited-time parity change is archived
- **THEN** retained verification records native `RelativeDateTimeFormatter` evidence, Electron numeric relative-time evidence, no absolute date fallback evidence, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Directions Parser Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO directions parser parity as a right-sidebar metadata closure phase.

#### Scenario: Info directions parser parity phase is archived
- **WHEN** the Electron INFO directions parser parity change is archived
- **THEN** retained verification records native exact parser evidence, Electron core exact frontmatter tests, preserved valid directions extraction, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Wikilink Target Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO wikilink target parser parity as a right-sidebar metadata closure phase.

#### Scenario: Info wikilink target parity phase is archived
- **WHEN** the Electron INFO wikilink target parity change is archived
- **THEN** retained verification records native raw target evidence, Electron core raw target tests, exact duplicate behavior, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Metadata Fallback Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO metadata fallback parity as a right-sidebar metadata closure phase.

#### Scenario: Info metadata fallback parity phase is archived
- **WHEN** the Electron INFO metadata fallback parity change is archived
- **THEN** retained verification records native em-dash fallback evidence, Electron renderer fallback coverage, quiet metadata-refresh failure handling, and runtime audit evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Non-Markdown Detail Mode Parity Phase Completion Tracking
The migration roadmap SHALL record Electron non-Markdown detail-mode parity as a native project/detail behavior correction phase.

#### Scenario: Non-Markdown detail-mode parity phase is archived
- **WHEN** the Electron non-Markdown detail-mode parity change is archived
- **THEN** retained verification records native SwiftUI detail-mode preservation evidence, Electron renderer mode preservation coverage, non-Markdown editor fallback evidence, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: New Window Menu Parity Phase Completion Tracking
The migration roadmap SHALL record Electron New Window menu parity as a native macOS shell/menu gap closure phase.

#### Scenario: New Window menu parity phase is archived
- **WHEN** the Electron New Window menu parity change is archived
- **THEN** retained verification records native SwiftUI `WindowGroup` menu evidence, Electron File menu New Window coverage, later-window restore-scope preservation, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Active File Reselect History Parity Phase Completion Tracking
The migration roadmap SHALL record Electron active-file reselect history parity as a native navigation behavior correction phase.

#### Scenario: Active-file reselect history parity phase is archived
- **WHEN** the Electron active-file reselect history parity change is archived
- **THEN** retained verification records native SwiftUI `navigateTo(_:)` history guard evidence, Electron same-file reselect coverage, preserved different-file/generated-page navigation coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Generated Page Refresh Command Parity Phase Completion Tracking
The migration roadmap SHALL record Electron generated-page Refresh Page command parity as a native menu-command behavior correction phase.

#### Scenario: Generated-page refresh command parity phase is archived
- **WHEN** the Electron generated-page refresh command parity change is archived
- **THEN** retained verification records native SwiftUI selected-file guard evidence, Electron manual Refresh Page coverage, preserved watcher-driven generated-page refresh coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Menu Command Broadcast Parity Phase Completion Tracking
The migration roadmap SHALL record Electron menu-command broadcast parity as a native multi-window command behavior correction phase.

#### Scenario: Menu-command broadcast parity phase is archived
- **WHEN** the Electron menu-command broadcast parity change is archived
- **THEN** retained verification records native global `NotificationCenter` command evidence, Electron multi-window broadcast coverage, targeted Open Existing preservation, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Generated Page Watcher Refresh Parity Phase Completion Tracking
The migration roadmap SHALL record Electron generated-page watcher refresh parity as a native preview behavior correction phase.

#### Scenario: Generated-page watcher refresh parity phase is archived
- **WHEN** the Electron generated-page watcher refresh parity change is archived
- **THEN** retained verification records native selected-file watcher guard evidence, native WebView reload-token evidence, Electron watcher no-refresh coverage, preserved generated-page opening coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Markdown Detail Mode Selection Parity Phase Completion Tracking
The migration roadmap SHALL record Electron Markdown detail-mode selection persistence as a native preview/navigation behavior correction phase.

#### Scenario: Markdown detail-mode selection parity phase is archived
- **WHEN** the Electron Markdown detail-mode selection parity change is archived
- **THEN** retained verification records native SwiftUI `detailMode` persistence evidence, Electron Markdown selection persistence coverage, preserved initial WIKI-mode coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Generated Link History Parity Phase Completion Tracking
The migration roadmap SHALL record Electron generated-link history parity as a native preview navigation behavior correction phase.

#### Scenario: Generated-link history parity phase is archived
- **WHEN** the Electron generated-link history parity change is archived
- **THEN** retained verification records native selected-file-only generated-link history evidence, Electron generated-link history coverage, preserved toolbar map history behavior, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Release Workflow Phase Completion Tracking
The migration roadmap SHALL record credential-backed Electron release workflow support as a final distribution support phase.

#### Scenario: Release workflow phase is archived
- **WHEN** the Electron release workflow change is archived
- **THEN** retained verification records workflow trigger behavior, Apple credential bootstrap coverage, canonical release-script delegation, artifact upload coverage, and documentation coverage
- **AND** final migration completion still requires an actual successful signed/notarized release run or an explicitly accepted OpenSpec deviation

### Requirement: File Menu Open Existing Parity Phase Completion Tracking
The migration roadmap SHALL record Electron File-menu Open Existing removal as a visible menu parity correction phase.

#### Scenario: File-menu open-existing parity phase is archived
- **WHEN** the Electron File-menu Open Existing parity change is archived
- **THEN** retained verification records native Swift command-source evidence, Electron menu removal coverage, welcome open-existing preservation, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Open Panel Title Parity Phase Completion Tracking
The migration roadmap SHALL record Electron native open-panel title parity as a visible system-picker chrome correction phase.

#### Scenario: Open-panel title parity phase is archived
- **WHEN** the Electron open-panel title parity change is archived
- **THEN** retained verification records native Swift `NSOpenPanel` message-only evidence, Electron Open Existing picker title removal, Electron new-wiki location picker title removal, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Terminal Login Shell Parity Phase Completion Tracking
The migration roadmap SHALL record Electron terminal login-shell parity as a native terminal startup correction phase.

#### Scenario: Terminal login-shell parity phase is archived
- **WHEN** the Electron terminal login-shell parity change is archived
- **THEN** retained verification records native SwiftTerm login-shell evidence, Electron PTY login-shell startup coverage, preserved project-root terminal behavior, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Active File Side-Effect Parity Phase Completion Tracking
The migration roadmap SHALL record Electron active-file side-effect parity as a native filesystem behavior correction phase.

#### Scenario: Active-file side-effect parity phase is archived
- **WHEN** the Electron active-file side-effect parity change is archived
- **THEN** retained verification records native Swift `try?` active-file evidence, shared core no-directory-creation coverage, Electron open/save call-path coverage, and package/build/runtime evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Editor Empty Change Parity Phase Completion Tracking
The migration roadmap SHALL record Electron editor empty-change parity as a native editor bridge behavior correction phase.

#### Scenario: Editor empty-change parity phase is archived
- **WHEN** the Electron editor empty-change parity change is archived
- **THEN** retained verification records native Swift empty-content guard evidence, Electron renderer regression coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Watcher Extension Case Parity Phase Completion Tracking
The migration roadmap SHALL record Electron watcher extension-case parity as a native live-rebuild behavior correction phase.

#### Scenario: Watcher extension-case parity phase is archived
- **WHEN** the Electron watcher extension-case parity change is archived
- **THEN** retained verification records native Swift `FileWatcher` suffix evidence, shared core watcher regression coverage, Electron watcher call-path coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Watcher Assets Path Parity Phase Completion Tracking
The migration roadmap SHALL record Electron watcher assets-path parity as a native live-rebuild behavior correction phase.

#### Scenario: Watcher assets-path parity phase is archived
- **WHEN** the Electron watcher assets-path parity change is archived
- **THEN** retained verification records native Swift `FileWatcher` `/wiki/assets/` evidence, shared core watcher regression coverage, Electron watcher call-path coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Watcher Output Prefix Parity Phase Completion Tracking

The migration roadmap SHALL record Electron watcher output-prefix parity as a native live-rebuild behavior correction phase.

#### Scenario: Watcher output-prefix parity phase is archived
- **WHEN** the Electron watcher output-prefix parity change is archived
- **THEN** retained verification records native Swift `FileWatcher` output-prefix evidence, shared core watcher regression coverage, Electron watcher call-path coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Watcher Structure Priority Parity Phase Completion Tracking

The migration roadmap SHALL record Electron watcher structure-priority payload parity as a native live-rebuild behavior correction phase.

#### Scenario: Watcher structure-priority parity phase is archived
- **WHEN** the Electron watcher structure-priority parity change is archived
- **THEN** retained verification records native Swift `FileWatcher` priority evidence, native `ContentView` structure no-recompile evidence, shared core watcher regression coverage, Electron watcher call-path coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Error Copy Parity Phase Completion Tracking
The migration roadmap SHALL record Electron publish error copy parity as a native publishing behavior correction phase.

#### Scenario: Publish error copy parity phase is archived
- **WHEN** the Electron publish error copy parity change is archived
- **THEN** retained verification records native Swift `Publisher` error-description evidence, shared core publish regression coverage, Electron publish error modal surfacing coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Subdomain Unicode Prefix Parity Phase Completion Tracking
The migration roadmap SHALL record Electron random publish subdomain Unicode prefix parity as a native publishing behavior correction phase.

#### Scenario: Publish subdomain Unicode prefix parity phase is archived
- **WHEN** the Electron publish subdomain Unicode prefix parity change is archived
- **THEN** retained verification records native Swift `Publisher.randomSubdomain(wikiName:)` prefix evidence, shared core random subdomain regression coverage, Electron publishing source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: New Wiki Location Unicode Middle Truncation Parity Phase Completion Tracking
The migration roadmap SHALL record Electron new-wiki location Unicode middle truncation parity as a native dialog polish correction phase.

#### Scenario: New-wiki location Unicode middle truncation parity phase is archived
- **WHEN** the Electron new-wiki location Unicode middle truncation parity change is archived
- **THEN** retained verification records native SwiftUI middle truncation evidence, Electron renderer regression coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Directions CRLF Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO directions CRLF parsing parity as a native right-sidebar behavior correction phase.

#### Scenario: INFO directions CRLF parity phase is archived
- **WHEN** the Electron INFO directions CRLF parity change is archived
- **THEN** retained verification records native Swift `RightSidebar.parseDirections(from:)` newline evidence, shared core document-info regression coverage, Electron right-sidebar source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Wikilink Bracket Target Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO wikilink bracket target parity as a native right-sidebar behavior correction phase.

#### Scenario: INFO wikilink bracket target parity phase is archived
- **WHEN** the Electron INFO wikilink bracket target parity change is archived
- **THEN** retained verification records native Swift `RightSidebar.wikilinkTargets(in:)` scanner evidence, shared core document-info regression coverage, Electron right-sidebar source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Conflict Retry Subdomain Parity Phase Completion Tracking
The migration roadmap SHALL record Electron publish conflict retry subdomain parity as a native publishing behavior correction phase.

#### Scenario: Publish conflict retry subdomain parity phase is archived
- **WHEN** the Electron publish conflict retry subdomain parity change is archived
- **THEN** retained verification records native Swift `Publisher.publish` first-candidate and conflict-retry call-site evidence, shared core publish regression coverage, Electron publishing source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: New Wiki Empty Slug Parity Phase Completion Tracking
The migration roadmap SHALL record Electron new-wiki empty-slug parity as a native scaffold behavior correction phase.

#### Scenario: New-wiki empty-slug parity phase is archived
- **WHEN** the Electron new-wiki empty-slug parity change is archived
- **THEN** retained verification records native Swift `ContentView.createNewWiki()` validation and slug evidence, shared core scaffold regression coverage, Electron new-wiki source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Read Fallback Parity Phase Completion Tracking
The migration roadmap SHALL record Electron selected-file read fallback parity as a native project lifecycle behavior correction phase.

#### Scenario: File-read fallback parity phase is archived
- **WHEN** the Electron file-read fallback parity change is archived
- **THEN** retained verification records native Swift `ContentView.loadFile(_:)` fallback evidence, shared core display-read regression coverage, Electron project lifecycle source coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Config Refresh Fallback Parity Phase Completion Tracking
The migration roadmap SHALL record Electron publish-config refresh fallback parity as a native publishing behavior correction phase.

#### Scenario: Publish-config refresh fallback parity phase is archived
- **WHEN** the Electron publish-config refresh fallback parity change is archived
- **THEN** retained verification records native Swift `ContentView.loadPublishConfig()` `try?` evidence, Electron publishing source coverage, preserved corrupt-config publish error coverage, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Info Serif Font Specificity Parity Phase Completion Tracking
The migration roadmap SHALL record Electron INFO serif font specificity parity as a right-sidebar visual polish phase.

#### Scenario: INFO serif font specificity parity phase is archived
- **WHEN** the Electron INFO serif font specificity parity change is archived
- **THEN** retained verification records native Swift `RightSidebar` serif font evidence, Electron CSS specificity coverage, targeted right-sidebar test evidence, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Tree Refresh Depth Parity Phase Completion Tracking
The migration roadmap SHALL record Electron file-tree refresh expansion-depth parity as a native project-browser gap closure phase.

#### Scenario: File tree refresh depth phase is archived
- **WHEN** the Electron file-tree refresh expansion-depth parity change is archived
- **THEN** retained verification records native `refreshTree()` depth evidence, Electron restore-depth regression coverage, targeted file-tree tests, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: New Wiki Disabled State Parity Phase Completion Tracking
The migration roadmap SHALL record Electron new-wiki disabled-state parity as a native dialog polish correction phase.

#### Scenario: New-wiki disabled-state parity phase is archived
- **WHEN** the Electron new-wiki disabled-state parity change is archived
- **THEN** retained verification records native SwiftUI disabled-state evidence, Electron renderer regression coverage, targeted new-wiki tests, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Unpublish Confirmation Dismissal Parity Phase Completion Tracking
The migration roadmap SHALL record Electron unpublish confirmation dismissal parity as a native publishing interaction correction phase.

#### Scenario: Unpublish confirmation dismissal parity phase is archived
- **WHEN** the Electron unpublish confirmation dismissal parity change is archived
- **THEN** retained verification records native SwiftUI alert-action dismissal evidence, Electron renderer ordering coverage, targeted publishing tests, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Tree Loading Affordance Parity Phase Completion Tracking
The migration roadmap SHALL record Electron file-tree loading-affordance parity as a native project-browser visual interaction correction phase.

#### Scenario: File tree loading-affordance parity phase is archived
- **WHEN** the Electron file-tree loading-affordance parity change is archived
- **THEN** retained verification records native SwiftUI disclosure evidence, Electron renderer no-loading-chrome coverage, targeted file-tree tests, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Editor Autosave Debounce Parity Phase Completion Tracking
The migration roadmap SHALL record Electron editor autosave debounce parity as a native source-editing behavior correction phase.

#### Scenario: Editor autosave debounce parity phase is archived
- **WHEN** the Electron editor autosave debounce parity change is archived
- **THEN** retained verification records native `EditorWebView` immediate-write evidence, shared editor bridge debounce evidence, Electron renderer no-second-debounce coverage, targeted file-editing tests, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Active File Error Silence Parity Phase Completion Tracking
The migration roadmap SHALL record Electron active-file error-silence parity as a native filesystem side-effect correction phase.

#### Scenario: Active-file error-silence parity phase is archived
- **WHEN** the Electron active-file error-silence parity change is archived
- **THEN** retained verification records native Swift `try?` active-file evidence, Electron renderer no-global-error coverage, preserved main-process validation evidence, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Publish Dialog Draft Retention Parity Phase Completion Tracking
The migration roadmap SHALL record Electron publish-dialog draft retention parity as a native publishing sheet behavior correction phase.

#### Scenario: Publish-dialog draft retention parity phase is archived
- **WHEN** the Electron publish-dialog draft retention parity change is archived
- **THEN** retained verification records native Swift first-publish `pendingSubdomain` preservation evidence, Electron renderer draft-retention coverage, preserved published-project behavior evidence, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Unpublish Draft Reset Parity Phase Completion Tracking
The migration roadmap SHALL record Electron unpublish draft reset parity as a native publishing sheet state correction phase.

#### Scenario: Unpublish draft reset parity phase is archived
- **WHEN** the Electron unpublish draft reset parity change is archived
- **THEN** retained verification records native Swift `performUnpublish()` draft reset evidence, Electron renderer unpublish success-state coverage, preserved publish feedback behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Selected File Refresh Command Parity Phase Completion Tracking
The migration roadmap SHALL record Electron selected-file Refresh Page command parity as a native menu-command behavior correction phase.

#### Scenario: Selected-file refresh command parity phase is archived
- **WHEN** the Electron selected-file refresh command parity change is archived
- **THEN** retained verification records native SwiftUI `selectedFileURL` refresh evidence, Electron selected non-Markdown file refresh coverage, preserved Markdown refresh coverage, preserved generated-page no-op coverage, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Non-Markdown Info Metadata Parity Phase Completion Tracking
The migration roadmap SHALL record Electron non-Markdown INFO metadata parity as a native right-sidebar behavior correction phase.

#### Scenario: Non-Markdown INFO metadata parity phase is archived
- **WHEN** the Electron non-Markdown INFO metadata parity change is archived
- **THEN** retained verification records native Swift `RightSidebar` selected-file metadata evidence, Electron renderer non-Markdown metadata refresh coverage, save/manual-refresh metadata coverage, preserved Markdown metadata behavior, and package/build evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Watcher Non-Markdown Selected Source Reload Phase Completion Tracking

The migration roadmap SHALL record Electron watcher non-Markdown selected-source reload parity as a native live-rebuild behavior correction phase.

#### Scenario: Watcher non-Markdown selected-source reload phase is archived
- **WHEN** the Electron watcher non-Markdown selected-source reload change is archived
- **THEN** retained verification records native Swift `ContentView` CSS/rebuild reload evidence, Electron renderer non-Markdown watcher reload coverage, INFO refresh coverage, preserved Markdown preview behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Appearance Preview Reload Phase Completion Tracking

The migration roadmap SHALL record Electron appearance preview reload parity as a native WebView appearance behavior correction phase.

#### Scenario: Appearance preview reload phase is archived
- **WHEN** the Electron appearance preview reload change is archived
- **THEN** retained verification records native Swift `appearanceMode` reload-token evidence, native `WebView` same-URL reload evidence, Electron renderer preview/generated iframe reload coverage, preserved shell palette behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Refresh Active File Side Effect Phase Completion Tracking

The migration roadmap SHALL record Electron refresh/watch active-file side-effect parity as a native filesystem behavior correction phase.

#### Scenario: Refresh active-file side-effect phase is archived
- **WHEN** the Electron refresh active-file side-effect parity change is archived
- **THEN** retained verification records native Swift `loadFile(_:)` active-file evidence, native `recompileCurrentPage(_:)` refresh evidence, Electron manual Refresh Page coverage, Electron watcher refresh coverage, preserved generated-page guard behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Post-Create Guide Explicit Dismiss Phase Completion Tracking

The migration roadmap SHALL record Electron post-create guide explicit-dismiss parity as a native new-wiki interaction behavior correction phase.

#### Scenario: Post-create guide explicit-dismiss phase is archived
- **WHEN** the Electron post-create guide explicit-dismiss parity change is archived
- **THEN** retained verification records native Swift `showPostCreateGuide` mutation evidence, Electron renderer incidental-navigation coverage, preserved explicit dismiss behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Generated Page Existing Output Phase Completion Tracking

The migration roadmap SHALL record Electron generated-page existing-output parity as a native preview/navigation lifecycle correction phase.

#### Scenario: Generated-page existing-output phase is archived
- **WHEN** the Electron generated-page existing-output parity change is archived
- **THEN** retained verification records native Swift `scanPages()` lifecycle evidence, native generated-page file-exists guard evidence, Electron main-process no-compile coverage, preserved no-op behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Preview Existing Scan Phase Completion Tracking

The migration roadmap SHALL record Electron selected preview existing-scan parity as a native compiler lifecycle correction phase.

#### Scenario: Preview existing-scan phase is archived
- **WHEN** the Electron preview existing-scan parity change is archived
- **THEN** retained verification records native Swift folder-open scan evidence, native `loadFile(_:)` no-rescan evidence, Electron main-process no per-preview scan coverage, preserved watcher rescan ownership, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Terminal Start Once Parity Phase Tracking

The migration roadmap SHALL record Electron terminal start-once lifecycle parity as a native terminal behavior gap closure phase.

#### Scenario: Terminal start-once parity phase is archived
- **WHEN** the Electron terminal start-once parity change is archived
- **THEN** retained verification records native `TerminalSession.startIfNeeded` evidence, Electron PTY reuse coverage, targeted Electron terminal tests, runtime audit evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standalone Terminal Preserve Parity Phase Tracking

The migration roadmap SHALL record Electron standalone-file terminal preservation as a native terminal lifecycle gap closure phase.

#### Scenario: Standalone terminal preserve phase is archived
- **WHEN** the Electron standalone-terminal preservation change is archived
- **THEN** retained verification records native standalone-file branch evidence, Electron no-stop terminal coverage, targeted Electron lifecycle tests, runtime audit evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standalone Services Preserve Parity Phase Tracking

The migration roadmap SHALL record Electron standalone-file watcher/background preservation as a native project lifecycle gap closure phase.

#### Scenario: Standalone services preserve phase is archived
- **WHEN** the Electron standalone-services preservation change is archived
- **THEN** retained verification records native standalone branch evidence, Electron watcher/background no-stop coverage, targeted Electron lifecycle tests, runtime audit evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Post-Create Guide Project-Switch Phase Completion Tracking

The migration roadmap SHALL record Electron post-create guide project-switch persistence as a native new-wiki interaction behavior correction phase.

#### Scenario: Post-create guide project-switch phase is archived
- **WHEN** the Electron post-create guide project-switch persistence change is archived
- **THEN** retained verification records native Swift `openURL(_:)` guide-state evidence, Electron renderer project-result coverage, preserved explicit show and hide behavior, package/build/runtime evidence, and release-readiness gate evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Standalone History Preserve Phase Tracking

The migration roadmap SHALL record Electron standalone-file history preservation as a native project lifecycle parity correction phase.

#### Scenario: Standalone history preserve phase is archived
- **WHEN** the Electron standalone-history preservation change is archived
- **THEN** retained verification records native folder-vs-standalone `openURL(_:)` history evidence, Electron renderer folder-scoped history reset coverage, preserved standalone service boundaries, package/build/runtime evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: Special File Weight Phase Tracking

The migration roadmap SHALL record Electron file-tree special file weight parity as a native sidebar visual correction phase.

#### Scenario: Special file weight phase is archived
- **WHEN** the Electron special file weight parity change is archived
- **THEN** retained verification records native Swift `isSpecialFile` typography evidence, Electron CSS special-row weight coverage, preserved file-tree row behavior, package/build/runtime evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation

### Requirement: File Tree Row Typography Phase Tracking

The migration roadmap SHALL record Electron file-tree row typography parity as a native sidebar visual correction phase.

#### Scenario: File-tree row typography phase is archived
- **WHEN** the Electron file-tree row typography parity change is archived
- **THEN** retained verification records native Swift folder/file typography evidence, Electron CSS folder/file row typography coverage, preserved special-file weight behavior, package/build/runtime evidence, and release-readiness blocker evidence
- **AND** remaining final migration evidence still includes actual signed/notarized release execution or an explicitly accepted OpenSpec deviation
