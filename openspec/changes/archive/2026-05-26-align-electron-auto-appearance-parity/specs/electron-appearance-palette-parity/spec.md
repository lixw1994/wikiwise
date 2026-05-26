## ADDED Requirements

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
