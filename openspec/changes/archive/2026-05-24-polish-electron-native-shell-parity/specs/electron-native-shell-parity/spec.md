## ADDED Requirements

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
