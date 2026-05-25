## ADDED Requirements

### Requirement: Generated Map Runtime Evidence
The Electron runtime parity audit SHALL retain evidence that the opened-project toolbar map control opens the native generated 3D map page and returns to the selected markdown page through app history.

#### Scenario: Runtime audit records generated map flow
- **WHEN** the runtime audit captures an opened-project scenario with `home.md` selected
- **THEN** it activates the toolbar map control
- **AND** it records that the generated preview frame displays `map-3d.html`
- **AND** it activates app Back navigation
- **AND** it records that `home.md` is selected again with the generated frame hidden

#### Scenario: Runtime audit fails generated map parity
- **WHEN** the map control is missing, `map-3d.html` is not shown, or Back does not restore the selected markdown page
- **THEN** runtime audit fails the affected project scenario
