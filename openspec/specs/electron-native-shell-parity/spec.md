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

### Requirement: Runtime App Activation Parity
The Electron app SHALL mirror the native SwiftUI app's macOS startup activation behavior.

#### Scenario: Runtime activation setup is inspected
- **WHEN** the native Swift app source and Electron main process source are inspected
- **THEN** the native app sets its activation policy to regular
- **AND** the native app activates itself while ignoring other apps
- **AND** the Electron main process applies a regular activation policy when Electron exposes the macOS API
- **AND** the Electron main process focuses the app with foreground-stealing startup semantics
- **AND** the Electron activation setup runs before normal windows or runtime audit work begin

### Requirement: Native Titlebar Chrome Parity
The Electron app SHALL mirror the native SwiftUI app's visible macOS titlebar chrome for welcome and project windows.

#### Scenario: Native titlebar chrome is inspected
- **WHEN** the native Swift app source and Electron shell sources are inspected
- **THEN** the native app clears the visible window title
- **AND** the native app removes the titlebar separator
- **AND** the Electron main window uses macOS hidden-inset titlebar chrome while retaining product-facing `Wikiwise` identity
- **AND** the Electron renderer reserves leading toolbar space for native macOS traffic-light controls
- **AND** the Electron welcome and project toolbars expose draggable titlebar regions without making toolbar controls draggable

### Requirement: Welcome Copy Line Spacing Parity
The Electron no-folder welcome screen SHALL match the native SwiftUI line-spacing rhythm for the main welcome summary and helper hint text.

#### Scenario: Welcome copy typography is inspected
- **WHEN** the Electron welcome view is rendered
- **THEN** the main welcome summary uses 15px text with a 19px line height, matching SwiftUI 15px text with `.lineSpacing(4)`
- **AND** the helper hint uses 12px text with a 15px line height, matching SwiftUI 12px text with `.lineSpacing(3)`
- **AND** welcome copy, intentional line breaks, action buttons, action symbols, toolbar brand styling, colors, and overall welcome layout are unchanged

### Requirement: Welcome Secondary Action Foreground Parity

The Electron no-folder welcome secondary action SHALL use the same foreground color role as the native SwiftUI "Open Existing Folder" button.

#### Scenario: Welcome secondary action is inspected
- **WHEN** the Electron welcome view is rendered before a project is open
- **THEN** the Open Existing Folder action uses `--color-sidebar-selected-text` for its label and native-symbol foreground, matching SwiftUI `Color.sidebarSelectedText`
- **AND** the shared non-welcome `.secondary-action` color remains `--color-control-text`
- **AND** welcome action labels, native-symbol metadata, width, padding, border, background, and click behavior remain unchanged

### Requirement: Welcome Mark Foreground Parity

The Electron no-folder welcome mark SHALL use the same foreground color role as the native SwiftUI centered `W` mark.

#### Scenario: Welcome mark is inspected
- **WHEN** the Electron welcome view is rendered before a project is open
- **THEN** the centered `W` mark uses `--color-sidebar-selected-text`, matching SwiftUI `Color.sidebarSelectedText`
- **AND** the mark preserves native-like 48px light italic serif typography
- **AND** toolbar brand styling, welcome copy, action buttons, and overall welcome layout remain unchanged
