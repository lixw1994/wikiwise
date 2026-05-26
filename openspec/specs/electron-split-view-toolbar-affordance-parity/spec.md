# electron-split-view-toolbar-affordance-parity Specification

## Purpose
Define Electron split-view toolbar affordance parity for visible native sidebar controls, hidden restore controls, accessibility metadata, and runtime evidence.

## Requirements
### Requirement: Left Sidebar Split-View Toolbar Affordance
The Electron opened-project toolbar SHALL expose native split-view left-sidebar affordance semantics for both visible and hidden sidebar states.

#### Scenario: Left sidebar is visible
- **WHEN** an Electron project is open and the left sidebar is visible
- **THEN** the left-sidebar toolbar control exposes the native `sidebar.left` symbol
- **AND** it exposes `Hide Sidebar` through `title` and `aria-label`
- **AND** it marks itself as a `system-split-view-toggle` affordance
- **AND** it marks its sidebar action as `hide`

#### Scenario: Left sidebar is hidden
- **WHEN** an Electron project is open and the left sidebar is hidden
- **THEN** the left-sidebar toolbar control exposes the native `sidebar.left` symbol
- **AND** it exposes `Show Sidebar` through `title` and `aria-label`
- **AND** it marks itself as a `custom-restore-control` affordance
- **AND** it marks its sidebar action as `show`

### Requirement: Split-View Toolbar Runtime Evidence
The Electron runtime parity audit SHALL retain evidence for visible and hidden left-sidebar toolbar affordance states.

#### Scenario: Runtime audit records split-view affordance states
- **WHEN** the runtime audit hides and restores the left sidebar in an opened-project scenario
- **THEN** it records the left-sidebar toolbar affordance, action, symbol, title, and aria-label before hiding
- **AND** it records the left-sidebar toolbar affordance, action, symbol, title, and aria-label while hidden
- **AND** it records that the sidebar hides and restores through the same control

#### Scenario: Runtime audit fails missing split-view affordance evidence
- **WHEN** visible or hidden left-sidebar toolbar affordance evidence is missing or does not match native state semantics
- **THEN** runtime audit fails the affected project scenario
