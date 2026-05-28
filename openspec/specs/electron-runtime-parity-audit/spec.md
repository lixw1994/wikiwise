# electron-runtime-parity-audit Specification

## Purpose
Define repeatable Electron runtime audit evidence for native shell parity checks.
## Requirements
### Requirement: Runtime Audit Command

The repository SHALL provide an npm command that runs a repeatable Electron runtime parity audit.

#### Scenario: Audit scripts are inspected

- **WHEN** package manifests are inspected
- **THEN** the root manifest exposes an Electron runtime audit command
- **AND** the Electron workspace manifest exposes a runtime audit command
- **AND** both commands delegate to a checked-in runtime audit script

### Requirement: Electron Renderer Runtime Capture

The runtime audit SHALL load the current Electron renderer through the current preload bridge in an Electron BrowserWindow.

#### Scenario: Audit script is inspected

- **WHEN** the audit script is inspected
- **THEN** it creates a BrowserWindow with context isolation enabled
- **AND** it uses the Electron preload script from `apps/electron/src/preload/preload.cjs`
- **AND** it loads the renderer HTML from `apps/electron/src/renderer/index.html`
- **AND** it captures screenshots through Electron runtime APIs

### Requirement: Native Shell Scenario Coverage

The runtime audit SHALL capture no-folder and opened-project shell states in both light and dark appearances.

#### Scenario: Audit scenarios run

- **WHEN** the runtime audit command completes successfully
- **THEN** it records scenarios named `welcome-light`, `welcome-dark`, `project-light`, and `project-dark`
- **AND** each scenario writes a PNG screenshot artifact
- **AND** each scenario writes DOM evidence to the JSON report

### Requirement: Runtime Parity Assertions

The runtime audit SHALL fail when required native-shell parity markers are missing, including the native default WIKI preview for markdown detail views.

#### Scenario: Audit assertions are evaluated

- **WHEN** the runtime audit evaluates a scenario
- **THEN** it verifies the document title is `Wikiwise`
- **AND** it verifies the renderer does not expose the shared-resources debug panel
- **AND** it verifies screenshots are nonblank at the expected viewport size
- **AND** welcome scenarios verify native welcome text and hidden project state
- **AND** project scenarios verify opened project chrome, selected document state, preview surface, and right sidebar state
- **AND** project scenarios verify markdown files initially show the WIKI preview before the audit switches to FILE editor mode

### Requirement: Runtime Audit Artifacts

The runtime audit SHALL retain generated evidence under the Electron output directory.

#### Scenario: Audit artifacts are written

- **WHEN** the runtime audit command completes successfully
- **THEN** it writes `apps/electron/out/runtime-audit/report.json`
- **AND** it writes screenshots under `apps/electron/out/runtime-audit/screenshots/`
- **AND** it reports artifact locations in command output

### Requirement: Viewport And Detail Chrome Evidence
The Electron runtime parity audit SHALL retain evidence that project scenarios are bounded to the viewport and do not show non-native detail chrome.

#### Scenario: Project runtime evidence is captured
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** the report includes project shell rectangle dimensions
- **AND** the report includes detail header visibility evidence
- **AND** the report includes whether selected filename/save status/Save button chrome appears in visible body text

#### Scenario: Project runtime evidence fails parity
- **WHEN** project shell height exceeds the viewport height or detail header chrome is visible
- **THEN** runtime audit fails the scenario

### Requirement: Right Sidebar Resize Evidence
The Electron runtime parity audit SHALL retain evidence that the right sidebar can be resized with native constraints.

#### Scenario: Project runtime evidence includes sidebar resize
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the right sidebar width before and after a simulated drag
- **AND** it records whether the resize handle is present
- **AND** it records terminal resize evidence after the drag

#### Scenario: Sidebar resize evidence fails parity
- **WHEN** the resize handle is missing, the width does not change, or the resized width violates native constraints
- **THEN** runtime audit fails the scenario

### Requirement: Left Sidebar Visibility Evidence
The Electron runtime parity audit SHALL retain evidence that the left file sidebar can be hidden and restored without breaking project layout.

#### Scenario: Project runtime evidence includes left-sidebar toggle
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records whether the left sidebar is visible before hiding
- **AND** it records whether the left sidebar is hidden after activating the toolbar control
- **AND** it records whether the left sidebar is visible again after restoring
- **AND** it records that the detail area expanded while the sidebar was hidden

