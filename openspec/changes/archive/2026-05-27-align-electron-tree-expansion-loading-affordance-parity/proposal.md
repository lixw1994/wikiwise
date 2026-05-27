## Why

Native SwiftUI folder expansion uses a plain folder row whose disclosure text is always either `▸` or `▾`. Expansion scans children synchronously through `expandNode(node)` and does not show a temporary loading glyph or visibly disable the folder button. Electron currently exposes its async IPC loading state directly in the row by replacing the disclosure with `...` and disabling the folder button, creating a visible file-tree mismatch.

## What Changes

- Remove Electron's visible folder-row loading affordance during lazy expansion.
- Keep the internal async guard that prevents duplicate expansion requests.
- Preserve path-safe lazy expansion IPC, expanded/collapsed disclosure states, native folder icons, special folder styling, and nested selection behavior.
- Add regression coverage tying Electron's renderer output to the native SwiftUI folder row source.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-file-tree-expansion-parity`: clarify that lazy expansion must not add non-native loading row chrome.
- `electron-native-parity-roadmap`: record this tree loading-affordance correction as a file-tree visual/interaction parity phase.

## Impact

- Affected files: Electron renderer tree rendering/expansion flow, file-tree parity tests, and OpenSpec artifacts.
- No main-process IPC, core filesystem scanning, selection pipeline, watcher behavior, publishing, packaging, or Swift source changes.
