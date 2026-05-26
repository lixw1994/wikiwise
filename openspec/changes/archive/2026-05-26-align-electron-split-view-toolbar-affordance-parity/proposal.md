## Why

The roadmap still lists exact split-view toolbar affordance parity as a final non-release gap because Electron's left-sidebar toolbar button is only tested as a generic hide/show control. The native SwiftUI app has distinct split-view states: a system sidebar toggle while the sidebar is visible, and a custom `Show Sidebar` restore affordance when the split-view sidebar is closed.

## What Changes

- Add explicit Electron toolbar state semantics for the left-sidebar control:
  - visible sidebar: native system split-view toggle surrogate that hides the sidebar
  - hidden sidebar: custom restore affordance matching SwiftUI's `Show Sidebar` control
- Retain runtime audit evidence for both affordance states while continuing to verify hide/restore behavior, layout expansion, and toolbar title offset.
- Update roadmap tracking so split-view toolbar affordance parity is no longer left as an unclosed non-release gap after this phase archives.

## Capabilities

### New Capabilities

- `electron-split-view-toolbar-affordance-parity`: covers native split-view toolbar state semantics for the Electron left-sidebar control.

### Modified Capabilities

- `electron-toolbar-icon-parity`: add state-specific native affordance semantics for the left-sidebar toolbar control.
- `electron-runtime-parity-audit`: add runtime evidence for the visible and hidden split-view toolbar affordance states.
- `electron-native-parity-roadmap`: record this phase and narrow remaining final migration evidence to signed/notarized release execution or accepted deviations.

## Impact

- Affected Electron renderer surfaces: toolbar render state, left-sidebar toggle metadata, runtime audit evidence.
- Affected tests: Electron chrome/menu parity tests and runtime parity audit tests.
- Affected OpenSpec surfaces: toolbar icon parity, runtime parity audit, native parity roadmap, and the new split-view toolbar affordance spec.
- No production release, compiler, file tree, terminal, publishing, scaffold, or dependency changes are expected.