#### Scenario: Left-sidebar visibility evidence fails parity
- **WHEN** the left-sidebar control is missing, the sidebar does not hide, the sidebar does not restore, or the detail area does not expand while hidden
- **THEN** runtime audit fails the scenario

### Requirement: File Tree Visual Evidence
The Electron runtime parity audit SHALL retain evidence that native file-tree visual markers are present.

#### Scenario: Project runtime evidence includes file tree visuals
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records folder icon presence
- **AND** it records special folder marker presence
- **AND** it records selected file accent evidence

#### Scenario: File tree visual evidence fails parity
- **WHEN** folder icons, special folder markers, or selected file accent evidence are missing
- **THEN** runtime audit fails the scenario

### Requirement: Appearance Palette Evidence
The Electron runtime parity audit SHALL retain computed-color evidence for light and dark shell palettes.

#### Scenario: Runtime evidence includes appearance colors
- **WHEN** runtime audit captures a welcome or project scenario
- **THEN** the report includes computed body, welcome, project, sidebar, detail, and right-sidebar colors where those surfaces exist
- **AND** dark scenarios record whether dark shell palette evidence is active

#### Scenario: Dark appearance evidence fails parity
- **WHEN** a dark runtime scenario leaves key shell surfaces on light palette backgrounds
- **THEN** runtime audit fails the scenario

### Requirement: Background Compilation Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that shared progressive compilation drains pending pages.

#### Scenario: Runtime audit records background compilation
- **WHEN** runtime audit creates its scaffold project
- **THEN** it scans and compiles the selected home page
- **AND** it records the result of draining pending compilation batches
- **AND** the report indicates that no pending pages remain

#### Scenario: Runtime audit fails missing background evidence
- **WHEN** background compilation evidence is absent or reports pending pages remaining
- **THEN** runtime audit fails the affected project scenario

### Requirement: Native Window Viewport Evidence
The Electron runtime parity audit SHALL capture screenshots at the native SwiftUI default window viewport.

#### Scenario: Audit viewport is inspected
- **WHEN** the runtime audit script is inspected
- **THEN** it uses a viewport width of 1500
- **AND** it uses a viewport height of 1000

#### Scenario: Audit report records native viewport
- **WHEN** the runtime audit command completes successfully
- **THEN** the report includes viewport evidence with width 1500
- **AND** the report includes viewport evidence with height 1000
- **AND** screenshot dimensions are validated against that native viewport

### Requirement: Info Optional Section Evidence
The Electron runtime parity audit SHALL retain evidence that empty optional INFO sections match the native right-sidebar behavior.

#### Scenario: Runtime audit records empty optional INFO sections
- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it activates the INFO tab for the selected scaffold `home.md`
- **AND** it records whether the directions section is visible
- **AND** it records whether the linked section is visible

#### Scenario: Runtime audit fails visible empty optional INFO sections
- **WHEN** scaffold `home.md` has no directions or wikilinks
- **THEN** runtime audit fails if the directions section is visible
- **AND** runtime audit fails if the linked section is visible
- **AND** runtime audit fails if placeholder text such as `None` is shown for missing optional INFO content

### Requirement: Toolbar Icon Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that opened-project toolbar icon controls match native icon-only semantics.

#### Scenario: Runtime audit records toolbar icons
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records native symbol names for appearance, 3D map, left sidebar, and right sidebar controls
- **AND** it records the visible text for icon-only toolbar controls
- **AND** it records whether prohibited text labels remain visible

#### Scenario: Runtime audit fails visible toolbar text labels
- **WHEN** an opened-project toolbar shows `Auto`, `Light`, `Dark`, or `Map` text in icon-only controls
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails missing toolbar symbol semantics
- **WHEN** an opened-project toolbar is missing native symbol evidence for appearance, 3D map, or sidebar controls
- **THEN** runtime audit fails the scenario

### Requirement: Toolbar Title Offset Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that opened-project toolbar title offset matches the native left-sidebar compensation.

#### Scenario: Runtime audit records toolbar title offset
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the visible left-sidebar width
- **AND** it records the toolbar title offset before hiding the left sidebar
- **AND** it records the toolbar title offset while the left sidebar is hidden
- **AND** it records the toolbar title offset after restoring the left sidebar

