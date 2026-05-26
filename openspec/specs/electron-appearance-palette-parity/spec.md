# electron-appearance-palette-parity Specification

## Purpose
Defines the Electron renderer shell palette contract for matching Wikiwise's native SwiftUI light and dark appearance colors across primary visible surfaces and runtime audit evidence.
## Requirements
### Requirement: Native Adaptive Shell Palette
The Electron renderer SHALL apply native-equivalent light and dark palette tokens to primary shell surfaces.

#### Scenario: Light appearance is active
- **WHEN** the renderer appearance mode is `Light`
- **THEN** welcome, toolbar, sidebar, detail, right sidebar, dialog, and file tree surfaces use the native warm light palette
- **AND** selected text, rules, accent buttons, and folder icons use native light color tokens

#### Scenario: Dark appearance is active
- **WHEN** the renderer appearance mode is `Dark`
- **THEN** welcome, toolbar, sidebar, detail, right sidebar, dialog, and file tree surfaces switch to native dark palette colors
- **AND** selected text, rules, accent buttons, and folder icons use native dark color tokens
- **AND** visible panels are not left on hard-coded light backgrounds

### Requirement: Appearance Palette Runtime Evidence
The Electron runtime audit SHALL verify that dark appearance scenarios activate dark shell colors.

#### Scenario: Runtime audit captures dark appearance
- **WHEN** runtime audit captures `welcome-dark` or `project-dark`
- **THEN** it records computed shell surface colors
- **AND** it records that dark appearance palette evidence is active
- **AND** it fails if key shell surfaces remain light-colored

### Requirement: Auto Appearance Follows System Palette
The Electron renderer SHALL resolve stored `Auto` appearance to the current system light or dark palette while preserving `Auto` as the user-selected mode.

#### Scenario: Auto appearance resolves to system dark
- **WHEN** the renderer stored appearance mode is `Auto`
- **AND** the system color scheme is dark
- **THEN** the renderer keeps `Auto` as the stored appearance state
- **AND** the active shell palette uses the same dark tokens as explicit `Dark`

#### Scenario: Auto appearance resolves to system light
- **WHEN** the renderer stored appearance mode is `Auto`
- **AND** the system color scheme is light
- **THEN** the renderer keeps `Auto` as the stored appearance state
- **AND** the active shell palette uses the same light tokens as explicit `Light`

#### Scenario: System appearance changes while Auto is active
- **WHEN** the stored appearance mode is `Auto`
- **AND** the system color scheme changes between light and dark
- **THEN** the renderer updates the resolved shell palette without changing the stored appearance mode
- **AND** terminal theme application is refreshed for the new resolved palette
