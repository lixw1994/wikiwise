## Why

The Electron project view still has a visible left-sidebar mismatch: it renders a project-name heading under `Files`, while the native SwiftUI sidebar renders only the monospaced `FILES` header followed directly by the file tree. The Electron header typography also comes from the generic eyebrow style instead of the native sidebar header treatment.

## What Changes

- Remove the extra Electron-only project heading from the left sidebar.
- Keep the project name in the centered toolbar title, matching the native app's project naming location.
- Render the left-sidebar header as literal `FILES`.
- Align the Electron sidebar header typography and spacing with the SwiftUI `Text("FILES")` styling.
- Add structural parity tests that compare the SwiftUI sidebar header source with Electron HTML/CSS/renderer source.

## Success Criteria

- Electron left sidebar shows `FILES` followed directly by the file tree.
- Electron no longer renders or updates a sidebar project-name heading.
- Electron toolbar project-name behavior is unchanged.
- Targeted Electron parity tests fail before implementation and pass after implementation.
- Full Electron tests, Swift build, OpenSpec validation, whitespace check, and macOS Electron packaging all pass.

## Non-Goals

- Do not change file tree ordering, expansion, icons, selection, or navigation behavior.
- Do not change toolbar title offset behavior.
- Do not claim full Electron/native parity beyond this sidebar header slice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-file-tree-visual-parity`: Add the native left-sidebar header requirement, including removal of the Electron-only project heading and native-aligned `FILES` typography/spacing.

## Impact

- Affected code: Electron renderer HTML/CSS/JavaScript, Electron native shell parity tests, and OpenSpec specs.
- No Swift source changes are planned.
- No new dependencies are planned.