#### Scenario: Runtime audit fails title offset mismatch
- **WHEN** the left sidebar is visible and the toolbar title offset is not negative half of the visible sidebar width
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails hidden title offset mismatch
- **WHEN** the left sidebar is hidden and the toolbar title offset is not `0`
- **THEN** runtime audit fails the scenario

### Requirement: Left Sidebar Width Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the opened-project left sidebar matches native width constraints and resize behavior.

#### Scenario: Runtime audit records left-sidebar width
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the left-sidebar resize handle presence
- **AND** it records native min, ideal, and max widths
- **AND** it records the initial sidebar width
- **AND** it records the resized sidebar width after a simulated drag
- **AND** it records the toolbar title offset after resizing

#### Scenario: Runtime audit fails left-sidebar width mismatch
- **WHEN** the initial left sidebar width is not the native ideal width
- **THEN** runtime audit fails the scenario

#### Scenario: Runtime audit fails left-sidebar resize mismatch
- **WHEN** the resize handle is missing, the width does not change after drag, the resized width violates native constraints, or the toolbar title offset does not match the resized width
- **THEN** runtime audit fails the scenario

### Requirement: Compiled Preview Scroll Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that compiled WIKI preview scroll position is restored after switching away from and back to WIKI mode.

#### Scenario: Runtime audit records preview scroll restoration
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it scrolls the compiled WIKI preview frame before switching to FILE mode
- **AND** it returns to WIKI mode for the same selected markdown file
- **AND** it records the preview scroll target fraction and restored scroll fraction in the report
- **AND** it records whether the restored fraction is within parity tolerance

#### Scenario: Runtime audit fails missing preview scroll restoration
- **WHEN** compiled WIKI preview scroll evidence is absent, cannot scroll, or restores outside tolerance
- **THEN** runtime audit fails the affected project scenario

### Requirement: Generated Map Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the opened-project toolbar map control opens the native generated 3D map page and returns to the selected markdown page through app history.

#### Scenario: Runtime audit records generated map flow
- **WHEN** the runtime audit captures an opened-project scenario with `home.md` selected
- **THEN** it activates the toolbar map control
- **AND** it records that the generated preview frame displays `map-3d.html`
- **AND** it activates app Back navigation
- **AND** it records that `home.md` is selected again with the generated frame hidden

#### Scenario: Runtime audit fails generated map parity
- **WHEN** the map control is missing, `map-3d.html` is not shown, or Back does not restore the selected markdown page
- **THEN** runtime audit fails the affected project scenario

### Requirement: Watcher Refresh Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that project watcher events refresh the selected markdown preview through the preload bridge.

#### Scenario: Runtime audit records watcher refresh
- **WHEN** the runtime audit captures an opened-project scenario with scaffold `home.md` selected
- **THEN** it records that the renderer started the project watcher through preload
- **AND** it sends a project-change event for the selected markdown file with CSS change semantics
- **AND** it records that the renderer re-read the selected markdown file
- **AND** it records that the renderer requested a compiled preview refresh with invalidate semantics
- **AND** it records that the compiled preview refresh used CSS reload semantics
- **AND** it records that `home.md` remains the selected markdown page after the watcher refresh

#### Scenario: Runtime audit fails missing watcher refresh evidence
- **WHEN** watcher runtime evidence is absent, the watcher did not start, the selected markdown refresh was not compiled, CSS reload semantics were not used, or the selected markdown page was not preserved
- **THEN** runtime audit fails the affected project scenario

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

### Requirement: Preview Local Link Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that compiled-preview local links route through the preload bridge and app navigation state.

#### Scenario: Runtime audit records preview local link navigation
- **WHEN** the runtime audit captures an opened-project scenario with scaffold `home.md` selected
- **THEN** it clicks a local link inside the compiled WIKI preview frame
- **AND** it records that `wikiwise:resolvePreviewNavigation` observed the target compiled page URL
- **AND** it records that the resolver returned the matching markdown file result
- **AND** it records that Electron selected `index.md` after the click
- **AND** it records that app Back restored `home.md` with the compiled preview visible

#### Scenario: Runtime audit fails missing preview local link navigation
- **WHEN** preview local link runtime evidence is absent, the local link is unavailable, the preload resolver is not observed, the target markdown file is not selected, or Back does not restore the original markdown preview
- **THEN** runtime audit fails the affected project scenario

