# electron-toolbar-icon-parity Specification

## Purpose
Define opened-project Electron toolbar icon semantics that mirror native SwiftUI toolbar controls while preserving accessible labels and runtime audit evidence.
## Requirements
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

#### Scenario: Left sidebar restore control uses native help
- **WHEN** the left sidebar is hidden and the toolbar control will restore it
- **THEN** the left sidebar control exposes `Show Sidebar` through `title`
- **AND** the left sidebar control exposes `Show Sidebar` through `aria-label`
- **AND** the left sidebar control does not use `Toggle left sidebar` as its restore-state help

#### Scenario: Toolbar icon controls do not show text labels
- **WHEN** the toolbar is rendered
- **THEN** the appearance control does not visibly show `Auto`, `Light`, or `Dark`
- **AND** the 3D map control does not visibly show `Map`

#### Scenario: Appearance mode changes toolbar symbol
- **WHEN** the user cycles appearance mode
- **THEN** the appearance control updates from the previous mode symbol to the new mode symbol
- **AND** the control label reflects the new mode.

### Requirement: Sidebar Toolbar Toggle Color Parity
The Electron sidebar toolbar toggle controls SHALL match the native SwiftUI plain-icon foreground color states instead of using selected-button chrome.

#### Scenario: Sidebar toolbar toggles use native color states
- **WHEN** a project toolbar is rendered
- **THEN** visible sidebar toggles use the toolbar text color with a transparent background
- **AND** hidden sidebar toggles use the toolbar disabled color
- **AND** sidebar toolbar toggles do not use sidebar selected background or selected text colors for their visible state
- **AND** sidebar toggle symbol names, titles, aria labels, `aria-pressed` state, click behavior, sidebar layout behavior, and toolbar title offset behavior are not changed for this requirement

### Requirement: Toolbar Icon Size Parity
The Electron opened-project icon-only toolbar controls SHALL match native SwiftUI symbol font sizes while preserving existing symbols and behavior.

#### Scenario: Icon-only toolbar controls use native symbol sizes
- **WHEN** a project toolbar is rendered
- **THEN** the appearance control uses a 13px icon size
- **AND** the 3D map control uses a 12px icon size
- **AND** the left sidebar restore control uses a 14px icon size
- **AND** the right sidebar toggle uses a 16px icon size
- **AND** Back/Forward arrow typography, toolbar group spacing, sidebar toggle color states, symbol names, titles, aria labels, click behavior, sidebar layout behavior, and project title offset behavior are not changed for this requirement

### Requirement: Toolbar Plain Icon Chrome Parity
The Electron opened-project icon-only toolbar controls SHALL match native SwiftUI `.buttonStyle(.plain)` chrome by avoiding custom bordered rounded button styling.

#### Scenario: Icon-only toolbar controls use plain chrome
- **WHEN** a project toolbar is rendered
- **THEN** Electron icon-only toolbar controls do not draw a border
- **AND** Electron icon-only toolbar controls do not add rounded rectangle chrome
- **AND** mode segmented controls and the publish action keep their explicit native rounded rectangle chrome
- **AND** toolbar symbol names, icon sizes, color states, accessible labels, click behavior, toolbar group spacing, sidebar layout behavior, and project title offset behavior are not changed for this requirement

### Requirement: Toolbar Intrinsic Icon Sizing Parity
The Electron opened-project icon-only toolbar controls SHALL use intrinsic plain-button sizing instead of invisible fixed button boxes.

#### Scenario: Icon-only toolbar controls size to their symbols
- **WHEN** a project toolbar is rendered
- **THEN** Electron icon-only toolbar controls do not impose a fixed minimum width
- **AND** Electron icon-only toolbar controls do not impose fixed inline or block sizes
- **AND** Electron icon-only toolbar controls do not add extra padding beyond their symbol/text content
- **AND** mode segmented controls and the publish action keep their explicit native padding
- **AND** toolbar symbol names, icon sizes, plain chrome, color states, accessible labels, click behavior, toolbar group spacing, sidebar layout behavior, and project title offset behavior are not changed for this requirement

### Requirement: Left Sidebar Split-View Affordance Semantics
The Electron left-sidebar toolbar control SHALL distinguish the native system split-view toggle state from the native custom restore state while preserving icon-only toolbar styling.

#### Scenario: Visible sidebar affordance is rendered
- **WHEN** the left sidebar is visible
- **THEN** the left-sidebar toolbar control keeps icon-only plain button styling
- **AND** the control exposes `system-split-view-toggle` native affordance metadata
- **AND** the control exposes `hide` sidebar action metadata

#### Scenario: Hidden sidebar affordance is rendered
- **WHEN** the left sidebar is hidden
- **THEN** the left-sidebar toolbar control keeps icon-only plain button styling
- **AND** the control exposes `custom-restore-control` native affordance metadata
- **AND** the control exposes `show` sidebar action metadata
