## MODIFIED Requirements

### Requirement: Deferred Preview Gaps

The compiler preview phase SHALL identify native preview gaps that remain for later OpenSpec phases.

#### Scenario: Preview is shown

- **WHEN** the renderer displays compiled HTML
- **THEN** the phase verification records that live rebuild, in-preview navigation parity, and map toolbar parity remain deferred

## ADDED Requirements

### Requirement: Compiled Preview Scroll Preservation
The Electron compiled Wiki preview SHALL preserve scroll position when switching views or refreshing the same compiled preview, matching the native WebView scroll-fraction behavior.

#### Scenario: User switches away from Wiki preview
- **WHEN** the user is viewing a compiled markdown page in WIKI mode and switches to FILE mode
- **THEN** Electron captures the compiled preview iframe scroll fraction before changing modes
- **AND** Electron stores that fraction on the selected file state

#### Scenario: User returns to Wiki preview
- **WHEN** the user switches back to WIKI mode for the same selected file
- **THEN** Electron restores the saved scroll fraction after the compiled preview iframe finishes loading

#### Scenario: Current Wiki preview refreshes
- **WHEN** Electron reloads the same compiled preview file for the selected markdown page
- **THEN** Electron captures the current preview scroll fraction before the reload
- **AND** Electron restores that fraction after the preview iframe finishes loading