### Requirement: Split-View Toolbar Affordance Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the left-sidebar toolbar control matches native split-view affordance states.

#### Scenario: Runtime audit records left-sidebar affordance metadata
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** it records the visible-sidebar toolbar affordance metadata before hiding the sidebar
- **AND** it records the hidden-sidebar toolbar affordance metadata after hiding the sidebar
- **AND** it records that restore returns to the visible sidebar state

#### Scenario: Runtime audit fails missing left-sidebar affordance metadata
- **WHEN** visible-sidebar or hidden-sidebar affordance metadata is absent or mismatched
- **THEN** runtime audit fails the affected project scenario

### Requirement: Welcome Toolbar Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that welcome scenarios include the native toolbar brand row.

#### Scenario: Runtime audit records welcome toolbar
- **WHEN** the runtime audit captures a welcome scenario
- **THEN** it records whether the welcome toolbar is visible
- **AND** it records the welcome toolbar mark text
- **AND** it records the welcome toolbar title text
- **AND** it records welcome toolbar geometry evidence

#### Scenario: Runtime audit fails missing welcome toolbar
- **WHEN** the welcome toolbar is missing, hidden, or lacks the native `W` and `WikiWise` brand text
- **THEN** runtime audit fails the affected welcome scenario

### Requirement: Standalone File Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that standalone-file opens match native file-open service boundaries.

#### Scenario: Runtime audit records standalone file open
- **WHEN** the runtime audit captures a standalone-file scenario
- **THEN** it records that the selected standalone file is visible
- **AND** it records that the file tree is empty
- **AND** it records that project watcher and terminal services did not start
- **AND** it records that publish and generated-map affordances do not invoke project services

#### Scenario: Runtime audit fails standalone file mismatch
- **WHEN** a standalone-file scenario shows a populated file tree, starts project watcher or terminal services, enables publishing, opens generated map output, or loses the selected file
- **THEN** runtime audit fails the standalone-file scenario

### Requirement: Populated Info Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that populated optional INFO sections match the native right-sidebar behavior for a markdown document with `directions:` frontmatter and wikilinks.

#### Scenario: Runtime audit records populated INFO sections

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it creates a deterministic markdown fixture with `directions:` frontmatter and wikilinks
- **AND** it selects that fixture through the Electron file tree
- **AND** it activates the INFO tab
- **AND** it records that the Directions section is visible with the expected directions text
- **AND** it records that the Linked section is visible with the expected wikilink target
- **AND** it restores the selected `home.md` editor audit state after the populated INFO evidence is captured

#### Scenario: Runtime audit fails missing populated INFO evidence

- **WHEN** the populated INFO fixture is selected during runtime audit
- **THEN** runtime audit fails if the fixture cannot be selected
- **AND** runtime audit fails if the Directions section is hidden or contains the wrong text
- **AND** runtime audit fails if the Linked section is hidden or omits the expected wikilink target
- **AND** runtime audit fails if the audit cannot restore the selected `home.md` editor state

### Requirement: Publish Dialog Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that an opened project can display and dismiss the first-publish dialog through the real renderer.

#### Scenario: Runtime audit records first-publish dialog

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it opens the publish dialog from the project toolbar
- **AND** it records that the dialog is visible with the native publish title
- **AND** it records the generated subdomain candidate and final `https://<subdomain>.wiki-wise.com` URL shape
- **AND** it records the native publish-token warning copy
- **AND** it records the availability hint and inline indicator state
- **AND** it records that the `Publish` action remains disabled while availability is not available or owned
- **AND** it records that the first-publish dialog does not show `Unpublish...`
- **AND** it closes the dialog and restores the selected `home.md` editor audit state

#### Scenario: Runtime audit fails missing publish dialog evidence

- **WHEN** an opened-project runtime audit cannot open the publish dialog
- **THEN** runtime audit fails the project scenario
- **AND** runtime audit fails if title, URL row, token warning, availability evidence, disabled Publish state, hidden `Unpublish...`, cancel closure, or restored editor state is missing

### Requirement: Publish Feedback Runtime Evidence

The Electron runtime parity audit SHALL retain evidence that publish success, publish error, external browser, and unpublish feedback flows run through the real renderer and preload bridge.

