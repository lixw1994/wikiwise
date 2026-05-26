# electron-native-shell-parity Specification

## Purpose
Define Electron native shell visual parity for product branding, welcome content, toolbar chrome, window geometry, and removal of migration-only debug surfaces.

## Requirements
### Requirement: Product Shell Branding

The Electron app SHALL present product-facing shell branding without exposing Electron implementation labels in the user-visible window or renderer title.

#### Scenario: No-folder state is displayed

- **WHEN** the Electron renderer loads before a project is open
- **THEN** the document title is `Wikiwise`
- **AND** the visible welcome content does not include `Wikiwise Electron`
- **AND** the visible welcome content does not include `Cross-platform workspace`

#### Scenario: App window is created

- **WHEN** the Electron main process creates the app window
- **THEN** the window title is product-facing `Wikiwise`
- **AND** the title does not include `Electron`

### Requirement: Native Welcome Content

The Electron no-folder state SHALL match the native SwiftUI welcome content.

#### Scenario: Welcome content is inspected

- **WHEN** the welcome view is rendered
- **THEN** it presents the `W` mark
- **AND** it includes `WikiWise helps you turn any folder` copy
- **AND** it includes the `Create a New Wiki` action
- **AND** it includes the `Open Existing Folder` action
- **AND** it includes the hint `Don't have a wiki yet? Create one above and use Claude Code, Codex, or Cursor to build it out.`

### Requirement: Debug Resource UI Removed

The Electron renderer SHALL NOT expose the early shared-resources debug panel in production UI.

#### Scenario: Renderer shell is inspected

- **WHEN** the renderer HTML and styles are inspected
- **THEN** there is no `Shared resources` panel
- **AND** there are no `resource-count` or `resource-list` elements
- **AND** there are no resource-list styles for that panel

### Requirement: Debug Resource Bridge Removed

The Electron app SHALL NOT expose unused shared-resource metadata through production IPC or preload APIs.

#### Scenario: Bridge surface is inspected

- **WHEN** Electron main, preload, and renderer sources are inspected
- **THEN** there is no `wikiwise:listResources` IPC handler
- **AND** the preload bridge does not expose a `resources` method
- **AND** the renderer does not call `window.wikiwise.resources`

### Requirement: Full-Window Shell Layout

The Electron welcome and project states SHALL occupy the app window directly instead of sitting inside an outer debug-card layout.

#### Scenario: Shell layout is inspected

- **WHEN** Electron shell styles are inspected
- **THEN** the root shell is a full-window container
- **AND** the project shell uses the full viewport height
- **AND** the project shell does not depend on an outer card border radius for its primary app layout

### Requirement: Welcome Action Symbol Parity
The Electron no-folder welcome actions SHALL expose the same native action symbol semantics as the SwiftUI welcome buttons.

#### Scenario: Welcome actions are inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** the Create a New Wiki action exposes a `plus.circle` native-symbol marker before its label
- **AND** the Open Existing Folder action exposes a `folder` native-symbol marker before its label
- **AND** both welcome action labels remain unchanged
- **AND** the create/open action IDs and behaviors remain available for the existing welcome flows

### Requirement: Welcome Toolbar Brand Parity
The Electron no-folder state SHALL include the native SwiftUI welcome toolbar brand chrome.

#### Scenario: Welcome toolbar is inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** it includes a visible welcome toolbar before the centered welcome content
- **AND** the toolbar includes an italic `W` mark
- **AND** the toolbar includes the `WikiWise` label
- **AND** the toolbar uses native toolbar spacing, typography, and warm toolbar background
- **AND** the existing Create a New Wiki and Open Existing Folder actions remain available

### Requirement: Runtime App Icon Parity
The Electron app SHALL use the same bundled Wikiwise app icon for its running macOS application identity as the native SwiftUI app.

#### Scenario: Runtime app icon setup is inspected
- **WHEN** the native Swift app source and Electron main process source are inspected
- **THEN** the native app sets its application icon from bundled `Wikiwise.icns`
- **AND** the Electron main process resolves the same `Wikiwise.icns` native resource
- **AND** the Electron main process derives a native Electron image from that icon resource for runtime loading
- **AND** the Electron main process applies the derived icon through the macOS Dock icon API before normal windows or runtime audit work begin
- **AND** the Electron main window receives the derived icon where Electron supports a window icon option
