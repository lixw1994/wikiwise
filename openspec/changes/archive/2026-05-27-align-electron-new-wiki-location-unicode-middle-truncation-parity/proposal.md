## Why

Native SwiftUI displays the new-wiki location path with `Text(...).lineLimit(1).truncationMode(.middle)`, which shortens the rendered string without splitting Unicode characters. Electron currently mirrors the middle truncation with JavaScript `.length` and `.slice`, which count UTF-16 code units and can display broken surrogate halves for long paths containing supplementary-plane characters.

## What Changes

- Align Electron's new-wiki location middle truncation helper with native whole-character display behavior for Unicode paths.
- Preserve the existing beginning/ellipsis/trailing-folder shape, full-path title and accessibility metadata, chosen directory value, dialog layout, and scaffold creation behavior.
- Add regression coverage anchored to `Sources/Wikiwise/ContentView.swift` so future truncation changes are deliberate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `electron-new-wiki-scaffold`: Require Unicode-safe middle truncation for the new-wiki location display while preserving full path metadata and creation behavior.
- `electron-native-parity-roadmap`: Track new-wiki location Unicode middle truncation parity as a native dialog polish gap closure phase.

## Impact

- Affected code: `apps/electron/src/renderer/renderer.js`
- Affected tests: `apps/electron/test/new-wiki-scaffold.test.js`
- Affected specs: `openspec/specs/electron-new-wiki-scaffold`, `openspec/specs/electron-native-parity-roadmap`
- No filesystem, IPC, scaffold output, release, dependency, or network changes.