#### Scenario: Runtime audit records publish feedback flows

- **WHEN** the runtime audit captures an opened scaffold project
- **THEN** it drives a successful first publish through the publish dialog after availability permits publishing
- **AND** it records the native `Published!` result title and first-publish result copy
- **AND** it records that the result has no duplicate standalone URL field
- **AND** it records that `Open in Browser` routes the published URL through the preload external URL bridge and dismisses the result
- **AND** it drives a publish failure and records the native `Publish Error` modal title, failure message, and dismissal behavior
- **AND** it records that an already-published project shows `Unpublish...`, opens the native destructive confirmation, and clears published config after successful unpublish
- **AND** it restores the selected `home.md` editor audit state after the publish feedback evidence is captured

#### Scenario: Runtime audit fails missing publish feedback evidence

- **WHEN** publish feedback runtime evidence is absent or incomplete
- **THEN** runtime audit fails the project scenario
- **AND** runtime audit fails if success copy, external-open routing, error modal copy, unpublish confirmation, unpublish cleanup, or restored editor state is missing

### Requirement: Clean Runtime Audit Success Shutdown
The Electron runtime audit SHALL exit successfully and cleanly after all scenario assertions pass and retained evidence is written.

#### Scenario: Successful audit exits cleanly
- **WHEN** the runtime audit command completes all scenarios with passing assertions
- **THEN** it writes the JSON report and screenshot artifacts
- **AND** it exits with status `0`
- **AND** it does not terminate through an immediate successful Electron process exit that can trap queued teardown work after report generation

#### Scenario: Failed audit remains non-zero
- **WHEN** the runtime audit detects failed scenario assertions or throws before successful completion
- **THEN** it exits non-zero
- **AND** it preserves the failure output needed for diagnosis

### Requirement: Animated Sidebar Layout Evidence Settlement
The Electron runtime audit SHALL measure sidebar visibility layout evidence after the native 200ms layout animation settles.

#### Scenario: Left-sidebar visibility evidence is captured
- **WHEN** the runtime audit activates the left-sidebar toolbar control
- **THEN** it waits longer than the native 200ms grid-template animation before recording hidden detail width and toolbar-title offset
- **AND** it waits again after restoring the sidebar before recording restored width and toolbar-title offset
- **AND** resize evidence, file-tree state evidence, toolbar affordance evidence, terminal evidence, and screenshot capture are unchanged

### Requirement: Resize Evidence Uses Immediate Drag Geometry
The Electron runtime audit SHALL be able to observe sidebar drag-resize geometry without the visibility animation delaying active drag measurements.

#### Scenario: Sidebar resize evidence is captured
- **WHEN** the runtime audit simulates left or right sidebar drag-resize
- **THEN** the active resize interaction updates project grid geometry without the sidebar visibility transition delaying the measured width
- **AND** the native toolbar hide/show transition remains enabled outside active resize gestures

### Requirement: Runtime Audit Graceful Window Shutdown

The Electron runtime audit SHALL close its audit BrowserWindow gracefully before the main process completes the audit command.

#### Scenario: Audit shutdown script is inspected
- **WHEN** the runtime audit script is inspected
- **THEN** it waits for the audit BrowserWindow to close
- **AND** it closes the BrowserWindow without forcing destruction

#### Scenario: Passing runtime audit exits cleanly
- **WHEN** all runtime audit scenario assertions pass
- **THEN** the command exits successfully after writing the retained report and screenshots

### Requirement: Real Terminal Runtime Evidence
The Electron runtime parity audit SHALL retain evidence from the real main-process PTY terminal path for opened-project scenarios.

#### Scenario: Project runtime audit sends input through real terminal IPC
- **WHEN** the runtime audit captures an opened-project scenario
- **THEN** terminal startup uses the production `wikiwise:startTerminal` handler instead of a synthetic terminal-start stub
- **AND** terminal input uses the production `wikiwise:sendTerminalInput` handler instead of a synthetic input-observation stub
- **AND** the audit sends a command through xterm and records the echoed command output in the report

#### Scenario: Real terminal runtime evidence fails parity
- **WHEN** the xterm terminal is missing, real terminal output is absent, or the audit command output is not echoed by the terminal
- **THEN** the runtime audit fails the affected opened-project scenario
