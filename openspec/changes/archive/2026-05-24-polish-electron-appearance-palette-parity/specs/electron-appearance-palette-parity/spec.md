## ADDED Requirements

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
