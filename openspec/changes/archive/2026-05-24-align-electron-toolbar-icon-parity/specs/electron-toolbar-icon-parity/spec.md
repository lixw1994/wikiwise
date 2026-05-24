## ADDED Requirements

### Requirement: Icon-Only Toolbar Controls
The Electron opened-project toolbar SHALL match native SwiftUI icon-only semantics for appearance, map, and sidebar controls.

#### Scenario: Toolbar controls render native symbol semantics
- **WHEN** a project is open
- **THEN** the appearance control exposes one of the native appearance symbol names
- **AND** the 3D map control exposes the native `map` symbol name
- **AND** the left sidebar control exposes the native `sidebar.left` symbol name
- **AND** the right sidebar control exposes the native `sidebar.right` symbol name

#### Scenario: Toolbar icon controls remain accessible
- **WHEN** the icon-only toolbar controls are rendered
- **THEN** each control keeps a descriptive `title`
- **AND** each control keeps a descriptive `aria-label`

#### Scenario: Toolbar icon controls do not show text labels
- **WHEN** the toolbar is rendered
- **THEN** the appearance control does not visibly show `Auto`, `Light`, or `Dark`
- **AND** the 3D map control does not visibly show `Map`

#### Scenario: Appearance mode changes toolbar symbol
- **WHEN** the user cycles appearance mode
- **THEN** the appearance control updates from the previous mode symbol to the new mode symbol
- **AND** the control label reflects the new mode.
